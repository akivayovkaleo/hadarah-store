'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/src/services/firebase';
import { Product } from '@/src/types/product';
import Navbar from '@/src/components/Navbar';
import Footer from '@/src/components/Footer';

// Componente interno: Skeleton Loading
function ProductSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[3/4] bg-[#1A1A1A] rounded-sm" />
      <div className="mt-4 space-y-2">
        <div className="h-4 bg-[#2A2A2A] rounded w-3/4" />
        <div className="h-3 bg-[#2A2A2A] rounded w-1/2" />
      </div>
    </div>
  );
}

// Componente interno: Card de Produto
function ProductCard({ product }: { product: Product }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link href={`/produto/${product.id}`}>
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative cursor-none md:cursor-none"
      >
        {/* Container da Imagem */}
        <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-[#1A1A1A]">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
            quality={85}
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
          
          {/* Badge de Categoria */}
          <div
            className={`
              absolute top-4 left-4
              bg-white/95 backdrop-blur-sm text-[#0F0F0F]
              text-[9px] font-black uppercase tracking-[0.2em]
              px-3 py-1.5
              transition-all duration-300
              ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}
            `}
          >
            {product.category === 'havaianas' ? 'Havaianas' : 'Coleção'}
          </div>

          {/* Botão "Ver Produto" */}
          <div
            className={`
              absolute bottom-0 left-0 right-0 p-4
              transition-all duration-500 ease-out
              ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}
          >
            <button className="w-full bg-white/95 backdrop-blur-sm text-[#0F0F0F] text-[10px] font-black uppercase tracking-[0.25em] py-3.5 hover:bg-[#D4AF37] transition-colors duration-300">
              Ver Produto
            </button>
          </div>
        </div>

        {/* Informações */}
        <div className="mt-5 space-y-1.5">
          <h3 className="text-sm font-[var(--font-serif)] font-light text-white group-hover:text-[#D4AF37] transition-colors duration-300">
            {product.name}
          </h3>
          <p className="text-xs text-[#A3A3A3] font-medium">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default function ColecaoPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'havaianas' | 'roupas'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc'>('newest');
  const [searchTerm, setSearchTerm] = useState('');

  // Buscar produtos do Firebase
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const q = query(
          collection(db, 'products'),
          where('active', '==', true),
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Product[];
        setProducts(list);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filtrar e ordenar produtos
  const filteredProducts = products
    .filter((product) => {
      // Filtro por categoria
      if (filter !== 'all' && product.category !== filter) return false;
      
      // Filtro por busca
      if (searchTerm && !product.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      
      return true;
    })
    .sort((a, b) => {
      // Ordenação
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return 0; // newest (já vem ordenado do Firebase)
    });

  return (
    <div className="min-h-screen bg-[#0F0F0F]">
      <Navbar />
      
      {/* ============================================
          HEADER DA PÁGINA
          ============================================ */}
      <section className="relative h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=2070"
            alt="Coleção Hadarah"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[#0F0F0F]" />
        </div>

        {/* Conteúdo */}
        <div className="relative z-10 text-center px-6">
          <p className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.4em] mb-4">
            Nossa Coleção
          </p>
          <h1 className="font-[var(--font-serif)] text-4xl md:text-6xl lg:text-7xl font-light text-white mb-6">
            COLEÇÃO <span className="font-bold text-[#D4AF37] not-italic">COMPLETA</span>
          </h1>
          <p className="text-[#A3A3A3] text-sm md:text-base max-w-xl mx-auto">
            Explore todas as peças Hadarah. Cada item foi cuidadosamente selecionado 
            para oferecer o máximo em exclusividade e sofisticação.
          </p>
        </div>
      </section>

      {/* ============================================
          FILTROS E BUSCA
          ============================================ */}
      <section className="sticky top-20 z-30 bg-[#0F0F0F]/95 backdrop-blur-md border-b border-[#2A2A2A]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            
            {/* Filtros de Categoria */}
            <div className="flex items-center gap-3">
              {[
                { id: 'all', label: 'Todos' },
                { id: 'havaianas', label: 'Havaianas' },
                { id: 'roupas', label: 'Roupas' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setFilter(item.id as typeof filter)}
                  className={`
                    px-5 py-2.5
                    text-[10px] font-black uppercase tracking-[0.2em]
                    transition-all duration-300
                    ${
                      filter === item.id
                        ? 'bg-[#D4AF37] text-[#0F0F0F]'
                        : 'bg-transparent text-[#A3A3A3] border border-[#2A2A2A] hover:border-[#D4AF37] hover:text-[#D4AF37]'
                    }
                  `}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Busca e Ordenação */}
            <div className="flex items-center gap-4">
              {/* Busca */}
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar produtos..."
                  className="
                    w-48 md:w-64
                    bg-transparent
                    border-b border-[#2A2A2A]
                    py-2 pl-0 pr-8
                    text-white text-sm
                    outline-none
                    focus:border-[#D4AF37]
                    placeholder:text-[#6B6B6B]
                    transition-colors
                  "
                />
                <svg
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6B6B]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* Ordenação */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="
                  bg-transparent
                  border border-[#2A2A2A]
                  px-4 py-2
                  text-white text-sm
                  outline-none
                  focus:border-[#D4AF37]
                  cursor-pointer
                  appearance-none
                "
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23D4AF37'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 0.5rem center',
                  backgroundSize: '1rem',
                  paddingRight: '2.5rem',
                }}
              >
                <option value="newest" className="bg-[#0F0F0F]">Mais Recentes</option>
                <option value="price-asc" className="bg-[#0F0F0F]">Menor Preço</option>
                <option value="price-desc" className="bg-[#0F0F0F]">Maior Preço</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          GRID DE PRODUTOS
          ============================================ */}
      <section className="py-16 md:py-24 px-6">
        <div className="max-w-7xl mx-auto">
          
          {/* Contador de Resultados */}
          <div className="flex justify-between items-center mb-8">
            <p className="text-[#6B6B6B] text-sm">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'produto' : 'produtos'}
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)
              : filteredProducts.length > 0
              ? filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              : null}
          </div>

          {/* Estado Vazio */}
          {!loading && filteredProducts.length === 0 && (
            <div className="text-center py-20">
              <svg
                className="w-16 h-16 mx-auto text-[#2A2A2A] mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
              <p className="text-[#A3A3A3] text-sm mb-4">
                Nenhum produto encontrado com os filtros selecionados.
              </p>
              <button
                onClick={() => {
                  setFilter('all');
                  setSearchTerm('');
                  setSortBy('newest');
                }}
                className="text-[#D4AF37] text-sm hover:underline"
              >
                Limpar filtros
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ============================================
          NEWSLETTER (opcional na página de coleção)
          ============================================ */}
      <section className="py-16 bg-[#141414]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.3em] mb-4">
            Não Encontrou o Que Procurava?
          </p>
          <h2 className="font-[var(--font-serif)] text-2xl md:text-3xl text-white mb-4">
            Seja avisado dos próximos lançamentos
          </h2>
          <Link href="/" className="text-[#D4AF37] text-sm hover:underline">
            Voltar para a Home →
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}