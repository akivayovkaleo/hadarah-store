'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { db } from '@/src/services/firebase';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';

interface Banner {
  id: string;
  imageUrl: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  order: number;
  active: boolean;
}

const FALLBACK_BANNERS: Banner[] = [
  {
    id: 'f1',
    imageUrl: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1920&q=80',
    title: 'HADARAH',
    subtitle: 'Elegância além do comum. Peças exclusivas para quem entende que moda é uma forma de expressão.',
    ctaText: 'Explorar Coleção',
    ctaLink: '/colecao',
    order: 0,
    active: true,
  },
  {
    id: 'f2',
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1920&q=80',
    title: 'NOVA COLEÇÃO',
    subtitle: 'Descubra as peças que definem a temporada. Estilo urbano com sofisticação.',
    ctaText: 'Ver Novidades',
    ctaLink: '/colecao',
    order: 1,
    active: true,
  },
  {
    id: 'f3',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80',
    title: 'ESTILO PRÓPRIO',
    subtitle: 'Moda contemporânea com identidade. Para quem não segue tendências — as cria.',
    ctaText: 'Conhecer',
    ctaLink: '/colecao',
    order: 2,
    active: true,
  },
];

export default function Hero() {
  const [banners, setBanners] = useState<Banner[]>(FALLBACK_BANNERS);
  const [current, setCurrent] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const q = query(
          collection(db, 'banners'),
          where('active', '==', true),
          orderBy('order', 'asc')
        );
        const snap = await getDocs(q);
        if (!snap.empty) {
          const list = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Banner[];
          setBanners(list);
        }
      } catch {
        // Falls back to static banners
      }
    };
    fetchBanners();
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  const goTo = useCallback((index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setIsVisible(false);
    setTimeout(() => {
      setCurrent(index);
      setIsVisible(true);
      setIsTransitioning(false);
    }, 400);
  }, [isTransitioning]);

  const next = useCallback(() => {
    goTo((current + 1) % banners.length);
  }, [current, banners.length, goTo]);

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [banners.length, next]);

  const banner = banners[current];

  return (
    <section className="relative w-full h-screen min-h-[600px] overflow-hidden bg-[#1A1A1A]">

      {/* Background image */}
      {banners.map((b, i) => (
        <div
          key={b.id}
          className={`absolute inset-0 transition-opacity duration-[800ms] ${i === current ? 'opacity-100' : 'opacity-0'}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={b.imageUrl}
            alt={b.title}
            loading={i === 0 ? 'eager' : 'lazy'}
            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
          />
        </div>
      ))}

      {/* Dark overlay */}
      <div
        className="absolute inset-0 z-10"
        style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.55) 100%)' }}
      />

      {/* Side vignettes */}
      <div className="absolute inset-y-0 left-0 w-1/5 bg-gradient-to-r from-black/30 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-1/5 bg-gradient-to-l from-black/30 to-transparent z-10 pointer-events-none" />

      {/* Content */}
      <div className="relative z-20 h-full flex items-center justify-center px-6">
        <div className="text-center max-w-3xl mx-auto">

          {/* Eyebrow */}
          <p
            className="text-[#C8A882] text-[10px] font-bold uppercase tracking-[0.5em] mb-6 transition-all duration-700 ease-out"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(12px)',
              transitionDelay: '100ms',
            }}
          >
            Adornada com beleza
          </p>

          {/* Title */}
          <h1
            className="font-[var(--font-playfair)] text-5xl md:text-7xl lg:text-8xl font-black text-white leading-none tracking-tight mb-6 transition-all duration-700 ease-out"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
              transitionDelay: '250ms',
            }}
          >
            {banner.title}
          </h1>

          {/* Subtitle */}
          <p
            className="text-white/75 text-sm md:text-base font-[var(--font-dm-sans)] max-w-xl mx-auto leading-relaxed mb-10 transition-all duration-700 ease-out"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(12px)',
              transitionDelay: '400ms',
            }}
          >
            {banner.subtitle}
          </p>

          {/* CTA */}
          <div
            className="transition-all duration-700 ease-out"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(12px)',
              transitionDelay: '550ms',
            }}
          >
            <Link
              href={banner.ctaLink}
              className="inline-block px-10 py-4 border border-white text-white text-[11px] font-bold uppercase tracking-[0.35em] hover:bg-white hover:text-[#1A1A1A] transition-all duration-300"
            >
              {banner.ctaText}
            </Link>
          </div>
        </div>
      </div>

      {/* Dots */}
      {banners.length > 1 && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Banner ${i + 1}`}
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? 'w-8 h-1.5 bg-white'
                  : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      )}

      {/* Scroll indicator */}
      <div className="absolute bottom-10 right-8 z-20 hidden md:flex flex-col items-center gap-2">
        <span className="text-white/40 text-[9px] uppercase tracking-[0.3em] rotate-90 origin-center whitespace-nowrap">
          Scroll
        </span>
      </div>

      {/* Decorative line left */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 hidden lg:block z-20">
        <div className="w-px h-28 bg-gradient-to-b from-transparent via-[#C8A882]/50 to-transparent" />
      </div>

      {/* Est. label */}
      <div className="absolute bottom-10 left-8 hidden md:block z-20">
        <span className="text-white/30 text-[10px] font-[var(--font-playfair)] italic">Est. 2026</span>
      </div>
    </section>
  );
}
