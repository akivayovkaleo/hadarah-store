import { NextRequest, NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'crypto';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  runTransaction,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/src/services/firebase';
import { env } from '@/src/lib/env';
import type { OrderStatus } from '@/src/types/order';

// ─── Tipos internos do payload do PagBank ────────────────────────────────────

interface PagBankCharge {
  id?: string;
  status?: string;
}

interface PagBankWebhookEvent {
  id?: string;
  reference_id?: string;
  charges?: PagBankCharge[];
}

// ─── Validação de assinatura HMAC-SHA256 ────────────────────────────────────
// PagBank envia o header "x-pagbank-hmac-sha256" com o HMAC em base64.
// Se PAGBANK_WEBHOOK_SECRET não estiver configurado, a validação é ignorada
// (útil em desenvolvimento com ngrok / ferramentas locais).

function verifySignature(rawBody: string, header: string, secret: string): boolean {
  if (!secret) return true;
  try {
    const expected = createHmac('sha256', secret).update(rawBody).digest('base64');
    const expectedBuf = Buffer.from(expected);
    const receivedBuf = Buffer.from(header);
    if (expectedBuf.length !== receivedBuf.length) return false;
    return timingSafeEqual(expectedBuf, receivedBuf);
  } catch {
    return false;
  }
}

// ─── Mapeamento de status PagBank → nosso status ────────────────────────────

function mapStatus(pagbankStatus: string): OrderStatus | null {
  switch (pagbankStatus.toUpperCase()) {
    case 'PAID':        return 'paid';
    case 'DECLINED':
    case 'CANCELED':    return 'failed';
    case 'WAITING':
    case 'IN_ANALYSIS': return 'pending';
    default:            return null;
  }
}

// ─── Decremento de estoque em transação Firestore ───────────────────────────

async function decrementStock(
  items: Array<{ id: string; size?: string; quantity: number }>,
) {
  await runTransaction(db, async (tx) => {
    for (const item of items) {
      if (!item.id || !item.size) continue;

      const productRef = doc(db, 'products', item.id);
      const productSnap = await tx.get(productRef);
      if (!productSnap.exists()) continue;

      const sizes = {
        ...((productSnap.data().sizes as Record<string, number>) ?? {}),
      };
      const current = sizes[item.size] ?? 0;
      sizes[item.size] = Math.max(0, current - item.quantity);

      tx.update(productRef, { sizes });
    }
  });
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const rawBody = await req.text();

  // 1. Validar assinatura
  const signature = req.headers.get('x-pagbank-hmac-sha256') ?? '';
  if (!verifySignature(rawBody, signature, env.pagbankWebhookSecret)) {
    console.warn('[webhook] Assinatura inválida');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2. Parsear payload
  let event: PagBankWebhookEvent;
  try {
    event = JSON.parse(rawBody) as PagBankWebhookEvent;
  } catch {
    return NextResponse.json({ error: 'Payload inválido' }, { status: 400 });
  }

  const referenceId = event.reference_id;
  if (!referenceId) {
    // Evento não relacionado a um pedido — aceitar silenciosamente
    return NextResponse.json({ received: true });
  }

  // 3. Extrair status da primeira cobrança
  const charge = event.charges?.[0];
  const pagbankStatus = charge?.status;
  if (!pagbankStatus) {
    return NextResponse.json({ received: true });
  }

  const newStatus = mapStatus(pagbankStatus);
  if (!newStatus) {
    return NextResponse.json({ received: true });
  }

  try {
    // 4. Localizar pedido pelo referenceId
    const ordersRef = collection(db, 'orders');
    const snap = await getDocs(
      query(ordersRef, where('referenceId', '==', referenceId)),
    );

    if (snap.empty) {
      console.warn(`[webhook] Pedido não encontrado: referenceId=${referenceId}`);
      // Responder 200 para o PagBank não reenviar indefinidamente
      return NextResponse.json({ received: true });
    }

    const orderDoc = snap.docs[0];
    const orderData = orderDoc.data();

    // Ignorar se o status já é final (paid / failed / cancelled)
    const currentStatus = orderData.status as OrderStatus;
    if (currentStatus === 'paid' || currentStatus === 'cancelled') {
      return NextResponse.json({ received: true });
    }

    // 5. Atualizar status do pedido
    await updateDoc(doc(db, 'orders', orderDoc.id), {
      status: newStatus,
      pagbankOrderId: event.id ?? orderData.pagbankOrderId,
      updatedAt: serverTimestamp(),
    });

    // 6. Se pago: decrementar estoque dos produtos (transação atômica)
    if (newStatus === 'paid') {
      const items = (
        orderData.items as Array<{ id: string; size?: string; quantity: number }>
      ) ?? [];

      try {
        await decrementStock(items);
      } catch (stockErr) {
        // Logar mas não falhar o webhook — o pedido já foi marcado como pago
        console.error('[webhook] Erro ao decrementar estoque:', stockErr);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[webhook] Erro interno:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
