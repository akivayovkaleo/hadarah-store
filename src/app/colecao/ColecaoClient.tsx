'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/src/services/firebase';
import { Product } from '@/src/types/product';
import Footer from '@/src/components/Footer';
import ProductCard from '@/src/components/ProductCard';

type Category = 'all' | 'havaianas' | 'roupas' | 'mercado';
type SortKey = 'newest' | 'price-asc' | 'price-desc';

const CATEGORIES: { id: Category; label: string }[] = [
  { id: 'all', label: 'Todos' },
  { id: 'havaianas', label: 'Havaianas' },
  { id: 'roupas', label: 'Roupas' },
  { id: 'mercado', label: 'Mercado' },
];

function ProductSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[3/4] bg-[#E8E4DF] rounded-sm" />
      <div className="mt-4 space-y-2">
        <div className="h-4 bg-[#E8E4DF] rounded w-3/4" />
        <div className="h-3 bg-[#E8E4DF] rounded w-1/2" />
      </div>
    </div>
  );
}

export default function ColecaoPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Category>('all');
  const [sortBy, setSortBy] = useState<SortKey>('newest');
  const [searchTerm, setSearchTerm] = useState('');
  const [transitioning, setTransitioning] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const q = query(
          collection(db, 'products'),
          where('active', '==', true),
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        setProducts(
          snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Product[]
        );
      } catch (err) {
        console.error('Erro ao buscar produtos:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filtered + sorted list
  const filtered = products
    .filter((p) => {
      if (filter !== 'all' && p.category !== filter) return false;
      if (searchTerm && !p.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return 0;
    });

  const handleFilterChange = (newFilter: Category) => {
    if (newFilter === filter) return;
    setTransitioning(true);
    setTimeout(() => {
      setFilter(newFilter);
      setTransitioning(false);
    }, 220);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8]">

      {/* ── Hero header ── */}
      <section className="relative h-[45vh] md:h-[55vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=2070"
            alt="Coleção Hadarah"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/45" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-12 w-full">
          <p className="text-[#C8A882] text-[10px] font-bold uppercase tracking-[0.5em] mb-3">Nossa Coleção</p>
          <h1 className="text-4xl md:text-5xl font-black text-white leading-none tracking-tight"
              style={{ fontFamily: 'var(--font-playfair)' }}>
            COLEÇÃO COMPLETA
          </h1>
        </div>
      </section>

      {/* ── Filter bar ── */}
      <div className="sticky top-0 z-30 bg-[#FAFAF8]/95 backdrop-blur-md border-b border-[#E8E4DF]">
        <div className="max-w-7xl mx-auto px-6 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">

          {/* Category filters */}
          <div className="flex items-center gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleFilterChange(cat.id)}
                className={[
                  'px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-200',
                  filter === cat.id
                    ? 'bg-[#1A1A1A] text-white'
                    : 'text-[#6B6B6B] hover:bg-[#E8E4DF] hover:text-[#1A1A1A]',
                ].join(' ')}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search + Sort */}
          <div className="flex items-center gap-5">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar..."
                className="w-44 md:w-56 bg-transparent border-b border-[#E8E4DF] py-2 pr-7 pl-0 text-[#1A1A1A] text-sm outline-none focus:border-[#C8A882] placeholder:text-[#BDBDBD] transition-colors"
              />
              <svg className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-[#BDBDBD]"
                   fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortKey)}
              className="bg-transparent border border-[#E8E4DF] px-3 py-2 text-[#6B6B6B] text-xs outline-none focus:border-[#C8A882] cursor-pointer appearance-none pr-7"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B6B6B'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 0.4rem center',
                backgroundSize: '0.8rem',
              }}
            >
              <option value="newest">Mais recentes</option>
              <option value="price-asc">Menor preço</option>
              <option value="price-desc">Maior preço</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Product grid ── */}
      <section className="max-w-7xl mx-auto px-6 py-16">

        {/* Count */}
        {!loading && (
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#6B6B6B] mb-8">
            {filtered.length} {filtered.length === 1 ? 'produto' : 'produtos'}
          </p>
        )}

        {/* Grid with fade transition */}
        <div
          ref={gridRef}
          className={[
            'grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-8 transition-opacity duration-200',
            transitioning ? 'opacity-0' : 'opacity-100',
          ].join(' ')}
        >
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)
            : filtered.map((product, i) => (
                <div
                  key={product.id}
                  className="product-enter"
                  style={{ animationDelay: `${Math.min(i * 40, 300)}ms` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
        </div>

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-24">
            <svg className="w-14 h-14 mx-auto text-[#E8E4DF] mb-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-[#6B6B6B] text-sm mb-5">Nenhum produto encontrado.</p>
            <button
              onClick={() => { setFilter('all'); setSearchTerm(''); setSortBy('newest'); }}
              className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#C8A882] hover:text-[#1A1A1A] transition-colors"
            >
              Limpar filtros
            </button>
          </div>
        )}
      </section>

      {/* ── CTA footer strip ── */}
      <section className="border-t border-[#E8E4DF] bg-[#F2EDE8] py-16 text-center">
        <p className="text-[10px] uppercase tracking-[0.4em] text-[#C8A882] mb-3">Não encontrou o que procura?</p>
        <h2 className="text-2xl font-light text-[#1A1A1A] mb-6"
            style={{ fontFamily: 'var(--font-playfair)' }}>
          Entre em contato conosco
        </h2>
        <Link
          href="/contato"
          className="inline-block border border-[#1A1A1A] text-[#1A1A1A] px-8 py-3 text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-[#1A1A1A] hover:text-white transition-all duration-300"
        >
          Falar com a equipe
        </Link>
      </section>

      <Footer />
    </div>
  );
}
