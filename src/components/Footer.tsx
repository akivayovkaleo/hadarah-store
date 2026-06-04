import Link from 'next/link';

const sections = [
  {
    title: 'Compra',
    links: [
      { label: 'Coleção', href: '/colecao' },
      { label: 'Lançamentos', href: '/colecao' },
      { label: 'Havaianas', href: '/colecao/havaianas' },
      { label: 'Roupas', href: '/colecao/roupas' },
    ],
  },
  {
    title: 'Suporte',
    links: [
      { label: 'FAQ', href: '/contato' },
      { label: 'Troca e Devolução', href: '/contato' },
      { label: 'Política de Frete', href: '/contato' },
      { label: 'Contato', href: '/contato' },
    ],
  },
  {
    title: 'Sobre',
    links: [
      { label: 'Nossa História', href: '/sobre' },
      { label: 'Privacidade', href: '/privacidade' },
      { label: 'Termos', href: '/termos' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#1A1A1A] text-[#E5E5E5] border-t border-[#2A2A2A]">
      <div className="mx-auto w-full max-w-7xl px-6 py-20 md:px-8">
        <div className="grid gap-10 md:grid-cols-4">

          {/* Brand column */}
          <div>
            <h2 className="text-xl font-bold tracking-[0.3em] text-white uppercase"
                style={{ fontFamily: 'var(--font-playfair)' }}>
              HADARAH<span className="text-[#C8A882]">.</span>
            </h2>
            <p className="mt-4 max-w-xs text-sm text-[#9B9B9B] leading-relaxed">
              Moda premium para quem busca elegância autêntica e serviço com excelência do primeiro clique à entrega.
            </p>
            <div className="mt-5 flex flex-wrap gap-3 text-xs font-medium text-[#C8A882]">
              <span>+55 (11) 99999-9999</span>
              <span className="hidden md:inline text-[#6B6B6B]">|</span>
              <span>contato@hadarah.com</span>
            </div>
          </div>

          {/* Link sections */}
          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C8A882] mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2.5 text-sm text-[#B0B0B0]">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="footer-link">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-white/10 pt-6 text-xs text-[#6B6B6B] flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Hadarah Store. Todos os direitos reservados.</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link href="/termos" className="footer-link">Termos</Link>
            <Link href="/privacidade" className="footer-link">Privacidade</Link>
            <Link href="/contato" className="footer-link">Contato</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
