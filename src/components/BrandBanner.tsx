'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function BrandBanner() {
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
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden flex items-center justify-center"
    >
      {/* ============================================
          BACKGROUND COM IMAGEM + OVERLAY
          ============================================ */}
      <div className="absolute inset-0">
        {/* Imagem de fundo (substitua pela sua foto premium) */}
        <Image
          src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=2070"
          alt="Hadarah Store - Elegância em cada detalhe"
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority={false}
          quality={90}
        />
        
        {/* Overlay escuro (legibilidade + profundidade) */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/80" />
        
        {/* Vinhetas laterais (efeito cinema) */}
        <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-[#0F0F0F] to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-[#0F0F0F] to-transparent pointer-events-none" />
      </div>


      {/* ============================================
          CONTEÚDO CENTRAL
          ============================================ */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        
        {/* Texto Decorativo Superior */}
        <p
          className={`
            text-[#D4AF37]
            text-[10px] md:text-[11px]
            font-black
            uppercase
            tracking-[0.4em]
            mb-6
            transition-all duration-700 ease-out
            ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
          `}
          style={{ transitionDelay: '200ms' }}
        >
          Nova Coleção 2026
        </p>
        
        {/* Título Principal */}
        <h2
          className={`
            font-[var(--font-serif)]
            text-4xl md:text-6xl lg:text-7xl
            font-light
            text-white
            mb-6
            leading-tight
            transition-all duration-700 ease-out
            ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}
          `}
          style={{ transitionDelay: '400ms' }}
        >
          Elegância em <span className="font-bold text-[#D4AF37] not-italic">cada detalhe</span>
        </h2>
        
        {/* Descrição */}
        <p
          className={`
            text-[#A3A3A3]
            text-sm md:text-base
            max-w-2xl mx-auto
            mb-10
            leading-relaxed
            transition-all duration-700 ease-out
            ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
          `}
          style={{ transitionDelay: '600ms' }}
        >
          Descubra peças que transcendem tendências. 
          Cada criação Hadarah é desenvolvida com materiais excepcionais 
          e atenção meticulosa aos detalhes.
        </p>
        
        {/* Botões de Ação */}
        <div
          className={`
            flex flex-col sm:flex-row gap-4 justify-center
            transition-all duration-700 ease-out
            ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
          `}
          style={{ transitionDelay: '800ms' }}
        >
          <Link
            href="/colecao"
            className="
              group relative
              inline-flex items-center justify-center
              px-10 py-4
              bg-[#D4AF37]
              text-[#0F0F0F]
              text-[11px] font-bold uppercase tracking-[0.3em]
              transition-all duration-500 ease-out
              hover:bg-[#D4AF37]/90
              focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 focus:ring-offset-[#0F0F0F]
            "
          >
            <span className="relative z-10">Descobrir Agora</span>
            {/* Efeito de brilho no hover */}
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
          </Link>
          
          <Link
            href="/sobre"
            className="
              group relative
              inline-flex items-center justify-center
              px-10 py-4
              border border-white/40
              text-white
              bg-white/5
              text-[11px] font-bold uppercase tracking-[0.3em]
              transition-all duration-500 ease-out
              hover:bg-white hover:text-[#0F0F0F] hover:border-white
              backdrop-blur-sm
              focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-[#0F0F0F]
            "
          >
            <span className="relative z-10">Nossa História</span>
          </Link>
        </div>
      </div>


      {/* ============================================
          ELEMENTOS DECORATIVOS
          ============================================ */}
      
      {/* Linhas horizontais decorativas */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />
      
      {/* Contador decorativo (lado esquerdo) */}
      <div className="absolute bottom-8 left-8 hidden lg:block">
        <span className="text-[#D4AF37]/40 text-[10px] font-serif italic">
          Since 2026
        </span>
      </div>
      
      {/* Setas decorativas (lado direito) */}
      <div className="absolute bottom-8 right-8 hidden lg:flex items-center gap-2">
        <div className="w-12 h-px bg-[#D4AF37]/40" />
        <svg className="w-4 h-4 text-[#D4AF37]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
      
      {/* Partículas douradas sutis (opcional) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-[#D4AF37]/30 rounded-full animate-pulse" />
        <div className="absolute top-2/3 right-1/4 w-1 h-1 bg-[#D4AF37]/30 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-[#D4AF37]/30 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
    </section>
  );
}