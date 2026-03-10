'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
  const [isLoaded, setIsLoaded] = useState(false);

  // Trigger de animação após montagem
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      
      {/* ============================================
          BACKGROUND COM IMAGEM + OVERLAY
          ============================================ */}
      <div className="absolute inset-0">
        {/* Imagem de fundo (substitua pela sua foto premium) */}
        <Image
          src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=2070"
          alt="Hadarah Store - Elegância além do comum"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
          quality={90}
        />
        
        {/* Overlay escuro gradiente (profundidade + legibilidade) */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-[#0F0F0F]" />
        
        {/* Vinhetas laterais sutis (efeito cinema) */}
        <div className="absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-black/40 to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-black/40 to-transparent pointer-events-none" />
      </div>


      {/* ============================================
          CONTEÚDO CENTRAL
          ============================================ */}
      <div className="relative z-10 h-full flex items-center justify-center px-6">
        <div className="text-center max-w-4xl mx-auto">
          
          {/* Slogan Superior (Fade-in 1) */}
          <p
            className={`
              text-[#D4AF37] 
              text-[10px] md:text-[11px] 
              font-black 
              uppercase 
              tracking-[0.4em] 
              mb-6 md:mb-8
              transition-all duration-700 ease-out
              ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
            `}
            style={{ transitionDelay: '200ms' }}
          >
            Adornada com beleza
          </p>
          
          {/* Título Principal (Fade-in 2) */}
          <h1
            className={`
              font-[var(--font-serif)] 
              text-5xl md:text-7xl lg:text-8xl 
              font-light 
              text-white 
              mb-6 md:mb-8
              leading-tight
              transition-all duration-700 ease-out
              ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}
            `}
            style={{ transitionDelay: '400ms' }}
          >
            HADARAH
            <span className="block text-[#D4AF37] font-bold text-3xl md:text-5xl lg:text-6xl mt-2 not-italic">
              Store
            </span>
          </h1>
          
          {/* Descrição (Fade-in 3) */}
          <p
            className={`
              text-[#A3A3A3] 
              text-sm md:text-base 
              max-w-xl mx-auto 
              mb-10 md:mb-12
              leading-relaxed
              transition-all duration-700 ease-out
              ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
            `}
            style={{ transitionDelay: '600ms' }}
          >
            Elegância além do comum. Peças exclusivas para quem entende 
            que luxo é uma forma de expressão.
          </p>
          
          {/* Botões de Ação (Fade-in 4) */}
          <div
            className={`
              flex flex-col sm:flex-row gap-4 justify-center
              transition-all duration-700 ease-out
              ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
            `}
            style={{ transitionDelay: '800ms' }}
          >
            <Link
              href="#colecao"
              className="
                group relative 
                inline-flex items-center justify-center
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
              <span className="relative z-10">Explorar Coleção</span>
              {/* Efeito de brilho no hover */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
            </Link>
            
            <Link
              href="#sobre"
              className="
                group relative 
                inline-flex items-center justify-center
                px-10 py-4 
                border border-white/30 
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
      </div>


      {/* ============================================
          SCROLL INDICATOR (Bounce Sutil)
          ============================================ */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <a
          href="#colecao"
          className="flex flex-col items-center group"
          aria-label="Rolar para coleção"
        >
          <span className="text-[#A3A3A3] text-[9px] uppercase tracking-[0.3em] mb-3 group-hover:text-[#D4AF37] transition-colors">
            Scroll
          </span>
          <div className="w-6 h-10 border border-[#D4AF37]/60 rounded-full flex justify-center">
            <div className="w-1 h-2.5 bg-[#D4AF37] rounded-full mt-2 animate-bounce" />
          </div>
        </a>
      </div>


      {/* ============================================
          ELEMENTOS DECORATIVOS (Detalhes de Luxo)
          ============================================ */}
      
      {/* Linha vertical dourada sutil (lado esquerdo) */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 hidden lg:block">
        <div className="w-px h-32 bg-gradient-to-b from-transparent via-[#D4AF37]/40 to-transparent" />
      </div>
      
      {/* Linha vertical dourada sutil (lado direito) */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:block">
        <div className="w-px h-32 bg-gradient-to-b from-transparent via-[#D4AF37]/40 to-transparent" />
      </div>
      
      {/* Texto decorativo no canto inferior */}
      <div className="absolute bottom-8 right-8 hidden md:block">
        <span className="text-[#D4AF37]/40 text-[10px] font-serif italic">
          Est. 2026
        </span>
      </div>
    </section>
  );
}