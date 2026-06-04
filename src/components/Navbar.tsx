'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { name: 'Roupas', href: '/colecao/roupas' },
  { name: 'Havaianas', href: '/colecao/havaianas' },
  { name: 'Mercado', href: '/colecao/mercado' },
  { name: 'Sobre', href: '/sobre' },
  { name: 'Contato', href: '/contato' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [cartBouncing, setCartBouncing] = useState(false);
  const pathname = usePathname();
  const cartRef = useRef<HTMLButtonElement>(null);

  if (pathname?.startsWith('/admin')) return null;

  const isHome = pathname === '/';
  const isTransparent = isHome && !isScrolled;

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const triggerCartBounce = () => {
    setCartBouncing(true);
    setTimeout(() => setCartBouncing(false), 600);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#1A1A1A]/60 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <header
        className={[
          'fixed top-0 left-0 right-0 z-50 transition-all duration-400',
          isTransparent
            ? 'bg-transparent'
            : 'bg-[#FAFAF8]/95 backdrop-blur-md shadow-[0_1px_0_#E8E4DF]',
        ].join(' ')}
      >
        <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 md:px-8">

          {/* Logo */}
          <Link
            href="/"
            className={[
              'inline-flex items-center no-underline transition-colors duration-300',
              isTransparent ? 'text-white' : 'text-[#1A1A1A]',
            ].join(' ')}
          >
            <span
              className="uppercase"
              style={{ fontSize: '22px', fontWeight: 600, letterSpacing: '0.15em' }}
            >
              HADARAH
            </span>
            <span
              className={[
                'mx-1.5 font-black text-xl',
                isTransparent ? 'text-white/70' : 'text-[#C8A882]',
              ].join(' ')}
            >
              .
            </span>
            <span
              className="uppercase"
              style={{ fontSize: '22px', fontWeight: 600, letterSpacing: '0.15em' }}
            >
              STORE
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-10">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={[
                    'nav-link uppercase font-medium transition-colors duration-200',
                    active ? 'nav-link-active' : '',
                    isTransparent
                      ? active ? 'text-[#C8A882]' : 'text-white/85 hover:text-white'
                      : active ? 'text-[#C8A882]' : 'text-[#6B6B6B] hover:text-[#1A1A1A]',
                  ].join(' ')}
                  style={{ fontSize: '13px', letterSpacing: '0.12em' }}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1.5">
            {/* Search */}
            <button
              aria-label="Buscar"
              className={[
                'hidden rounded-full p-2 transition-colors md:inline-flex',
                isTransparent
                  ? 'text-white/80 hover:text-white hover:bg-white/10'
                  : 'text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-[#F2EDE8]',
              ].join(' ')}
            >
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>

            {/* Cart */}
            <button
              ref={cartRef}
              aria-label="Carrinho"
              onClick={triggerCartBounce}
              className={[
                'relative rounded-full p-2 transition-colors',
                cartBouncing ? 'cart-bounce' : '',
                isTransparent
                  ? 'text-white/80 hover:text-white hover:bg-white/10'
                  : 'text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-[#F2EDE8]',
              ].join(' ')}
            >
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 6h15l-1.5 9h-13z" />
                <circle cx="9" cy="20" r="1" />
                <circle cx="18" cy="20" r="1" />
              </svg>
              <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-5 h-5 rounded-full bg-[#C8A882] text-white leading-none"
                style={{ fontSize: '11px', fontWeight: 700 }}>
                0
              </span>
            </button>

            {/* Mobile hamburger */}
            <button
              className={[
                'inline-flex items-center justify-center rounded-md p-2 md:hidden transition-colors',
                isTransparent ? 'text-white hover:bg-white/10' : 'text-[#1A1A1A] hover:bg-[#F2EDE8]',
              ].join(' ')}
              aria-label="Abrir menu"
              onClick={() => setIsMobileOpen(true)}
            >
              <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        <div
          className={[
            'fixed top-0 right-0 z-50 h-full w-72 bg-[#FAFAF8] border-l border-[#E8E4DF] shadow-2xl flex flex-col transition-transform duration-300 md:hidden',
            isMobileOpen ? 'translate-x-0' : 'translate-x-full',
          ].join(' ')}
        >
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#E8E4DF]">
            <span className="text-sm font-bold uppercase tracking-[0.25em] text-[#1A1A1A]">Menu</span>
            <button
              onClick={() => setIsMobileOpen(false)}
              aria-label="Fechar menu"
              className="text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors p-1"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <line x1="18" y1="6" x2="6" y2="18" strokeLinecap="round" />
                <line x1="6" y1="6" x2="18" y2="18" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <nav className="flex-1 px-6 py-8 space-y-1">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={[
                    'block py-3 text-sm font-medium uppercase tracking-[0.2em] border-b border-[#E8E4DF] transition-colors',
                    active ? 'text-[#C8A882]' : 'text-[#1A1A1A] hover:text-[#C8A882]',
                  ].join(' ')}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Spacer — only when not transparent (transparent Navbar overlays the hero) */}
      {!isTransparent && <div className="h-20" />}
    </>
  );
}
