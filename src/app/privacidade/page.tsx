'use client';

import Link from 'next/link';
import Navbar from '@/src/components/Navbar';
import Footer from '@/src/components/Footer';

export default function PrivacidadePage() {
  const sections = [
    {
      title: '1. COLETA DE DADOS',
      content: `
        <p class="mb-4">A Hadarah Store coleta informações pessoais que você nos fornece diretamente, incluindo:</p>
        <ul class="list-disc list-inside space-y-2 text-[#A3A3A3]">
          <li>Nome completo, e-mail, telefone e CPF</li>
          <li>Endereço de entrega e cobrança</li>
          <li>Informações de pagamento (processadas de forma segura por nossos parceiros)</li>
          <li>Histórico de compras e preferências de produtos</li>
        </ul>
      `,
    },
    {
      title: '2. USO DAS INFORMAÇÕES',
      content: `
        <p class="mb-4">Utilizamos seus dados para:</p>
        <ul class="list-disc list-inside space-y-2 text-[#A3A3A3]">
          <li>Processar e entregar seus pedidos</li>
          <li>Comunicar atualizações sobre status de compra</li>
          <li>Enviar novidades e ofertas (com seu consentimento)</li>
          <li>Melhorar sua experiência de navegação</li>
          <li>Cumprir obrigações legais e fiscais</li>
        </ul>
      `,
    },
    {
      title: '3. COMPARTILHAMENTO DE DADOS',
      content: `
        <p class="mb-4">Seus dados podem ser compartilhados apenas com:</p>
        <ul class="list-disc list-inside space-y-2 text-[#A3A3A3]">
          <li>Gateways de pagamento (para processamento seguro)</li>
          <li>Empresas de logística (para entrega dos produtos)</li>
          <li>Autoridades governamentais (quando exigido por lei)</li>
        </ul>
        <p class="mt-4 text-[#A3A3A3]">Nunca vendemos ou alugamos seus dados pessoais para terceiros.</p>
      `,
    },
    {
      title: '4. SEGURANÇA',
      content: `
        <p class="mb-4 text-[#A3A3A3]">
          Adotamos medidas técnicas e organizacionais para proteger seus dados contra acesso não autorizado, 
          perda, alteração ou divulgação. Utilizamos criptografia SSL em todas as transações e seguimos 
          os padrões PCI DSS para processamento de pagamentos.
        </p>
      `,
    },
    {
      title: '5. SEUS DIREITOS (LGPD)',
      content: `
        <p class="mb-4 text-[#A3A3A3]">
          De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem direito a:
        </p>
        <ul class="list-disc list-inside space-y-2 text-[#A3A3A3]">
          <li>Acessar seus dados pessoais</li>
          <li>Corrigir informações incompletas ou desatualizadas</li>
          <li>Solicitar exclusão de dados (quando aplicável)</li>
          <li>Revogar consentimentos previamente dados</li>
          <li>Solicitar portabilidade dos dados</li>
        </ul>
      `,
    },
    {
      title: '6. COOKIES',
      content: `
        <p class="mb-4 text-[#A3A3A3]">
          Utilizamos cookies para melhorar sua experiência de navegação, analisar tráfego do site 
          e personalizar conteúdo. Você pode configurar seu navegador para recusar cookies, mas 
          isso pode limitar algumas funcionalidades do site.
        </p>
      `,
    },
    {
      title: '7. CONTATO',
      content: `
        <p class="mb-4 text-[#A3A3A3]">
          Para dúvidas sobre esta política ou exercício de seus direitos, entre em contato:
        </p>
        <ul class="space-y-2 text-[#A3A3A3]">
          <li>E-mail: <span class="text-[#D4AF37]">privacidade@hadarahstore.com</span></li>
          <li>Telefone: <span class="text-[#D4AF37]">(11) 99999-9999</span></li>
          <li>Horário: Segunda a Sexta, 9h às 18h</li>
        </ul>
      `,
    },
    {
      title: '8. ATUALIZAÇÕES',
      content: `
        <p class="mb-4 text-[#A3A3A3]">
          Esta política pode ser atualizada periodicamente. A versão mais recente estará sempre 
          disponível nesta página, com data de última atualização no rodapé.
        </p>
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
            POLÍTICA DE <span className="font-bold text-[#D4AF37] not-italic">PRIVACIDADE</span>
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
            A <strong className="text-white">Hadarah Store</strong> (&quot;nós&quot;, &quot;nosso&quot; ou &quot;empresa&quot;) está comprometida 
            em proteger sua privacidade. Esta Política de Privacidade descreve como coletamos, usamos, 
            armazenamos e protegemos suas informações pessoais quando você visita nosso site ou realiza 
            uma compra, em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).
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
            Ao utilizar nossos serviços, você declara que leu, compreendeu e concorda com os termos 
            desta Política de Privacidade.
          </p>
        </div>

        {/* Navegação */}
        <div className="mt-12 flex justify-center gap-6">
          <Link href="/termos" className="text-[#D4AF37] text-sm hover:underline">
            Termos de Uso →
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