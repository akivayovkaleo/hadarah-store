import { NextRequest, NextResponse } from 'next/server';
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/src/services/firebase';
import type {
  CheckoutOrder,
  OrderStatus,
  PaymentData,
  PaymentMethod,
} from '@/src/types/order';
import { env } from '@/src/lib/env';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function normalizePaymentMethod(raw: string): PaymentMethod {
  if (raw === 'credit' || raw === 'credit_card') return 'credit_card';
  if (raw === 'pix' || raw === 'boleto') return raw;
  return 'credit_card';
}

function validateOrder(body: CheckoutOrder): string | null {
  if (!body.referenceId)            return 'referenceId é obrigatório';
  if (!body.customer?.name)         return 'Nome do cliente é obrigatório';
  if (!body.customer?.email)        return 'E-mail do cliente é obrigatório';
  if (!body.customer?.taxId)        return 'CPF/CNPJ é obrigatório';
  if (!body.customer?.phone)        return 'Telefone é obrigatório';
  if (!body.items?.length)          return 'O pedido deve conter ao menos 1 item';
  if (!body.address?.street)        return 'Endereço é obrigatório';
  if (!body.address?.city)          return 'Cidade é obrigatória';
  if (!body.address?.state)         return 'Estado é obrigatório';
  if (!body.address?.postalCode)    return 'CEP é obrigatório';
  if (!body.total || body.total <= 0) return 'Total inválido';
  return null;
}

/** Monta o payload que o PagBank espera, incluindo a cobrança correta por método. */
function buildPagBankPayload(order: CheckoutOrder, method: PaymentMethod) {
  const totalCents = Math.round(order.total * 100);

  const base = {
    reference_id: order.referenceId,
    customer: {
      name: order.customer.name,
      email: order.customer.email,
      tax_id: order.customer.taxId,
      phones: [
        {
          country: '55',
          area: order.customer.phone.replace(/\D/g, '').slice(0, 2),
          number: order.customer.phone.replace(/\D/g, '').slice(2),
          type: 'MOBILE',
        },
      ],
    },
    items: order.items.map((item) => ({
      reference_id: item.id,
      name: item.name.slice(0, 64), // limite PagBank
      quantity: item.quantity,
      unit_amount: Math.round(item.price * 100),
    })),
    shipping: {
      amount: Math.round(order.shipping * 100),
      address: {
        street: order.address.street,
        number: order.address.number,
        complement: order.address.complement ?? '',
        locality: order.address.neighborhood,
        city: order.address.city,
        region_code: order.address.state,
        country: 'BRA',
        postal_code: order.address.postalCode.replace(/\D/g, ''),
      },
    },
    notification_urls: [`${env.baseUrl}/api/payments/pagbank/webhook`],
  };

  const chargeBase = {
    reference_id: order.referenceId,
    description: 'Pedido Hadarah Store',
    amount: { value: totalCents, currency: 'BRL' },
  };

  if (method === 'pix') {
    return {
      ...base,
      charges: [
        {
          ...chargeBase,
          payment_method: { type: 'PIX', installments: 1, capture: true },
        },
      ],
    };
  }

  if (method === 'boleto') {
    const dueDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];
    return {
      ...base,
      charges: [
        {
          ...chargeBase,
          payment_method: {
            type: 'BOLETO',
            installments: 1,
            capture: true,
            boleto: {
              due_date: dueDate,
              instruction_lines: {
                line_1: 'Hadarah Store — pagamento de pedido',
                line_2: order.referenceId,
              },
              holder: {
                name: order.customer.name,
                tax_id: order.customer.taxId,
                email: order.customer.email,
                address: {
                  street: order.address.street,
                  number: order.address.number,
                  complement: order.address.complement ?? '',
                  locality: order.address.neighborhood,
                  city: order.address.city,
                  region_code: order.address.state,
                  country: 'BRA',
                  postal_code: order.address.postalCode.replace(/\D/g, ''),
                },
              },
            },
          },
        },
      ],
    };
  }

  // Cartão de crédito — requer tokenização client-side via SDK PagBank.js.
  // O token do cartão deve ser enviado pelo frontend como `body.cardToken`.
  return {
    ...base,
    charges: [
      {
        ...chargeBase,
        payment_method: {
          type: 'CREDIT_CARD',
          installments: 1,
          capture: true,
          // card: { encrypted: body.cardToken } — adicionar quando tokenização estiver implementada
        },
      },
    ],
  };
}

