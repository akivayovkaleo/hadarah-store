'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@/src/services/firebase';
import { Product } from '@/src/types/product';

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

// Componente interno: Card de Produto Premium
function ProductCard({ product, index }: { product: Product; index: number }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  return (
    <Link href={`/produto/${product.id}`}>
      <div
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setMousePos({ x: 0, y: 0 });
        }}
        className="group relative cursor-none md:cursor-none"
        style={{
          transform: `
            perspective(1000px)
            rotateY(${mousePos.x * 3}deg)
            rotateX(${-mousePos.y * 3}deg)
          `,
          transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
          transformStyle: 'preserve-3d',
        }}
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
          
          {/* Overlay Gradual */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
          
          {/* Badge de Categoria */}
          <div
            className={`
              absolute top-4 left-4
              bg-[#D4AF37] text-[#0F0F0F]
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
            <button
              className="
                w-full
                bg-white/95 backdrop-blur-sm
                text-[#0F0F0F]
                text-[10px] font-black uppercase tracking-[0.25em]
                py-3.5
                hover:bg-[#D4AF37]
                transition-colors duration-300
              "
            >
              Ver Produto
            </button>
          </div>

          {/* Brilho Dourado no Hover */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#D4AF37]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
        </div>

        {/* Informações do Produto */}
        <div className="mt-5 space-y-1.5">
          <h3
            className="
              text-sm font-[var(--font-serif)] font-light text-white
              group-hover:text-[#D4AF37]
              transition-colors duration-300
            "
          >
            {product.name}
          </h3>
          <p className="text-xs text-[#A3A3A3] font-medium">
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

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Intersection Observer para animação ao scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Buscar produtos do Firebase
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const q = query(
          collection(db, 'products'),
          where('active', '==', true),
          orderBy('createdAt', 'desc'),
          limit(8)
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

    fetchFeaturedProducts();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-32 px-6 bg-[#0F0F0F] overflow-hidden"
    >
      {/* ============================================
          HEADER DA SEÇÃO
          ============================================ */}
      <div className="max-w-7xl mx-auto mb-16 md:mb-24">
        <div className="text-center">
          {/* Linha decorativa superior */}
          <div
            className={`
              w-px h-12 bg-gradient-to-b from-transparent via-[#D4AF37] to-transparent
              mx-auto mb-6
              transition-all duration-700 ease-out
              ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}
            `}
          />

          {/* Título da Seção */}
          <h2
            className={`
              font-[var(--font-serif)]
              text-3xl md:text-4xl lg:text-5xl
              font-light
              text-white
              mb-4
              transition-all duration-700 ease-out
              ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}
            `}
            style={{ transitionDelay: '100ms' }}
          >
            PRODUTOS EM DESTAQUE
          </h2>

          {/* Subtítulo */}
          <p
            className={`
              text-[#A3A3A3]
              text-sm md:text-base
              max-w-2xl mx-auto
              transition-all duration-700 ease-out
              ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}
            `}
            style={{ transitionDelay: '200ms' }}
          >
            Peças selecionadas que definem o padrão Hadarah de excelência.
          </p>

          {/* Linha decorativa inferior */}
          <div
            className={`
              w-24 h-px bg-[#D4AF37]
              mx-auto mt-8
              transition-all duration-700 ease-out
              ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}
            `}
            style={{ transitionDelay: '300ms' }}
          />
        </div>
      </div>

      {/* ============================================
          GRID DE PRODUTOS
          ============================================ */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)
            : products.length > 0
            ? products.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))
            : null}
        </div>

        {/* Estado Vazio */}
        {!loading && products.length === 0 && (
          <div className="text-center py-16">
            <p className="text-[#6B6B6B] text-sm">
              Nossa coleção está sendo renovada. Volte em breve.
            </p>
          </div>
        )}

        {/* Botão Ver Mais */}
        {!loading && products.length > 0 && (
          <div
            className={`
              text-center mt-16
              transition-all duration-700 ease-out
              ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}
            `}
            style={{ transitionDelay: '500ms' }}
          >
            <Link
              href="/colecao"
              className="
                group relative 
                inline-flex items-center gap-3
                px-10 py-4 
                border border-[#D4AF37] 
                text-[#D4AF37] 
                bg-transparent
                text-[11px] font-bold uppercase tracking-[0.3em]
                transition-all duration-500 ease-out
                hover:bg-[#D4AF37] hover:text-[#0F0F0F]
                focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 focus:ring-offset-[#0F0F0F]
              "
            >
              <span>Ver Coleção Completa</span>
              <svg
                className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        )}
      </div>

      {/* ============================================
          ELEMENTOS DECORATIVOS
          ============================================ */}

      {/* Marca d'água de fundo */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <span className="text-[15vw] font-[var(--font-serif)] font-light text-white opacity-[0.02] select-none whitespace-nowrap">
          HADARAH
        </span>
      </div>

      {/* Linhas verticais laterais */}
      <div className="absolute left-0 top-1/3 hidden xl:block">
        <div className="w-px h-64 bg-gradient-to-b from-transparent via-[#D4AF37]/20 to-transparent" />
      </div>

      <div className="absolute right-0 top-1/3 hidden xl:block">
        <div className="w-px h-64 bg-gradient-to-b from-transparent via-[#D4AF37]/20 to-transparent" />
      </div>
    </section>
  );
}