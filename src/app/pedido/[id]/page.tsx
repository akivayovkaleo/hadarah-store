'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/src/services/firebase';
import Navbar from '@/src/components/Navbar';
import Footer from '@/src/components/Footer';
import type { StoredOrder, OrderStatus } from '@/src/types/order';

// ─── Formatação ───────────────────────────────────────────────────────────────
const fmt = (n: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n);

// ─── Componentes de status ───────────────────────────────────────────────────

type StatusConfig = {
  label: string;
  sublabel: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: React.ReactNode;
};

function getStatusConfig(status: OrderStatus): StatusConfig {
  const base = 'w-5 h-5';
  switch (status) {
    case 'paid':
      return {
        label: 'Pagamento confirmado',
        sublabel: 'Seu pedido foi aprovado e está sendo preparado.',
        color: 'text-green-400',
        bgColor: 'bg-green-400/10',
        borderColor: 'border-green-400/30',
        icon: (
          <svg className={`${base} text-green-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ),
      };
    case 'pending':
      return {
        label: 'Aguardando pagamento',
        sublabel: 'Realize o pagamento para confirmar seu pedido.',
        color: 'text-[#D4AF37]',
        bgColor: 'bg-[#D4AF37]/10',
        borderColor: 'border-[#D4AF37]/30',
        icon: (
          <svg className={`${base} text-[#D4AF37] animate-spin`} fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ),
      };
    case 'failed':
      return {
        label: 'Pagamento recusado',
        sublabel: 'Não foi possível processar o pagamento. Tente novamente.',
        color: 'text-red-400',
        bgColor: 'bg-red-400/10',
        borderColor: 'border-red-400/30',
        icon: (
          <svg className={`${base} text-red-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ),
      };
    case 'cancelled':
      return {
        label: 'Pedido cancelado',
        sublabel: 'Este pedido foi cancelado.',
        color: 'text-[#6B6B6B]',
        bgColor: 'bg-[#1A1A1A]',
        borderColor: 'border-[#2A2A2A]',
        icon: (
          <svg className={`${base} text-[#6B6B6B]`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
        ),
      };
  }
}

// ─── Bloco PIX ───────────────────────────────────────────────────────────────

function PixBlock({ qrCodeText, qrCodeImageUrl }: { qrCodeText?: string; qrCodeImageUrl?: string }) {
  const [copied, setCopied] = useState(false);

  async function copyCode() {
    if (!qrCodeText) return;
    await navigator.clipboard.writeText(qrCodeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  }

  if (!qrCodeText && !qrCodeImageUrl) return null;

  return (
    <div className="p-6 bg-[#141414] border border-[#2A2A2A] space-y-6">
      <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-[#D4AF37]">
        Pague com PIX
      </h3>

      {qrCodeImageUrl && (
        <div className="flex justify-center">
          <div className="p-4 bg-white rounded-sm inline-block">
            <Image
              src={qrCodeImageUrl}
              alt="QR Code PIX"
              width={180}
              height={180}
              unoptimized // URL externa do PagBank
            />
          </div>
        </div>
      )}

      {qrCodeText && (
        <div>
          <p className="text-[#6B6B6B] text-xs mb-3">
            Ou copie o código PIX abaixo e cole no aplicativo do seu banco:
          </p>
          <div className="flex gap-2">
            <input
              readOnly
              value={qrCodeText}
              className="flex-1 bg-[#0F0F0F] border border-[#2A2A2A] text-white text-xs px-3 py-2.5 rounded-sm outline-none font-mono truncate"
            />
            <button
              onClick={copyCode}
              className={`px-4 py-2.5 text-[10px] font-black uppercase tracking-wider transition-colors whitespace-nowrap ${
                copied
                  ? 'bg-green-400/20 text-green-400 border border-green-400/30'
                  : 'bg-[#D4AF37] text-[#0F0F0F] hover:bg-[#C9A431]'
              }`}
            >
              {copied ? 'Copiado!' : 'Copiar'}
            </button>
          </div>
        </div>
      )}

      <p className="text-[#6B6B6B] text-xs">
        O PIX expira em <span className="text-white">30 minutos</span>. Após o pagamento, a confirmação é imediata.
      </p>
    </div>
  );
}

// ─── Bloco Boleto ─────────────────────────────────────────────────────────────

function BoletoBlock({ url, barcode }: { url?: string; barcode?: string }) {
  const [copied, setCopied] = useState(false);

  async function copyBarcode() {
    if (!barcode) return;
    await navigator.clipboard.writeText(barcode);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  }

  if (!url && !barcode) return null;

  return (
    <div className="p-6 bg-[#141414] border border-[#2A2A2A] space-y-4">
      <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-[#D4AF37]">
        Boleto Bancário
      </h3>

      {barcode && (
        <div>
          <p className="text-[#6B6B6B] text-xs mb-2">Linha digitável:</p>
          <div className="flex gap-2">
            <input
              readOnly
              value={barcode}
              className="flex-1 bg-[#0F0F0F] border border-[#2A2A2A] text-white text-xs px-3 py-2.5 outline-none font-mono truncate"
            />
            <button
              onClick={copyBarcode}
              className={`px-4 py-2.5 text-[10px] font-black uppercase tracking-wider transition-colors whitespace-nowrap ${
                copied
                  ? 'bg-green-400/20 text-green-400 border border-green-400/30'
                  : 'bg-[#D4AF37] text-[#0F0F0F] hover:bg-[#C9A431]'
              }`}
            >
              {copied ? 'Copiado!' : 'Copiar'}
            </button>
          </div>
        </div>
      )}

      {url && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#D4AF37] text-[#0F0F0F] text-[11px] font-black uppercase tracking-[0.25em] hover:bg-[#C9A431] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Baixar Boleto PDF
        </a>
      )}

      <p className="text-[#6B6B6B] text-xs">
        Vencimento em <span className="text-white">3 dias úteis</span>. A confirmação pode levar até 3 dias úteis após o pagamento.
      </p>
    </div>
  );
}

// ─── Página principal ────────────────────────────────────────────────────────

export default function PedidoPage() {
  const { id } = useParams<{ id: string }>();

  const [order, setOrder] = useState<StoredOrder | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);

  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchOrder = useCallback(async () => {
    if (!id) return;
    try {
      const snap = await getDoc(doc(db, 'orders', id));
      if (!snap.exists()) {
        setNotFound(true);
        return;
      }
      const data = snap.data();
      // Firestore Timestamps têm .toDate(); Date fields caem em Date diretamente.
      setOrder({
        id: snap.id,
        ...(data as Omit<StoredOrder, 'id' | 'createdAt' | 'updatedAt'>),
        createdAt: data.createdAt?.toDate?.() ?? new Date(),
        updatedAt: data.updatedAt?.toDate?.() ?? new Date(),
      });
    } catch (err) {
      console.error('[pedido] Erro ao buscar pedido:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Busca inicial
  useEffect(() => {
    void fetchOrder();
  }, [fetchOrder]);

  // Polling a cada 3 s enquanto status for "pending"
  useEffect(() => {
    if (order?.status !== 'pending') {
      if (pollingRef.current) clearInterval(pollingRef.current);
      return;
    }
    pollingRef.current = setInterval(() => void fetchOrder(), 3000);
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [order?.status, fetchOrder]);

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <svg className="w-8 h-8 text-[#D4AF37] animate-spin mx-auto" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="text-[#6B6B6B] text-sm tracking-wider">Carregando pedido…</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ── Não encontrado ─────────────────────────────────────────────────────────
  if (notFound || !order) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-6">
          <div className="text-center max-w-md">
            <p className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.4em] mb-4">
              Pedido
            </p>
            <h1 className="font-[var(--font-serif)] text-3xl font-light text-white mb-4">
              Pedido não encontrado
            </h1>
            <p className="text-[#6B6B6B] text-sm mb-8">
              O código informado não corresponde a nenhum pedido.
            </p>
            <Link
              href="/colecao"
              className="inline-block px-8 py-4 bg-[#D4AF37] text-[#0F0F0F] text-[11px] font-black uppercase tracking-[0.3em] hover:bg-[#C9A431] transition-colors"
            >
              Voltar à Loja
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const sc = getStatusConfig(order.status);
  const isPix = order.paymentMethod === 'pix';
  const isBoleto = order.paymentMethod === 'boleto';

  return (
    <div className="min-h-screen bg-[#0F0F0F]">
      <Navbar />

      {/* Hero compacto */}
      <section className="h-[22vh] flex items-end pb-8 border-b border-[#1A1A1A]">
        <div className="max-w-5xl w-full mx-auto px-6 md:px-8">
          <p className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.4em] mb-2">
            Pedido #{order.id.slice(-8).toUpperCase()}
          </p>
          <h1 className="font-[var(--font-serif)] text-3xl md:text-4xl font-light text-white">
            Acompanhamento
          </h1>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-6 md:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

          {/* ── Coluna principal (3/5) ────────────────────────────────────── */}
          <div className="lg:col-span-3 space-y-8">

            {/* Status */}
            <div className={`p-6 border ${sc.borderColor} ${sc.bgColor} flex items-start gap-4`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border ${sc.borderColor}`}>
                {sc.icon}
              </div>
              <div>
                <p className={`font-medium ${sc.color}`}>{sc.label}</p>
                <p className="text-[#6B6B6B] text-sm mt-1">{sc.sublabel}</p>
                {order.status === 'pending' && (
                  <p className="text-[10px] text-[#4A4A4A] mt-2 uppercase tracking-wider">
                    Atualizando automaticamente…
                  </p>
                )}
              </div>
            </div>

            {/* Instruções de pagamento (somente pending) */}
            {order.status === 'pending' && isPix && (
              <PixBlock
                qrCodeText={order.paymentData?.pixQrCodeText}
                qrCodeImageUrl={order.paymentData?.pixQrCode}
              />
            )}

            {order.status === 'pending' && isBoleto && (
              <BoletoBlock
                url={order.paymentData?.boletoUrl}
                barcode={order.paymentData?.boletoBarcode}
              />
            )}

            {/* Itens do pedido */}
            <div className="border border-[#2A2A2A]">
              <div className="px-6 py-4 border-b border-[#2A2A2A]">
                <h2 className="text-[10px] font-black uppercase tracking-[0.25em] text-[#A3A3A3]">
                  Itens do Pedido
                </h2>
              </div>
              <ul className="divide-y divide-[#1A1A1A]">
                {order.items.map((item, idx) => (
                  <li key={`${item.id}-${item.size ?? idx}`} className="flex items-center gap-4 px-6 py-4">
                    {item.image && (
                      <div className="w-14 h-16 bg-[#1A1A1A] flex-shrink-0 overflow-hidden relative">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{item.name}</p>
                      {item.size && (
                        <p className="text-[#6B6B6B] text-xs mt-0.5">Tam. {item.size}</p>
                      )}
                      <p className="text-[#6B6B6B] text-xs">Qtd: {item.quantity}</p>
                    </div>
                    <p className="text-[#D4AF37] text-sm font-medium whitespace-nowrap">
                      {fmt(item.price * item.quantity)}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTAs pós-pagamento */}
            {order.status === 'paid' && (
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/colecao"
                  className="px-8 py-4 bg-[#D4AF37] text-[#0F0F0F] text-[11px] font-black uppercase tracking-[0.3em] hover:bg-[#C9A431] transition-colors text-center"
                >
                  Continuar Comprando
                </Link>
              </div>
            )}

            {order.status === 'failed' && (
              <Link
                href="/checkout"
                className="inline-block px-8 py-4 border border-[#D4AF37] text-[#D4AF37] text-[11px] font-black uppercase tracking-[0.3em] hover:bg-[#D4AF37] hover:text-[#0F0F0F] transition-colors"
              >
                Tentar Novamente
              </Link>
            )}
          </div>

          {/* ── Sidebar (2/5): Resumo ─────────────────────────────────────── */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 space-y-6">

              {/* Totais */}
              <div className="p-6 bg-[#141414] border border-[#2A2A2A]">
                <h2 className="text-[10px] font-black uppercase tracking-[0.25em] text-[#A3A3A3] mb-6">
                  Resumo Financeiro
                </h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#6B6B6B]">Subtotal</span>
                    <span className="text-white">
                      {fmt(order.items.reduce((s, i) => s + i.price * i.quantity, 0))}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6B6B6B]">Frete</span>
                    <span className="text-white">{fmt(order.shipping)}</span>
                  </div>
                  <div className="flex justify-between pt-4 border-t border-[#2A2A2A]">
                    <span className="text-[#D4AF37] font-bold uppercase tracking-wider text-xs">Total</span>
                    <span className="text-[#D4AF37] font-bold">{fmt(order.total)}</span>
                  </div>
                </div>
              </div>

              {/* Dados do cliente */}
              <div className="p-6 bg-[#141414] border border-[#2A2A2A] space-y-4">
                <h2 className="text-[10px] font-black uppercase tracking-[0.25em] text-[#A3A3A3]">
                  Dados de Entrega
                </h2>
                <div className="text-sm space-y-1">
                  <p className="text-white font-medium">{order.customer.name}</p>
                  <p className="text-[#6B6B6B]">{order.customer.email}</p>
                  <p className="text-[#6B6B6B] mt-3">
                    {order.address.street}, {order.address.number}
                    {order.address.complement ? ` – ${order.address.complement}` : ''}
                  </p>
                  <p className="text-[#6B6B6B]">
                    {order.address.neighborhood} · {order.address.city}/{order.address.state}
                  </p>
                  <p className="text-[#6B6B6B]">CEP {order.address.postalCode}</p>
                </div>
              </div>

              {/* Método de pagamento */}
              <div className="p-6 bg-[#141414] border border-[#2A2A2A]">
                <h2 className="text-[10px] font-black uppercase tracking-[0.25em] text-[#A3A3A3] mb-3">
                  Forma de Pagamento
                </h2>
                <p className="text-white text-sm">
                  {order.paymentMethod === 'pix'
                    ? 'PIX'
                    : order.paymentMethod === 'boleto'
                    ? 'Boleto Bancário'
                    : 'Cartão de Crédito'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