/** Extrai dados de pagamento relevantes da resposta do PagBank. */
function extractPaymentData(
  pagbankResult: Record<string, unknown>,
  method: PaymentMethod,
): PaymentData {
  const charges = pagbankResult.charges as Array<Record<string, unknown>> | undefined;
  const charge = charges?.[0];
  const pm = charge?.payment_method as Record<string, unknown> | undefined;
  const paymentData: PaymentData = {};

  if (method === 'pix' && pm) {
    const qrCodes = pm.qr_codes as Array<Record<string, unknown>> | undefined;
    const qr = qrCodes?.[0];
    if (qr) {
      paymentData.pixQrCodeText = qr.text as string | undefined;
      const links = qr.links as Array<Record<string, unknown>> | undefined;
      const png = links?.find((l) =>
        (l.rel as string | undefined)?.includes('PNG'),
      );
      if (png) paymentData.pixQrCode = png.href as string | undefined;
    }
  }

  if (method === 'boleto' && pm) {
    const boleto = pm.boleto as Record<string, unknown> | undefined;
    if (boleto) {
      paymentData.boletoBarcode = boleto.barcode as string | undefined;
      const pdf = boleto.pdf as Record<string, unknown> | undefined;
      paymentData.boletoUrl = pdf?.url as string | undefined;
    }
  }

  return paymentData;
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  let orderId: string | null = null;

  try {
    const body = (await req.json()) as CheckoutOrder;

    // 1. Validação
    const validationError = validateOrder(body);
    if (validationError) {
      return NextResponse.json(
        { success: false, message: validationError },
        { status: 400 },
      );
    }

    const method = normalizePaymentMethod(body.paymentMethod as string);

    // 2. Persiste pedido no Firestore com status "pending"
    const docRef = await addDoc(collection(db, 'orders'), {
      referenceId: body.referenceId,
      status: 'pending' as OrderStatus,
      customer: body.customer,
      items: body.items,
      address: body.address,
      shipping: body.shipping,
      total: body.total,
      paymentMethod: method,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    orderId = docRef.id;

    // 3. Chama a API do PagBank
    const payload = buildPagBankPayload(body, method);
    const pagbankRes = await fetch(`${env.pagbankApiUrl}/orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.pagbankToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const pagbankData = (await pagbankRes.json()) as Record<string, unknown>;

    if (!pagbankRes.ok) {
      const msg =
        (pagbankData?.error_messages as Array<{ description: string }> | undefined)
          ?.map((e) => e.description)
          .join('; ') ||
        (pagbankData?.message as string | undefined) ||
        'Erro ao criar pedido no PagBank';
      throw new Error(msg);
    }

    // 4. Extrai dados de pagamento e atualiza o Firestore
    const paymentData = extractPaymentData(pagbankData, method);
    const pagbankOrderId = pagbankData.id as string | undefined;

    await updateDoc(doc(db, 'orders', orderId), {
      pagbankOrderId,
      paymentData,
      updatedAt: serverTimestamp(),
    });

    // 5. Retorna orderId para o frontend redirecionar para /pedido/{orderId}
    return NextResponse.json({
      success: true,
      orderId,
      pagbankOrderId,
      paymentData,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Erro interno ao processar o pagamento';
    console.error('[pagbank/create] Erro:', error);

    // Marca o pedido como falho se já foi criado no Firestore
    if (orderId) {
      try {
        await updateDoc(doc(db, 'orders', orderId), {
          status: 'failed' as OrderStatus,
          updatedAt: serverTimestamp(),
        });
      } catch (updateErr) {
        console.error('[pagbank/create] Falha ao atualizar status para "failed":', updateErr);
      }
    }

    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
