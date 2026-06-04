/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Newsletter from '@/src/components/Newsletter';
import Hero from '@/src/components/Hero';
import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import { db } from '@/src/services/firebase';
import { Product } from '@/src/types/product';

// ─── Mock products shown when Firebase has no data ───────────────────────────
const mockProducts: Product[] = [
  {
    id: '1', name: 'Camiseta Essencial', price: 189, category: 'roupas',
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80',
    sizes: { P: 5, M: 3, G: 2 }, active: true, createdAt: '',
  },
  {
    id: '2', name: 'Vestido Midi', price: 349, category: 'roupas',
    imageUrl: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&q=80',
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&q=80',
    sizes: { P: 2, M: 4, G: 1 }, active: true, createdAt: '',
  },
  {
    id: '3', name: 'Havaianas Ouro', price: 129, category: 'havaianas',
    imageUrl: 'https://images.unsplash.com/photo-1603189042850-97b5e3c76ec5?w=600&q=80',
    image: 'https://images.unsplash.com/photo-1603189042850-97b5e3c76ec5?w=600&q=80',
    sizes: { '35/36': 4, '37/38': 6, '39/40': 3 }, active: true, createdAt: '',
  },
  {
    id: '4', name: 'Blusa Linho', price: 219, category: 'roupas',
    imageUrl: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=80',
    image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=80',
    sizes: { P: 3, M: 5, G: 2 }, active: true, createdAt: '',
  },
  {
    id: '5', name: 'Havaianas Nude', price: 99, category: 'havaianas',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
    sizes: { '35/36': 5, '37/38': 4, '39/40': 3 }, active: true, createdAt: '',
  },
  {
    id: '6', name: 'Calça Alfaiataria', price: 429, category: 'roupas',
    imageUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4b7d42?w=600&q=80',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4b7d42?w=600&q=80',
    sizes: { P: 2, M: 3, G: 4 }, active: true, createdAt: '',
  },
];

