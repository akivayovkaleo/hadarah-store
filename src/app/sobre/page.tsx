'use client';

import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/src/components/Navbar';
import Footer from '@/src/components/Footer';

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-[#0F0F0F]">
      <Navbar />
      
      {/* ============================================
          HERO DA PÁGINA
          ============================================ */}
      <section className="relative h-[50vh] md:h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=2070"
            alt="Sobre a Hadarah"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[#0F0F0F]" />
        </div>

        <div className="relative z-10 text-center px-6">
          <p className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.4em] mb-4">
            Nossa Essência
          </p>
          <h1 className="font-[var(--font-serif)] text-4xl md:text-6xl lg:text-7xl font-light text-white mb-6">
            SOBRE A <span className="font-bold text-[#D4AF37] not-italic">HADARAH</span>
          </h1>
          <p className="text-[#A3A3A3] text-sm md:text-base max-w-2xl mx-auto">
            Mais que uma marca, uma declaração de amor à elegância atemporal.
          </p>
        </div>
      </section>

      {/* ============================================
          HISTÓRIA DA MARCA
          ============================================ */}
      <section className="py-20 md:py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Imagem */}
            <div className="relative aspect-[4/5] overflow-hidden rounded-sm">
              <Image
                src="https://images.unsplash.com/photo-1550614000-4b9519e02a48?auto=format&fit=crop&q=80&w=1974"
                alt="Ateliê Hadarah"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                loading="lazy"
              />
              <div className="absolute inset-4 border border-[#D4AF37]/30 pointer-events-none" />
            </div>

            {/* Conteúdo */}
            <div className="space-y-8">
              <div>
                <p className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.3em] mb-4">
                  Desde 2026
                </p>
                <h2 className="font-[var(--font-serif)] text-3xl md:text-4xl font-light text-white mb-6">
                  Uma história de <span className="text-[#D4AF37] font-bold not-italic">excelência</span>
                </h2>
              </div>

              <div className="space-y-4 text-[#A3A3A3] text-sm leading-relaxed">
                <p>
                  A Hadarah nasceu do desejo de transformar o vestir em arte. Cada peça é cuidadosamente 
                  selecionada ou desenvolvida em parceria com artesãos que compartilham nossa visão: 
                  luxo não é sobre ostentação, é sobre essência.
                </p>
                <p>
                  Nosso nome, &quot;Hadarah&quot;, significa &quot;civilização&quot; em árabe — um tributo às culturas que 
                  através dos séculos definiram o que é verdadeiro luxo: atenção aos detalhes, qualidade 
                  excepcional e beleza que transcende tendências.
                </p>
                <p>
                  Hoje, somos referência em peças exclusivas para quem entende que cada escolha é uma 
                  forma de expressão. Nossas havaianas premium, roupas de elite e joias artesanais 
                  são desenvolvidas para quem não segue regras — as cria.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-[#2A2A2A]">
                <div>
                  <p className="text-3xl font-[var(--font-serif)] text-white">100+</p>
                  <p className="text-[10px] text-[#6B6B6B] uppercase tracking-wider mt-1">Peças Exclusivas</p>
                </div>
                <div>
                  <p className="text-3xl font-[var(--font-serif)] text-white">18k</p>
                  <p className="text-[10px] text-[#6B6B6B] uppercase tracking-wider mt-1">Detalhes em Ouro</p>
                </div>
                <div>
                  <p className="text-3xl font-[var(--font-serif)] text-white">∞</p>
                  <p className="text-[10px] text-[#6B6B6B] uppercase tracking-wider mt-1">Compromisso</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          VALORES DA MARCA
          ============================================ */}
      <section className="py-20 md:py-32 px-6 bg-[#141414]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.3em] mb-4">
              Nossos Pilares
            </p>
            <h2 className="font-[var(--font-serif)] text-3xl md:text-4xl font-light text-white">
              O QUE NOS <span className="text-[#D4AF37] font-bold not-italic">DEFINE</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'EXCLUSIVIDADE',
                description: 'Peças limitadas e numeradas. Cada item Hadarah é único como você.',
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                ),
              },
              {
                title: 'QUALIDADE',
                description: 'Materiais premium selecionados rigorosamente. Durabilidade e conforto em primeiro lugar.',
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                ),
              },
              {
                title: 'SUSTENTABILIDADE',
                description: 'Compromisso com o futuro. Materiais conscientes e produção ética.',
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
              },
            ].map((value, index) => (
              <div
                key={value.title}
                className="text-center p-8 border border-[#2A2A2A] hover:border-[#D4AF37]/50 transition-colors duration-300"
              >
                <div className="text-[#D4AF37] mb-6 flex justify-center">{value.icon}</div>
                <h3 className="text-lg font-bold uppercase tracking-[0.2em] text-white mb-4">
                  {value.title}
                </h3>
                <p className="text-[#A3A3A3] text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          CALL TO ACTION
          ============================================ */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-[var(--font-serif)] text-3xl md:text-4xl font-light text-white mb-6">
            Faça parte da nossa <span className="text-[#D4AF37] font-bold not-italic">história</span>
          </h2>
          <p className="text-[#A3A3A3] text-sm mb-10 max-w-xl mx-auto">
            Descubra peças que contam histórias. Cada item Hadarah é desenvolvido 
            para quem não segue tendências — as cria.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/colecao" className="btn-primary">
              Explorar Coleção
            </Link>
            <Link href="/contato" className="btn-secondary">
              Fale Conosco
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}