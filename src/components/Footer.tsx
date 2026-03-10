import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#0F0F0F] text-[#A3A3A3] py-10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm">© {new Date().getFullYear()} Hadarah Store. Todos os direitos reservados.</p>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <Link href="/termos" className="text-xs hover:text-[#D4AF37]">
            Termos
          </Link>
          <Link href="/privacidade" className="text-xs hover:text-[#D4AF37]">
            Privacidade
          </Link>
          <Link href="/contato" className="text-xs hover:text-[#D4AF37]">
            Contato
          </Link>
        </div>
      </div>
    </footer>
  );
}
