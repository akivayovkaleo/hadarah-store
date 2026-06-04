'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/src/types/product';

export default function ProductCard({ product }: { product: Product }) {
  const [hovered, setHovered] = useState(false);

  const primarySrc = product.imageUrl || product.image || '';
  const hoverSrc = product.imageUrlHover ?? null;

  return (
    <Link href={`/produto/${product.id}`} className="group block">
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative"
      >
        {/* ── Image container ── */}
        <div className="relative aspect-[3/4] overflow-hidden bg-[#F2EDE8]">

          {/* Primary image */}
          <Image
            src={primarySrc}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
            loading="lazy"
            quality={85}
            className={[
              'object-cover transition-all duration-[400ms] ease-in-out group-hover:scale-[1.05]',
              hoverSrc && hovered ? 'opacity-0' : 'opacity-100',
            ].join(' ')}
          />

          {/* Hover / second image — crossfade */}
          {hoverSrc && (
            <Image
              src={hoverSrc}
              alt={`${product.name} — vista alternativa`}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
              loading="lazy"
              quality={85}
              className={[
                'object-cover transition-opacity duration-[400ms] ease-in-out scale-[1.05]',
                hovered ? 'opacity-100' : 'opacity-0',
              ].join(' ')}
            />
          )}

          {/* Dark overlay */}
          <div
            className={[
              'absolute inset-0 transition-colors duration-[400ms]',
              hovered ? 'bg-black/28' : 'bg-black/0',
            ].join(' ')}
          />

          {/* "Ver Produto" CTA — centralizado */}
          <div
            className={[
              'absolute inset-0 flex items-center justify-center transition-all duration-300',
              hovered ? 'opacity-100' : 'opacity-0',
            ].join(' ')}
          >
            <span className="border border-white text-white text-[11px] font-bold uppercase tracking-[0.3em] px-6 py-3">
              Ver Produto
            </span>
          </div>
        </div>

        {/* ── Product info ── */}
        <div className="mt-4 space-y-1.5">

          {/* Name with animated underline */}
          <h3 className="text-sm font-light text-[#1A1A1A] leading-tight relative inline-block"
              style={{ fontFamily: 'var(--font-playfair)' }}>
            {product.name}
            <span
              className={[
                'absolute bottom-0 left-0 h-px bg-[#1A1A1A] transition-all duration-300 ease-out',
                hovered ? 'w-full' : 'w-0',
              ].join(' ')}
            />
          </h3>

          {/* Price — accent color on hover */}
          <p
            className={[
              'text-sm font-medium transition-colors duration-300',
              hovered ? 'text-[#C8A882]' : 'text-[#6B6B6B]',
            ].join(' ')}
          >
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
