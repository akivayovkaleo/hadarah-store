'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/src/components/Navbar';
import Footer from '@/src/components/Footer';

// Tipo do item do carrinho
interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
  category: string;
}

export default function CartPage() {
  // Estado do carrinho (em produção, use Context ou Zustand)
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Carregar carrinho (simulado - em produção viria do Firebase/Context)
  useEffect(() => {
    const loadCart = async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Dados de exemplo (remova quando integrar com Firebase/Context)
      const mockCart: CartItem[] = [
        {
          id: '1',
          name: 'Havaiana Signature Gold',
          price: 299.90,
          image: 'https://images.unsplash.com/photo-1603487742131-4160d6986ba2?auto=format&fit=crop&q=80&w=800',
          size: '39-40',
          quantity: 1,
          category: 'havaianas',
        },
        {
          id: '2',
          name: 'Vestido Longo Elegance',
          price: 899.90,
          image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800',
          size: 'M',
          quantity: 1,
          category: 'roupas',
        },
      ];
      
      setCartItems(mockCart);
      setLoading(false);
    };

    loadCart();
  }, []);

  // Atualizar quantidade
  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Remover item
  const removeItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  // Calcular subtotal
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 500 ? 0 : 29.90;
  const total = subtotal + shipping;

  // Carrinho vazio
  if (!loading && cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#0F0F0F]">
        <Navbar />
        <main className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center py-20">
            <svg
              className="w-24 h-24 mx-auto text-[#2A2A2A] mb-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <h1 className="font-[var(--font-serif)] text-3xl md:text-4xl font-light text-white mb-4">
              Seu carrinho está vazio
            </h1>
            <p className="text-[#A3A3A3] text-sm mb-8 max-w-md mx-auto">
              Parece que você ainda não adicionou nenhum produto. Explore nossa coleção e encontre peças exclusivas.
            </p>
            <Link
              href="/colecao"
              className="
                inline-block
                px-10 py-4
                bg-[#D4AF37]
                text-[#0F0F0F]
                text-[11px] font-black uppercase tracking-[0.3em]
                hover:bg-[#D4AF37]/90
                transition-all duration-300
              "
            >
              Explorar Coleção
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F]">
      <Navbar />
      
      {/* ============================================
          HERO DA PÁGINA
          ============================================ */}
      <section className="relative h-[30vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[#0F0F0F]" />
        <div className="relative z-10 text-center px-6">
          <p className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.4em] mb-4">
            Shopping
          </p>
          <h1 className="font-[var(--font-serif)] text-4xl md:text-5xl font-light text-white">
            CARRINHO
          </h1>
        </div>
      </section>

      {/* ============================================
          CONTEÚDO PRINCIPAL
          ============================================ */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        {loading ? (
          // Skeleton Loading
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
              {[1, 2].map(i => (
                <div key={i} className="flex gap-6 p-6 bg-[#141414] animate-pulse">
                  <div className="w-32 h-40 bg-[#1A1A1A] rounded-sm" />
                  <div className="flex-1 space-y-4">
                    <div className="h-6 bg-[#1A1A1A] rounded w-3/4" />
                    <div className="h-4 bg-[#1A1A1A] rounded w-1/2" />
                    <div className="h-4 bg-[#1A1A1A] rounded w-1/4" />
                  </div>
                </div>
              ))}
            </div>
            <div className="h-64 bg-[#141414] animate-pulse rounded-sm" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* ============================================
                LISTA DE PRODUTOS
                ============================================ */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex justify-between items-center mb-8">
                <p className="text-[#A3A3A3] text-sm">
                  {cartItems.length} {cartItems.length === 1 ? 'produto' : 'produtos'}
                </p>
                <Link
                  href="/colecao"
                  className="text-[#D4AF37] text-sm hover:underline"
                >
                  Continuar comprando →
                </Link>
              </div>

              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-6 p-6 bg-[#141414] border border-[#2A2A2A] hover:border-[#D4AF37]/30 transition-colors"
                >
                  {/* Imagem */}
                  <div className="w-32 h-40 flex-shrink-0 overflow-hidden rounded-sm bg-[#1A1A1A]">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={128}
                      height={160}
                      className="object-cover w-full h-full"
                    />
                  </div>

                  {/* Informações */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-[#D4AF37] text-[9px] font-black uppercase tracking-[0.2em] mb-2">
                        {item.category === 'havaianas' ? 'Havaianas' : 'Roupas'}
                      </p>
                      <h3 className="text-white font-[var(--font-serif)] text-lg mb-2">
                        {item.name}
                      </h3>
                      <p className="text-[#6B6B6B] text-xs">
                        Tamanho: <span className="text-white">{item.size}</span>
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      {/* Quantidade */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 border border-[#2A2A2A] flex items-center justify-center text-white hover:border-[#D4AF37] transition-colors"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-white">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 border border-[#2A2A2A] flex items-center justify-center text-white hover:border-[#D4AF37] transition-colors"
                        >
                          +
                        </button>
                      </div>

                      {/* Preço e Remover */}
                      <div className="text-right">
                        <p className="text-[#D4AF37] text-lg font-medium mb-2">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          }).format(item.price * item.quantity)}
                        </p>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-[10px] text-[#6B6B6B] hover:text-red-400 uppercase tracking-wider transition-colors"
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ============================================
                RESUMO DO PEDIDO
                ============================================ */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 p-8 bg-[#141414] border border-[#2A2A2A] rounded-sm">
                <h2 className="font-[var(--font-serif)] text-xl font-light text-white mb-6">
                  Resumo do Pedido
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#A3A3A3]">Subtotal</span>
                    <span className="text-white">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#A3A3A3]">Frete</span>
                    <span className={shipping === 0 ? 'text-green-400' : 'text-white'}>
                      {shipping === 0 ? 'Grátis' : new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(shipping)}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-[10px] text-[#6B6B6B]">
                      Frete grátis acima de R$ 500
                    </p>
                  )}
                </div>

                <div className="pt-6 border-t border-[#2A2A2A] mb-6">
                  <div className="flex justify-between">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#A3A3A3]">
                      Total
                    </span>
                    <span className="text-xl font-[var(--font-serif)] text-[#D4AF37]">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(total)}
                    </span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="
                    w-full
                    py-4
                    bg-[#D4AF37]
                    text-[#0F0F0F]
                    text-[11px] font-black uppercase tracking-[0.3em]
                    hover:bg-[#D4AF37]/90
                    transition-all duration-300
                    block text-center
                  "
                >
                  Finalizar Compra
                </Link>

                {/* Selos de Segurança */}
                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-2 text-[10px] text-[#6B6B6B]">
                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>Compra 100% segura</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-[#6B6B6B]">
                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>30 dias para troca</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}