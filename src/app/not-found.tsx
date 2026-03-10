'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function NotFound() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center px-6">
      <div className="text-center max-w-2xl mx-auto">
        
        {/* Número 404 Gigante */}
        <div
          className={`
            text-[150px] md:text-[250px]
            font-[var(--font-serif)]
            font-light
            text-[#1A1A1A]
            leading-none
            mb-8
            transition-all duration-1000
            ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
          `}
        >
          404
        </div>

        {/* Linha Dourada */}
        <div
          className={`
            w-24 h-px bg-[#D4AF37]
            mx-auto mb-8
            transition-all duration-1000 delay-300
            ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}
          `}
        />

        {/* Título */}
        <h1
          className={`
            font-[var(--font-serif)]
            text-3xl md:text-4xl
            font-light
            text-white
            mb-4
            transition-all duration-1000 delay-500
            ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
          `}
        >
          Página não <span className="font-bold text-[#D4AF37] not-italic">encontrada</span>
        </h1>

        {/* Descrição */}
        <p
          className={`
            text-[#A3A3A3]
            text-sm md:text-base
            mb-12
            max-w-md mx-auto
            transition-all duration-1000 delay-700
            ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
          `}
        >
          A página que você procura não existe ou foi movida. 
          Que tal explorar nossa coleção?
        </p>

        {/* Botões de Ação */}
        <div
          className={`
            flex flex-col sm:flex-row gap-4 justify-center
            transition-all duration-1000 delay-900
            ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
          `}
        >
          <Link
            href="/"
            className="
              px-10 py-4
              bg-[#D4AF37]
              text-[#0F0F0F]
              text-[11px] font-black uppercase tracking-[0.3em]
              hover:bg-[#D4AF37]/90
              transition-all duration-300
            "
          >
            Voltar para Home
          </Link>
          <Link
            href="/colecao"
            className="
              px-10 py-4
              border border-[#D4AF37]
              text-[#D4AF37]
              text-[11px] font-black uppercase tracking-[0.3em]
              hover:bg-[#D4AF37] hover:text-[#0F0F0F]
              transition-all duration-300
            "
          >
            Explorar Coleção
          </Link>
        </div>

        {/* Elemento Decorativo */}
        <div className="mt-20">
          <p className="text-[10px] text-[#2A2A2A] uppercase tracking-[0.3em]">
            Hadarah Store © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
}