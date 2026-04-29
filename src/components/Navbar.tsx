'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    // Defer closing mobile menu to avoid synchronous setState in effect
    const t = setTimeout(() => setIsMobileMenuOpen(false), 0);
    return () => clearTimeout(t);
  }, [pathname]);

  const navLinks = [
    { name: 'Roupas', href: '/colecao/roupas' },
    { name: 'Havaianas', href: '/colecao/havaianas' },
    { name: 'Mercado', href: '/colecao/mercado' },
    { name: 'Sobre', href: '/sobre' },
    { name: 'Contato', href: '/contato' },
  ];

  return (
    <>
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#0F0F0F]/70 backdrop-blur-sm md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'backdrop-blur-xl bg-[#0F0F0F]/90 border-b border-[#2A2A2A] shadow-xl' : 'bg-[#0F0F0F]/90'} `}>
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 md:px-8 md:py-5">
          <div className="flex items-center gap-3">
            <Link href="/" className="inline-flex items-center gap-1 text-white no-underline">
              <span className="text-sm font-semibold tracking-[0.35em] uppercase">HADARAH</span>
              <span className="text-[#D4AF37] text-xl font-black">.</span>
            </Link>
            <span className="hidden text-xs uppercase tracking-[0.22em] text-[#D4AF37] md:inline">Premium</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-[11px] uppercase tracking-[0.22em] font-medium transition-colors ${active ? 'text-[#D4AF37]' : 'text-white/80 hover:text-[#D4AF37]'} relative`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <button aria-label="Buscar" className="hidden rounded-full border border-white/20 p-2 text-white/80 hover:border-[#D4AF37]/70 hover:text-[#D4AF37] md:inline-flex">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            </button>

            <button aria-label="Carrinho" className="relative rounded-full border border-white/20 p-2 text-white/80 hover:border-[#D4AF37]/70 hover:text-[#D4AF37] md:inline-flex">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 6h15l-1.5 9h-13z" /><circle cx="9" cy="20" r="1" /><circle cx="18" cy="20" r="1" /></svg>
              <span className="absolute -top-1 -right-1 min-w-[1.25rem] rounded-full bg-[#D4AF37] px-1.5 py-0.5 text-[10px] font-black text-black leading-none text-center">2</span>
            </button>

            <button className="inline-flex items-center justify-center rounded-md border border-white/20 p-2 text-white md:hidden" aria-label="Abrir menu" onClick={() => setIsMobileMenuOpen(true)}>
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
          </div>
        </div>

        <div className={`fixed top-0 right-0 z-50 h-full w-72 bg-[#141414] p-5 shadow-2xl transition-transform duration-300 md:hidden ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex items-center justify-between pb-4 border-b border-[#2A2A2A]">
            <span className="text-sm uppercase tracking-[0.2em] text-[#D4AF37]">Menu</span>
            <button onClick={() => setIsMobileMenuOpen(false)} aria-label="Fechar menu" className="text-white">?</button>
          </div>
          <div className="mt-5 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href} className="text-sm uppercase tracking-[0.2em] text-white hover:text-[#D4AF37]">
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </header>
      <div className="h-16 md:h-20" />
    </>
  );
}
