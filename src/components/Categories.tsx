'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Dados das categorias (fácil de editar)
const categories = [
  {
    id: 1,
    name: 'JOIAS',
    description: 'Peças artesanais com detalhes em ouro',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=2070',
    href: '/colecao/joias',
  },
  {
    id: 2,
    name: 'ROUPAS',
    description: 'Cortes atemporais e tecidos premium',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=2070',
    href: '/colecao/roupas',
  },
  {
    id: 3,
    name: 'ACESSÓRIOS',
    description: 'Detalhes que completam a elegância',
    image: 'https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?auto=format&fit=crop&q=80&w=2070',
    href: '/colecao/acessorios',
  },
];

export default function Categories() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Intersection Observer para animação ao scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="colecao"
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
            COLEÇÕES
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
            Cada categoria foi cuidadosamente curada para oferecer 
            o máximo em exclusividade e sofisticação.
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
          GRID DE CATEGORIAS
          ============================================ */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          
          {categories.map((category, index) => (
            <Link
              key={category.id}
              href={category.href}
              className="group relative block aspect-[3/4] md:aspect-[4/5] overflow-hidden rounded-sm"
            >
              {/* ============================================
                  IMAGEM DE FUNDO
                  ============================================ */}
              <div className="absolute inset-0">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  loading="lazy"
                  quality={85}
                />
                
                {/* Overlay Escuro (sempre visível para legibilidade) */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/40" />
                
                {/* Overlay Adicional no Hover */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>


              {/* ============================================
                  CONTEÚDO DA CARD
                  ============================================ */}
              <div className="relative z-10 h-full flex flex-col justify-end p-6 md:p-8">
                
                {/* Borda dourada animada (aparece no hover) */}
                <div className="absolute inset-4 border border-[#D4AF37]/0 group-hover:border-[#D4AF37]/40 transition-all duration-500" />
                
                {/* Conteúdo */}
                <div className="transform transition-all duration-500 group-hover:translate-y-[-8px]">
                  
                  {/* Nome da Categoria */}
                  <h3
                    className="
                      text-2xl md:text-3xl
                      font-[var(--font-serif)]
                      font-light
                      text-white
                      mb-2
                      tracking-wide
                    "
                  >
                    {category.name}
                  </h3>
                  
                  {/* Descrição */}
                  <p
                    className="
                      text-[#A3A3A3]
                      text-xs md:text-sm
                      mb-4
                      leading-relaxed
                      opacity-90 group-hover:opacity-100
                      transition-opacity duration-300
                    "
                  >
                    {category.description}
                  </p>
                  
                  {/* Link "Ver Coleção" */}
                  <div
                    className="
                      inline-flex items-center gap-2
                      text-[#D4AF37]
                      text-[10px]
                      font-black
                      uppercase
                      tracking-[0.25em]
                      opacity-0 group-hover:opacity-100
                      transform translate-y-4 group-hover:translate-y-0
                      transition-all duration-500 ease-out
                    "
                  >
                    <span>Ver Coleção</span>
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
                  </div>
                </div>
              </div>


              {/* ============================================
                  ELEMENTOS DECORATIVOS
                  ============================================ */}
              
              {/* Canto dourado (topo direito) */}
              <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                <div className="absolute top-4 right-4 w-8 h-px bg-[#D4AF37]/60 transform rotate-45 origin-top-left" />
                <div className="absolute top-4 right-4 w-8 h-px bg-[#D4AF37]/60 transform -rotate-45 origin-top-left" />
              </div>
              
              {/* Contador de posição (decorativo) */}
              <span
                className="
                  absolute top-6 left-6
                  text-[#D4AF37]/30
                  text-4xl md:text-5xl
                  font-[var(--font-serif)]
                  font-light
                  pointer-events-none
                "
              >
                0{category.id}
              </span>
            </Link>
          ))}
        </div>
      </div>


      {/* ============================================
          ELEMENTOS DECORATIVOS DA SEÇÃO
          ============================================ */}
      
      {/* Linhas verticais laterais (desktop) */}
      <div className="absolute left-0 top-1/4 hidden xl:block">
        <div className="w-px h-64 bg-gradient-to-b from-transparent via-[#D4AF37]/20 to-transparent" />
      </div>
      
      <div className="absolute right-0 top-1/4 hidden xl:block">
        <div className="w-px h-64 bg-gradient-to-b from-transparent via-[#D4AF37]/20 to-transparent" />
      </div>
      
      {/* Texto decorativo no fundo (marca d'água) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <span
          className="
            text-[15vw]
            font-[var(--font-serif)]
            font-light
            text-white
            opacity-[0.02]
            select-none
            whitespace-nowrap
          "
        >
          HADARAH
        </span>
      </div>
    </section>
  );
}