const CATEGORY_CARDS = [
  { label: 'Novidades',  href: '/colecao',        src: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&q=80' },
  { label: 'Essenciais', href: '/colecao/roupas',  src: 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=800&q=80' },
  { label: 'Exclusivos', href: '/colecao',         src: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80' },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function ProductSkeleton() {
  return (
    <div>
      <div className="aspect-[3/4] rounded-sm shimmer" />
      <div className="mt-4 space-y-2">
        <div className="h-4 w-3/4 rounded shimmer" />
        <div className="h-3 w-1/2 rounded shimmer" style={{ animationDelay: '0.15s' }} />
      </div>
    </div>
  );
}

const formatBRL = (n: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n);

function LuxuryProductCard({ product }: { product: Product }) {
  const imageSrc = product.imageUrl || product.image;

  return (
    <Link href={`/produto/${product.id}`} className="group block">
      <div className="overflow-hidden rounded-sm bg-white shadow-[0_1px_6px_rgba(0,0,0,0.07)] transition-shadow duration-300 hover:shadow-[0_6px_28px_rgba(0,0,0,0.13)]">
        {/* Image — ~70% of card height */}
        <div className="relative overflow-hidden" style={{ height: '320px' }}>
          <img
            src={imageSrc}
            alt={product.name}
            style={{
              objectFit: 'cover',
              width: '100%',
              height: '100%',
              transition: 'transform 600ms ease',
            }}
            className="group-hover:scale-105"
          />
          {/* Hover overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span className="bg-white px-6 py-2.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]">
              Ver produto
            </span>
          </div>
        </div>
        {/* Info */}
        <div className="p-4 space-y-1">
          <h3 className="text-sm font-medium tracking-wide text-[#1A1A1A]">{product.name}</h3>
          <p className="text-sm font-semibold" style={{ color: '#C8A882' }}>{formatBRL(product.price)}</p>
        </div>
      </div>
    </Link>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const q = query(
          collection(db, 'products'),
          where('active', '==', true),
          orderBy('createdAt', 'desc'),
          limit(6)
        );
        const snapshot = await getDocs(q);
        const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Product[];
        setProducts(list);
      } catch {
        // Firebase not configured — mock products will display below
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedProducts();
  }, []);

  const displayProducts = products.length > 0 ? products : mockProducts;

  return (
    <main className="min-h-screen bg-[#0F0F0F]">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <Hero />

      {/* ── EXPLORE A COLEÇÃO ────────────────────────────────── */}
      <section className="bg-[#0F0F0F] py-24">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="mb-12 text-center text-3xl font-light uppercase tracking-[0.2em] text-white">
            Explore a coleção
          </h2>

          <div className="grid gap-4 md:grid-cols-3">
            {CATEGORY_CARDS.map((card) => (
              <Link
                key={card.label}
                href={card.href}
                className="group relative block overflow-hidden rounded-sm"
                style={{ height: '500px' }}
              >
                <img
                  src={card.src}
                  alt={card.label}
                  style={{
                    objectFit: 'cover',
                    width: '100%',
                    height: '100%',
                    transition: 'transform 600ms ease',
                  }}
                  className="group-hover:scale-105"
                />
                {/* gradient bottom-up */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.12) 55%, transparent 100%)',
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 p-8 text-center">
                  <h3 className="text-xl font-light uppercase tracking-[0.25em] text-white">
                    {card.label}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── PEÇAS SELECIONADAS ───────────────────────────────── */}
      <section id="colecao" className="bg-[#F5F4F2] px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 text-center">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.35em] text-[#C8A882]">
              Coleção Exclusiva
            </p>
            <h2 className="font-[var(--font-playfair)] text-3xl font-light text-[#1A1A1A] md:text-4xl">
              Peças Selecionadas
            </h2>
            <div className="mx-auto mt-5 h-px w-20 bg-[#C8A882]" />
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
                {displayProducts.map((product) => (
                  <LuxuryProductCard key={product.id} product={product} />
                ))}
              </div>
              <div className="mt-14 text-center">
                <Link
                  href="/colecao"
                  className="inline-flex items-center gap-2 border border-[#1A1A1A] px-10 py-4 text-[11px] font-bold uppercase tracking-[0.3em] text-[#1A1A1A] transition-all duration-300 hover:bg-[#1A1A1A] hover:text-white"
                >
                  Ver Coleção Completa
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ── MODA COMO EXPRESSÃO (with bg image) ──────────────── */}
      <section className="relative overflow-hidden text-center" style={{ padding: '120px 0' }}>
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1920&q=80"
            alt=""
            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
          />
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.75)' }} />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-6">
          <h2 className="mb-6 font-[var(--font-playfair)] text-5xl font-light text-white md:text-6xl">
            Moda como expressão
          </h2>
          <p className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-white/75 font-[var(--font-dm-sans)]">
            Cada peça da Hadarah nasce de um processo cuidadoso de curadoria,
            combinando elegância atemporal com materiais premium.
          </p>
          <Link
            href="/colecao"
            className="inline-block border border-white px-10 py-4 text-[11px] font-bold uppercase tracking-[0.35em] text-white transition-all duration-300 hover:bg-white hover:text-[#1A1A1A]"
          >
            Explorar coleção
          </Link>
        </div>
      </section>

      {/* ── SOBRE ────────────────────────────────────────────── */}
      <section id="sobre" className="bg-[#F5F4F2] px-6 py-20">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 lg:grid-cols-2">
          <div className="group relative aspect-[4/5] overflow-hidden rounded-sm lg:aspect-square">
            <img
              src="https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=1000&q=80"
              alt="Ateliê Hadarah"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="pointer-events-none absolute inset-0 m-4 border border-[#C8A882]/30" />
          </div>

          <div className="space-y-8">
            <div>
              <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.35em] text-[#C8A882]">
                Nossa Essência
              </p>
              <h2 className="mb-6 font-[var(--font-playfair)] text-3xl font-light text-[#1A1A1A] md:text-4xl">
                Mais que uma marca,{' '}
                <span className="font-semibold text-[#C8A882]">uma declaração</span>
              </h2>
            </div>

            <div className="max-w-xl space-y-4 text-sm leading-relaxed text-[#6B6B6B]">
              <p>
                A Hadarah nasceu do desejo de transformar o vestir em arte. Cada peça é cuidadosamente
                selecionada ou desenvolvida em parceria com artesãos que compartilham nossa visão:
                luxo não é sobre ostentação, é sobre essência.
              </p>
              <p>
                Nossas havaianas premium são feitas com materiais sustentáveis e detalhes artesanais.
                Nossas roupas seguem cortes atemporais que valorizam a silhueta sem sacrificar o conforto.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-6 border-t border-[#E8E4DF] pt-6">
              {[
                { value: '100+', label: 'Peças Exclusivas' },
                { value: '18k',  label: 'Detalhes em Ouro' },
                { value: '∞',    label: 'Elegância' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="font-[var(--font-playfair)] text-2xl text-[#1A1A1A]">{stat.value}</p>
                  <p className="text-[10px] uppercase tracking-wider text-[#6B6B6B]">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── DEPOIMENTOS ──────────────────────────────────────── */}
      <section className="bg-[#1A1A1A] py-20">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h2 className="mb-12 text-3xl font-light tracking-wide text-white md:text-4xl">
            O que dizem nossos clientes
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { quote: 'A qualidade das peças é impressionante.',  name: 'Mariana L.' },
              { quote: 'Experiência premium do começo ao fim.',    name: 'Carlos M.'  },
              { quote: 'Entrega rápida e acabamento impecável.',   name: 'Beatriz S.' },
            ].map((item, idx) => (
              <div key={idx} className="border border-white/10 p-8">
                <div className="mb-4 text-4xl leading-none text-[#C8A882]">"</div>
                <p className="mb-6 leading-relaxed text-[#A3A3A3]">{item.quote}</p>
                <div className="text-sm font-bold text-white">{item.name}</div>
                <div className="mt-1 text-[10px] uppercase tracking-wider text-[#6B6B6B]">
                  Cliente Hadarah
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ───────────────────────────────────────── */}
      <Newsletter />

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer className="border-t border-[#E8E4DF] bg-[#F5F4F2]">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8">
          <div className="grid gap-12 md:grid-cols-4">

            <div className="space-y-4 md:col-span-1">
              <div className="inline-flex items-center gap-1">
                <span className="font-[var(--font-playfair)] text-xl text-[#1A1A1A]">HADARAH</span>
                <span className="text-2xl font-black text-[#C8A882]">.</span>
                <span className="font-[var(--font-playfair)] text-xl text-[#1A1A1A]">STORE</span>
              </div>
              <p className="max-w-xs text-sm leading-relaxed text-[#6B6B6B]">
                Moda premium com curadoria atemporal para quem valoriza excelência e estilo próprio.
              </p>
              <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.15em] text-[#C8A882]">
                <span>+55 (11) 99999-9999</span>
                <span>|</span>
                <span>contato@hadarah.com</span>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C8A882]">Navegação</p>
              <ul className="space-y-2.5 text-sm">
                {[
                  { label: 'Home',    href: '/'        },
                  { label: 'Coleção', href: '/colecao' },
                  { label: 'Sobre',   href: '#sobre'   },
                  { label: 'Contato', href: '/contato' },
                ].map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-[#6B6B6B] transition-colors hover:text-[#C8A882]">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C8A882]">Atendimento</p>
              <ul className="space-y-2.5 text-sm text-[#6B6B6B]">
                <li>FAQ</li>
                <li>Trocas e devoluções</li>
                <li>Política de frete</li>
              </ul>
            </div>

            <div className="space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C8A882]">Redes</p>
              <div className="flex gap-4">
                <a href="#" className="text-[#6B6B6B] transition-colors hover:text-[#C8A882]">Instagram</a>
                <a href="#" className="text-[#6B6B6B] transition-colors hover:text-[#C8A882]">Facebook</a>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#E8E4DF] pt-6 text-sm text-[#6B6B6B] sm:flex-row">
            <span>© {new Date().getFullYear()} Hadarah Store. Todos os direitos reservados.</span>
            <div className="flex gap-4">
              <a href="#" className="hover:text-[#C8A882]">Privacidade</a>
              <a href="#" className="hover:text-[#C8A882]">Termos</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
