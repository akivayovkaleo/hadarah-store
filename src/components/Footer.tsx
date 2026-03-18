import Link from 'next/link';

const sections = [
  { title: 'Compra', links: ['Coleção', 'Lançamentos', 'Ofertas', 'Cartão Presente'] },
  { title: 'Suporte', links: ['FAQ', 'Troca e Devolução', 'Envio', 'Contato'] },
  { title: 'Sobre', links: ['História', 'Sustentabilidade', 'Prensa', 'Carreiras'] },
];

export default function Footer() {
  return (
    <footer className="bg-[#0F0F0F] text-[#E5E5E5] border-t border-[#2A2A2A]">
      <div className="mx-auto w-full max-w-7xl px-6 py-20 md:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-[0.2em] text-white uppercase">HADARAH</h2>
            <p className="mt-4 max-w-sm text-sm text-[#B8B8B8] leading-relaxed">
              Moda premium para quem busca elegância autêntica e serviço com excelência do primeiro clique à entrega.
            </p>
            <div className="mt-5 flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">
              <span>+55 (11) 99999-9999</span>
              <span className="hidden md:inline">|</span>
              <span>contato@hadarah.com</span>
            </div>
          </div>

          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-[#D4AF37]">{section.title}</h3>
              <ul className="mt-4 space-y-2 text-sm text-[#D1D1D1]">
                {section.links.map((link) => (
                  <li key={link}>
                    <Link href="#" className="hover:text-[#D4AF37] transition-colors">{link}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-xs text-[#A8A8A8] flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Hadarah Store. Todos os direitos reservados.</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <Link href="/termos" className="hover:text-[#D4AF37]">Termos</Link>
            <Link href="/privacidade" className="hover:text-[#D4AF37]">Privacidade</Link>
            <Link href="/contato" className="hover:text-[#D4AF37]">Contato</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
