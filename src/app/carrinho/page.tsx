'use client';

import Image from 'next/image';
import Link from 'next/link';
import Footer from '@/src/components/Footer';
import { useCart } from '@/src/hooks/useCart';

const fmt = (n: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n);

export default function CartPage() {
  const { items, removeItem, updateQuantity, total } = useCart();

  const shipping = total > 0 && total <= 500 ? 29.9 : 0;
  const orderTotal = total + shipping;

  // ─── Carrinho vazio ───────────────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] flex flex-col">
        <main className="flex-1 flex items-center justify-center px-6">
          <div className="text-center max-w-md">
            {/* Sacola vazia */}
            <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-[#1A1A1A] flex items-center justify-center">
              <svg
                className="w-10 h-10 text-[#3A3A3A]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>

            <p className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.4em] mb-4">
              Carrinho
            </p>
            <h1 className="font-[var(--font-serif)] text-3xl font-light text-white mb-4">
              Sua sacola está vazia
            </h1>
            <p className="text-[#6B6B6B] text-sm leading-relaxed mb-10">
              Explore nossa coleção e encontre peças que revelam sua elegância.
            </p>

            <Link
              href="/colecao"
              className="inline-block px-10 py-4 bg-[#D4AF37] text-[#0F0F0F] text-[11px] font-black uppercase tracking-[0.3em] hover:bg-[#C9A431] transition-colors duration-300"
            >
              Explorar Coleção
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ─── Carrinho com itens ───────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0F0F0F]">
      {/* Hero */}
      <section className="h-[28vh] flex items-end pb-10 border-b border-[#1A1A1A]">
        <div className="max-w-7xl w-full mx-auto px-6 md:px-8">
          <p className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.4em] mb-3">
            Shopping
          </p>
          <h1 className="font-[var(--font-serif)] text-4xl md:text-5xl font-light text-white">
            Meu Carrinho
          </h1>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 md:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">

          {/* ── Lista de itens ─────────────────────────────────────────────── */}
          <div className="lg:col-span-2">

            {/* Cabeçalho da lista */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#1A1A1A]">
              <span className="text-[#6B6B6B] text-sm">
                {items.length} {items.length === 1 ? 'produto' : 'produtos'}
              </span>
              <Link href="/colecao" className="text-[11px] text-[#D4AF37] uppercase tracking-wider hover:underline">
                ← Continuar comprando
              </Link>
            </div>

            <ul className="space-y-px">
              {items.map((item) => {
                const itemTotal = item.price * item.quantity;
                const lowStock = item.maxStock - item.quantity <= 2 && item.maxStock > 0;

                return (
                  <li
                    key={`${item.id}-${item.size}`}
                    className="flex gap-5 sm:gap-6 py-8 border-b border-[#1A1A1A] group"
                  >
                    {/* Imagem */}
                    <Link
                      href={`/produto/${item.id}`}
                      className="flex-shrink-0 w-24 h-32 sm:w-28 sm:h-36 bg-[#1A1A1A] overflow-hidden relative block"
                    >
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        sizes="(max-width: 640px) 96px, 112px"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </Link>

                    {/* Detalhes */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      {/* Nome + Tamanho */}
                      <div>
                        <Link href={`/produto/${item.id}`}>
                          <h2 className="text-white font-[var(--font-serif)] text-base sm:text-lg leading-snug mb-1 hover:text-[#D4AF37] transition-colors line-clamp-2">
                            {item.name}
                          </h2>
                        </Link>
                        <p className="text-[#6B6B6B] text-xs uppercase tracking-wider mb-1">
                          Tamanho: <span className="text-[#A3A3A3]">{item.size}</span>
                        </p>
                        {/* Preço unitário */}
                        <p className="text-[#6B6B6B] text-xs">
                          {fmt(item.price)} / unidade
                        </p>
                        {/* Aviso de estoque baixo */}
                        {lowStock && (
                          <p className="mt-2 text-[10px] text-orange-400 uppercase tracking-wider">
                            ⚡ Últimas {item.maxStock - item.quantity + item.quantity} unidades
                          </p>
                        )}
                      </div>

                      {/* Controles + Subtotal */}
                      <div className="flex items-center justify-between mt-4 flex-wrap gap-4">
                        {/* +/- quantidade */}
                        <div className="flex items-center border border-[#2A2A2A]">
                          <button
                            onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                            aria-label="Diminuir quantidade"
                            className="w-9 h-9 flex items-center justify-center text-white text-lg hover:bg-[#1A1A1A] transition-colors"
                          >
                            −
                          </button>
                          <span className="w-10 text-center text-sm text-white select-none">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                            disabled={item.quantity >= item.maxStock}
                            aria-label="Aumentar quantidade"
                            className="w-9 h-9 flex items-center justify-center text-white text-lg hover:bg-[#1A1A1A] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            +
                          </button>
                        </div>

                        {/* Subtotal + remover */}
                        <div className="text-right">
                          <p className="text-[#D4AF37] text-base font-medium">
                            {fmt(itemTotal)}
                          </p>
                          <button
                            onClick={() => removeItem(item.id, item.size)}
                            className="mt-1 text-[10px] text-[#4A4A4A] hover:text-red-400 uppercase tracking-wider transition-colors"
                          >
                            Remover
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* ── Resumo do Pedido ───────────────────────────────────────────── */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-[#141414] border border-[#2A2A2A] p-8">
              <h2 className="font-[var(--font-serif)] text-lg font-light text-white mb-8 pb-4 border-b border-[#2A2A2A]">
                Resumo do Pedido
              </h2>

              {/* Linha de cada item */}
              <ul className="space-y-3 mb-6">
                {items.map((item) => (
                  <li
                    key={`${item.id}-${item.size}`}
                    className="flex justify-between text-sm"
                  >
                    <span className="text-[#6B6B6B] truncate pr-3 max-w-[65%]">
                      {item.name}{' '}
                      <span className="text-[#4A4A4A]">×{item.quantity}</span>
                    </span>
                    <span className="text-white whitespace-nowrap">
                      {fmt(item.price * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Subtotal + Frete */}
              <div className="space-y-3 pt-4 border-t border-[#2A2A2A] mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-[#A3A3A3]">Subtotal</span>
                  <span className="text-white">{fmt(total)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#A3A3A3]">Frete</span>
                  <span className={shipping === 0 ? 'text-green-400' : 'text-white'}>
                    {shipping === 0 ? 'Grátis' : fmt(shipping)}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-[10px] text-[#4A4A4A]">
                    Frete grátis em compras acima de R$ 500
                  </p>
                )}
              </div>

              {/* Total */}
              <div className="flex justify-between items-baseline pt-4 border-t border-[#2A2A2A] mb-8">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#A3A3A3]">
                  Total
                </span>
                <span className="font-[var(--font-serif)] text-2xl text-[#D4AF37]">
                  {fmt(orderTotal)}
                </span>
              </div>

              {/* CTA */}
              <Link
                href="/checkout"
                className="block w-full py-4 text-center bg-[#D4AF37] text-[#0F0F0F] text-[11px] font-black uppercase tracking-[0.3em] hover:bg-[#C9A431] transition-colors duration-300"
              >
                Finalizar Compra
              </Link>

              {/* Selos */}
              <div className="mt-6 space-y-2.5">
                <div className="flex items-center gap-2 text-[10px] text-[#4A4A4A]">
                  <svg className="w-3.5 h-3.5 text-[#D4AF37] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Pagamento 100% seguro e criptografado
                </div>
                <div className="flex items-center gap-2 text-[10px] text-[#4A4A4A]">
                  <svg className="w-3.5 h-3.5 text-[#D4AF37] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Troca grátis em até 30 dias
                </div>
                <div className="flex items-center gap-2 text-[10px] text-[#4A4A4A]">
                  <svg className="w-3.5 h-3.5 text-[#D4AF37] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                  Envio em até 24h úteis
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
