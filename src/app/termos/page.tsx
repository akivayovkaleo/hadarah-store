'use client';

import Link from 'next/link';
import Navbar from '@/src/components/Navbar';
import Footer from '@/src/components/Footer';

export default function TermosPage() {
  const sections = [
    {
      title: '1. ACEITAÇÃO DOS TERMOS',
      content: `
        <p class="mb-4 text-[#A3A3A3]">
          Ao acessar e utilizar o site da <strong class="text-white">Hadarah Store</strong>, você concorda 
          em cumprir e estar vinculado a estes Termos de Uso. Se você não concordar com qualquer parte 
          destes termos, não deve utilizar nossos serviços.
        </p>
      `,
    },
    {
      title: '2. PRODUTOS E PREÇOS',
      content: `
        <ul class="list-disc list-inside space-y-2 text-[#A3A3A3]">
          <li>Todos os produtos estão sujeitos a disponibilidade de estoque</li>
          <li>Os preços podem ser alterados sem aviso prévio</li>
          <li>Nos reservamos o direito de limitar quantidades por pedido</li>
          <li>Erros de digitação ou preços incorretos serão corrigidos</li>
          <li>Imagens são ilustrativas e podem variar ligeiramente do produto real</li>
        </ul>
      `,
    },
    {
      title: '3. PEDIDOS E PAGAMENTOS',
      content: `
        <ul class="list-disc list-inside space-y-2 text-[#A3A3A3]">
          <li>A confirmação do pedido ocorre após aprovação do pagamento</li>
          <li>Reservamo-nos o direito de recusar qualquer pedido</li>
          <li>Pagamentos são processados por gateways seguros de terceiros</li>
          <li>Não armazenamos dados completos de cartão de crédito em nossos servidores</li>
        </ul>
      `,
    },
    {
      title: '4. ENTREGA',
      content: `
        <ul class="list-disc list-inside space-y-2 text-[#A3A3A3]">
          <li>Prazos de entrega são estimativas e não garantias</li>
          <li>O frete é calculado no checkout com base no CEP</li>
          <li>Entregas acima de R$ 500 têm frete grátis para todo Brasil</li>
          <li>Não nos responsabilizamos por atrasos causados pela transportadora</li>
          <li>É necessário apresentar documento de identidade no recebimento</li>
        </ul>
      `,
    },
    {
      title: '5. TROCAS E DEVOLUÇÕES',
      content: `
        <ul class="list-disc list-inside space-y-2 text-[#A3A3A3]">
          <li>Você tem até 30 dias após o recebimento para solicitar troca</li>
          <li>O produto deve estar em perfeito estado, sem uso e com etiquetas</li>
          <li>O primeiro frete de troca é por nossa conta</li>
          <li>Devoluções por arrependimento seguem o Código de Defesa do Consumidor (7 dias)</li>
          <li>Produtos em promoção ou personalizados podem ter regras específicas</li>
        </ul>
      `,
    },
    {
      title: '6. PROPRIEDADE INTELECTUAL',
      content: `
        <p class="mb-4 text-[#A3A3A3]">
          Todo o conteúdo deste site, incluindo textos, imagens, logotipos, designs e códigos, 
          é de propriedade exclusiva da Hadarah Store e está protegido por leis de direitos 
          autorais e propriedade intelectual.
        </p>
        <p class="text-[#A3A3A3]">
          É proibida a reprodução, distribuição ou uso comercial sem autorização prévia por escrito.
        </p>
      `,
    },
    {
      title: '7. LIMITAÇÃO DE RESPONSABILIDADE',
      content: `
        <p class="mb-4 text-[#A3A3A3]">
          A Hadarah Store não se responsabiliza por:
        </p>
        <ul class="list-disc list-inside space-y-2 text-[#A3A3A3]">
          <li>Danos causados por uso inadequado dos produtos</li>
          <li>Problemas técnicos temporários no site</li>
          <li>Links para sites de terceiros</li>
          <li>Força maior ou casos fortuitos</li>
        </ul>
      `,
    },
    {
      title: '8. LEGISLAÇÃO APLICÁVEL',
      content: `
        <p class="mb-4 text-[#A3A3A3]">
          Estes termos são regidos pelas leis da República Federativa do Brasil, especialmente 
          pelo Código de Defesa do Consumidor (Lei nº 8.078/1990).
        </p>
        <p class="text-[#A3A3A3]">
          Fica eleito o foro da comarca de São Paulo/SP para dirimir quaisquer dúvidas decorrentes 
          destes termos, com renúncia a qualquer outro, por mais privilegiado que seja.
        </p>
      `,
    },
    {
      title: '9. CONTATO',
      content: `
        <p class="mb-4 text-[#A3A3A3]">
          Para dúvidas sobre estes termos, entre em contato:
        </p>
        <ul class="space-y-2 text-[#A3A3A3]">
          <li>E-mail: <span class="text-[#D4AF37]">juridico@hadarahstore.com</span></li>
          <li>Telefone: <span class="text-[#D4AF37]">(11) 99999-9999</span></li>
          <li>Endereço: Av. Paulista, 1000 - São Paulo, SP</li>
        </ul>
      `,
    },
  ];

  return (
    <div className="min-h-screen bg-[#0F0F0F]">
      <Navbar />
      
      {/* ============================================
          HERO DA PÁGINA
          ============================================ */}
      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[#0F0F0F]" />
        <div className="relative z-10 text-center px-6">
          <p className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.4em] mb-4">
            Legal
          </p>
          <h1 className="font-[var(--font-serif)] text-4xl md:text-5xl font-light text-white">
            TERMOS DE <span className="font-bold text-[#D4AF37] not-italic">USO</span>
          </h1>
          <p className="text-[#A3A3A3] text-sm mt-4 max-w-xl mx-auto">
            Última atualização: <span className="text-white">{new Date().toLocaleDateString('pt-BR')}</span>
          </p>
        </div>
      </section>

      {/* ============================================
          CONTEÚDO PRINCIPAL
          ============================================ */}
      <main className="max-w-4xl mx-auto px-6 py-20">
        
        {/* Introdução */}
        <div className="mb-16">
          <p className="text-[#A3A3A3] text-sm leading-relaxed">
            Bem-vindo à <strong className="text-white">Hadarah Store</strong>. Estes Termos de Uso 
            estabelecem as regras e condições para navegação e compras em nosso site. Ao utilizar 
            nossos serviços, você aceita integralmente estes termos. Recomendamos a leitura atenta 
            antes de realizar qualquer compra.
          </p>
        </div>

        {/* Seções */}
        <div className="space-y-12">
          {sections.map((section, index) => (
            <section
              key={section.title}
              className="border-l-2 border-[#2A2A2A] pl-6 hover:border-[#D4AF37] transition-colors duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <h2 className="text-lg font-bold uppercase tracking-[0.2em] text-white mb-4">
                {section.title}
              </h2>
              <div
                className="text-[#A3A3A3] text-sm leading-relaxed prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: section.content }}
              />
            </section>
          ))}
        </div>

        {/* Aceite */}
        <div className="mt-20 pt-12 border-t border-[#2A2A2A]">
          <p className="text-[#A3A3A3] text-sm text-center">
            Ao finalizar uma compra na Hadarah Store, você declara ter lido, compreendido e aceito 
            integralmente estes Termos de Uso.
          </p>
        </div>

        {/* Navegação */}
        <div className="mt-12 flex justify-center gap-6">
          <Link href="/privacidade" className="text-[#D4AF37] text-sm hover:underline">
            Política de Privacidade →
          </Link>
          <Link href="/" className="text-[#A3A3A3] text-sm hover:text-white transition-colors">
            ← Voltar para Home
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}