'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Newsletter from '@/src/components/Newsletter';
import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import { db } from '@/src/services/firebase';
import { Product } from '@/src/types/product';

function ProductSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-80 rounded-sm bg-[#1A1A1A]" />
      <div className="mt-4 space-y-3">
        <div className="h-4 w-3/4 rounded bg-[#2A2A2A]" />
        <div className="h-3 w-1/2 rounded bg-[#2A2A2A]" />
      </div>
    </div>
  );
}

function LuxuryProductCard({ product }: { product: Product }) {
  const imageSrc =
    product.imageUrl ||
    product.image ||
    '/images/placeholder-product.jpg';

  return (
    <Link href={`/produto/${product.id}`} className="group block">
      <div className="relative overflow-hidden rounded-sm border border-[#2A2A2A] bg-[#141414] transition-all duration-300 hover:border-[#D4AF37]">
        <div className="relative aspect-[3/4] overflow-hidden">
          <Image
            src={imageSrc}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        </div>

        <div className="mt-5 space-y-1.5 p-4">
          <h3 className="font-[var(--font-serif)] text-sm font-light text-white transition-colors duration-300 group-hover:text-[var(--accent-gold)]">
            {product.name}
          </h3>
          <p className="text-xs font-medium text-[var(--text-secondary)]">
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format(product.price)}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [productError, setProductError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      setLoading(true);
      setProductError(null);

      try {
        const q = query(
          collection(db, 'products'),
          where('active', '==', true),
          orderBy('createdAt', 'desc'),
          limit(6)
        );

        const snapshot = await getDocs(q);
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Product[];

        setProducts(list);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        const message =
          error instanceof Error
            ? error.message
            : 'Erro desconhecido ao carregar produtos.';

        if (message.toLowerCase().includes('index')) {
          setProductError(
            'A consulta no Firebase requer índice composto. Por favor, crie o índice em Firestore para esta consulta.'
          );
        } else {
          setProductError(
            'Não foi possível carregar os produtos no momento. Tente novamente mais tarde.'
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <main className="min-h-screen bg-[#0F0F0F]">
      <section className="relative flex min-h-[120vh] items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=2070"
            alt="Hadarah Store - Luxo e Elegância"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <p className="mb-6 text-[10px] font-black uppercase tracking-[0.4em] text-[var(--accent-gold)]">
            Adornada com beleza
          </p>

          <h1 className="font-[var(--font-serif)] text-3xl font-light leading-tight text-white md:text-4xl">
            HADARAH
            <span className="mt-2 block text-2xl font-bold not-italic text-[var(--accent-gold)] md:text-3xl">
              Store
            </span>
          </h1>

          <p className="mx-auto mb-10 mt-8 max-w-xl text-sm text-[var(--text-secondary)] md:text-base">
            Peças exclusivas para quem entende que luxo é uma forma de expressão.
            Roupas de elite, joias artesanais e havaianas premium.
          </p>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="#colecao" className="btn-primary">
              Explorar Coleção
            </Link>
            <Link href="#sobre" className="btn-secondary">
              Nossa História
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="flex h-10 w-6 justify-center rounded-full border-2 border-[var(--accent-gold)]/60">
            <div className="mt-2 h-3 w-1 rounded-full bg-[var(--accent-gold)]" />
          </div>
        </div>
      </section>

      <section className="bg-[#141414] py-32">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="mb-16 text-center text-4xl font-light text-white">
            Explore a coleção
          </h2>

          <div className="grid gap-10 md:grid-cols-3">
            <div className="group relative overflow-hidden rounded-sm">
              <img
                src="/images/category1.jpg"
                alt="Novidades"
                className="h-64 w-full object-cover transition duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                <h3 className="text-2xl font-light text-white">Novidades</h3>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-sm">
              <img
                src="/images/category2.jpg"
                alt="Essenciais"
                className="h-64 w-full object-cover transition duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                <h3 className="text-2xl font-light text-white">Essenciais</h3>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-sm">
              <img
                src="/images/category3.jpg"
                alt="Exclusivos"
                className="h-64 w-full object-cover transition duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                <h3 className="text-2xl font-light text-white">Exclusivos</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="colecao" className="bg-[var(--primary-bg)] px-6 py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <p className="mb-4 text-[10px] font-black uppercase tracking-[0.3em] text-[var(--accent-gold)]">
              Coleção Exclusiva
            </p>
            <h2 className="font-[var(--font-serif)] text-3xl font-light text-white md:text-4xl">
              Peças Selecionadas
            </h2>
            <div className="mx-auto mt-6 h-px w-24 bg-[var(--accent-gold)]" />
          </div>

          {loading && (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          )}

          {!loading && productError && (
            <div className="rounded-sm border border-red-500/30 bg-red-500/10 p-5 text-center">
              <p className="mb-2 text-sm text-red-200">Erro ao carregar produtos</p>
              <p className="mx-auto max-w-xl text-xs text-red-100">
                {productError}
              </p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-4 inline-flex items-center gap-2 rounded-full border border-red-200/40 bg-red-500/20 px-4 py-2 text-xs font-semibold text-red-100 hover:bg-red-500/30"
              >
                Tentar novamente
              </button>
            </div>
          )}

          {!loading && !productError && products.length > 0 && (
            <>
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
                {products.map((product) => (
                  <LuxuryProductCard key={product.id} product={product} />
                ))}
              </div>

              <div className="mt-16 text-center">
                <Link href="/colecao" className="btn-secondary inline-flex items-center gap-2">
                  Ver Coleção Completa
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </Link>
              </div>
            </>
          )}

          {!loading && !productError && products.length === 0 && (
            <div className="rounded-sm border border-white/10 bg-white/5 p-8 text-center">
              <p className="text-lg font-semibold text-white">
                Coleção momentaneamente indisponível
              </p>
              <p className="mt-2 text-sm text-[#A3A3A3]">
                Estamos atualizando nossos produtos premium. Volte em breve para ver novidades exclusivas.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="bg-black py-40 text-center">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="mb-6 text-5xl font-light text-white">
            Moda como expressão
          </h2>
          <p className="text-lg leading-relaxed text-[#A3A3A3]">
            Cada peça da Hadarah nasce de um processo cuidadoso de curadoria,
            combinando elegância atemporal com materiais premium.
          </p>
        </div>
      </section>

      <section id="sobre" className="bg-[var(--secondary-bg)] px-6 py-32">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 lg:grid-cols-2">
          <div className="group relative aspect-[4/5] overflow-hidden rounded-sm lg:aspect-square">
            <Image
              src="https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&q=80&w=1974"
              alt="Ateliê Hadarah - Artesanato de Luxo"
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="pointer-events-none absolute inset-0 m-4 border-2 border-[var(--accent-gold)]/30" />
          </div>

          <div className="space-y-8">
            <div>
              <p className="mb-4 text-[10px] font-black uppercase tracking-[0.3em] text-[var(--accent-gold)]">
                Nossa Essência
              </p>
              <h2 className="mb-6 font-[var(--font-serif)] text-3xl font-light text-white md:text-4xl">
                Mais que uma marca, <br />
                <span className="font-bold not-italic text-[var(--accent-gold)]">
                  uma declaração
                </span>
              </h2>
            </div>

            <div className="max-w-xl space-y-4 text-sm leading-relaxed text-[var(--text-secondary)]">
              <p>
                A Hadarah nasceu do desejo de transformar o vestir em arte. Cada peça é cuidadosamente
                selecionada ou desenvolvida em parceria com artesãos que compartilham nossa visão:
                luxo não é sobre ostentação, é sobre essência.
              </p>
              <p>
                Nossas havaianas premium são feitas com materiais sustentáveis e detalhes em ouro 18k.
                Nossas roupas seguem cortes atemporais que valorizam a silhueta sem sacrificar o conforto.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-6 border-t border-[var(--border-color)] pt-6">
              <div>
                <p className="font-[var(--font-serif)] text-2xl text-white">100+</p>
                <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                  Peças Exclusivas
                </p>
              </div>
              <div>
                <p className="font-[var(--font-serif)] text-2xl text-white">18k</p>
                <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                  Detalhes em Ouro
                </p>
              </div>
              <div>
                <p className="font-[var(--font-serif)] text-2xl text-white">∞</p>
                <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                  Elegância
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#111111] py-32">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h2 className="mb-12 text-3xl md:text-4xl font-light text-white">
            O que dizem nossos clientes
          </h2>

          <div className="grid gap-8 md:grid-cols-3">
            {[{
              quote: 'A qualidade das peças é impressionante.',
              name: 'Mariana L.'
            }, {
              quote: 'Experiência premium do começo ao fim.',
              name: 'Carlos M.'
            }, {
              quote: 'Entrega rápida e acabamento impecável.',
              name: 'Beatriz S.'
            }].map((item, idx) => (
              <div key={idx} className="p-8 bg-[#111111] border border-[#1f1f1f] rounded-md shadow-sm">
                <div className="text-[#D4AF37] text-4xl leading-none mb-4">“</div>
                <p className="text-[#A3A3A3] mb-6">{item.quote}</p>
                <div className="text-sm font-bold text-white">{item.name}</div>
                <div className="text-[10px] text-[#6B6B6B] uppercase tracking-wider">Cliente Hadarah</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-24">
        <Newsletter />
      </div>

      <footer className="border-t border-[#2A2A2A] bg-[#0F0F0F]">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:px-8">
          <div className="grid gap-12 md:grid-cols-4">
            <div className="space-y-4 md:col-span-1">
              <div className="inline-flex items-center gap-2">
                <span className="font-[var(--font-serif)] text-2xl text-white">HADARAH</span>
                <span className="text-3xl font-black text-[#D4AF37]">.</span>
              </div>
              <p className="max-w-xs text-sm leading-relaxed text-[#CCCCCC]">
                Moda premium com curadoria atemporal e acabamentos luxuosos para quem valoriza excelência.
              </p>
              <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.2em] text-[#D4AF37]">
                <span>+55 (11) 99999-9999</span>
                <span className="hidden sm:inline">|</span>
                <span>contato@hadarah.com</span>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#D4AF37]">
                Navegação
              </p>
              <ul className="space-y-3 text-sm">
                {['Home', 'Coleção', 'Sobre', 'Contato'].map((link) => (
                  <li key={link}>
                    <a
                      href={`#${link.toLowerCase()}`}
                      className="text-[#D8D8D8] transition-colors hover:text-[#D4AF37]"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#D4AF37]">
                Atendimento
              </p>
              <ul className="space-y-3 text-sm text-[#D8D8D8]">
                <li>FAQ</li>
                <li>Trocas e devoluções</li>
                <li>Política de frete</li>
              </ul>
            </div>

            <div className="space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#D4AF37]">
                Redes
              </p>
              <div className="flex gap-3">
                <a className="text-[#D8D8D8] hover:text-[#D4AF37]">Instagram</a>
                <a className="text-[#D8D8D8] hover:text-[#D4AF37]">Facebook</a>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#2A2A2A] pt-6 text-sm text-[#A3A3A3] sm:flex-row">
            <span>© {new Date().getFullYear()} Hadarah Store. Todos os direitos reservados.</span>
            <div className="flex gap-4">
              <a className="hover:text-[#D4AF37]">Privacidade</a>
              <a className="hover:text-[#D4AF37]">Termos</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}