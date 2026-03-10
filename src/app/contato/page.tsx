'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/src/components/Navbar';
import Footer from '@/src/components/Footer';

export default function ContatoPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (status === 'error') setStatus('idle');
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!formData.name || !formData.email || !formData.message) {
      setStatus('error');
      setErrorMessage('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (!formData.email.includes('@')) {
      setStatus('error');
      setErrorMessage('Por favor, insira um e-mail válido.');
      return;
    }

    setStatus('loading');

    try {
      // Simulação de envio (substitua por sua integração real)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Aqui você integraria com:
      // - Firebase Firestore
      // - EmailJS
      // - Formspree
      // - Seu backend
      
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // Resetar status após 5 segundos
      setTimeout(() => setStatus('idle'), 5000);
      
    } catch (error) {
      console.error('Erro ao enviar:', error);
      setStatus('error');
      setErrorMessage('Ocorreu um erro. Tente novamente mais tarde.');
    }
  };

  // Dados de contato
  const contactInfo = {
    email: 'contato@hadarahstore.com',
    phone: '(11) 99999-9999',
    whatsapp: '(11) 99999-9999',
    address: 'Av. Paulista, 1000 - São Paulo, SP',
    hours: {
      weekday: 'Segunda a Sexta: 9h às 18h',
      weekend: 'Sábado: 9h às 13h',
    },
  };

  // FAQ Items
  const faqItems = [
    {
      question: 'Qual o prazo de entrega?',
      answer: 'O prazo varia de 3 a 7 dias úteis para todo o Brasil. Para São Paulo capital, entregamos em até 48h.',
    },
    {
      question: 'Aceitam trocas?',
      answer: 'Sim! Você tem até 30 dias após o recebimento para solicitar troca. O primeiro envio é por nossa conta.',
    },
    {
      question: 'Como cuidar das minhas peças?',
      answer: 'Cada produto vem com instruções específicas de cuidado. Em geral, recomendamos lavagem a seco para roupas e limpeza suave para joias.',
    },
    {
      question: 'Vocês fazem entregas internacionais?',
      answer: 'Ainda não. Estamos trabalhando para expandir nossas entregas para todo o mundo em breve.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0F0F0F]">
      <Navbar />
      
      {/* ============================================
          HERO DA PÁGINA
          ============================================ */}
      <section className="relative h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=2070"
            alt="Contato Hadarah"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[#0F0F0F]" />
        </div>

        <div className="relative z-10 text-center px-6">
          <p className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.4em] mb-4">
            Fale Conosco
          </p>
          <h1 className="font-[var(--font-serif)] text-4xl md:text-6xl lg:text-7xl font-light text-white mb-6">
            CONTATO
          </h1>
          <p className="text-[#A3A3A3] text-sm md:text-base max-w-xl mx-auto">
            Estamos aqui para ajudar. Entre em contato e responderemos o mais breve possível.
          </p>
        </div>
      </section>

      {/* ============================================
          CONTEÚDO PRINCIPAL
          ============================================ */}
      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* ============================================
              FORMULÁRIO DE CONTATO
              ============================================ */}
          <div>
            <h2 className="font-[var(--font-serif)] text-2xl md:text-3xl font-light text-white mb-8">
              Envie uma <span className="text-[#D4AF37] font-bold not-italic">mensagem</span>
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nome */}
              <div>
                <label htmlFor="name" className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#A3A3A3] mb-2">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="
                    w-full
                    bg-transparent
                    border-b border-[#2A2A2A]
                    py-3 px-0
                    text-white
                    outline-none
                    focus:border-[#D4AF37]
                    transition-colors
                    placeholder:text-[#6B6B6B]
                  "
                  placeholder="Seu nome"
                  required
                />
              </div>

              {/* E-mail */}
              <div>
                <label htmlFor="email" className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#A3A3A3] mb-2">
                  E-mail *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="
                    w-full
                    bg-transparent
                    border-b border-[#2A2A2A]
                    py-3 px-0
                    text-white
                    outline-none
                    focus:border-[#D4AF37]
                    transition-colors
                    placeholder:text-[#6B6B6B]
                  "
                  placeholder="seu@email.com"
                  required
                />
              </div>

              {/* Assunto */}
              <div>
                <label htmlFor="subject" className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#A3A3A3] mb-2">
                  Assunto
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="
                    w-full
                    bg-transparent
                    border-b border-[#2A2A2A]
                    py-3 px-0
                    text-white
                    outline-none
                    focus:border-[#D4AF37]
                    transition-colors
                    cursor-pointer
                    appearance-none
                  "
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23D4AF37'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0.5rem center',
                    backgroundSize: '1rem',
                    paddingRight: '2.5rem',
                  }}
                >
                  <option value="" className="bg-[#0F0F0F]">Selecione um assunto</option>
                  <option value="duvida" className="bg-[#0F0F0F]">Dúvida sobre produto</option>
                  <option value="pedido" className="bg-[#0F0F0F]">Acompanhar pedido</option>
                  <option value="troca" className="bg-[#0F0F0F]">Troca ou devolução</option>
                  <option value="parceria" className="bg-[#0F0F0F]">Parceria comercial</option>
                  <option value="outro" className="bg-[#0F0F0F]">Outro</option>
                </select>
              </div>

              {/* Mensagem */}
              <div>
                <label htmlFor="message" className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#A3A3A3] mb-2">
                  Mensagem *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="
                    w-full
                    bg-transparent
                    border-b border-[#2A2A2A]
                    py-3 px-0
                    text-white
                    outline-none
                    focus:border-[#D4AF37]
                    transition-colors
                    placeholder:text-[#6B6B6B]
                    resize-none
                  "
                  placeholder="Como podemos ajudar?"
                  required
                />
              </div>

              {/* Botão de Envio */}
              <button
                type="submit"
                disabled={status === 'loading' || status === 'success'}
                className="
                  w-full
                  py-4
                  bg-[#D4AF37]
                  text-[#0F0F0F]
                  text-[11px] font-black uppercase tracking-[0.3em]
                  hover:bg-[#D4AF37]/90
                  transition-all duration-300
                  disabled:opacity-50 disabled:cursor-not-allowed
                  focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 focus:ring-offset-[#0F0F0F]
                "
              >
                {status === 'loading' ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Enviando...
                  </span>
                ) : status === 'success' ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Mensagem Enviada!
                  </span>
                ) : (
                  'ENVIAR MENSAGEM'
                )}
              </button>

              {/* Mensagens de Feedback */}
              {status === 'success' && (
                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-sm">
                  <p className="text-green-400 text-sm flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Obrigado! Respondemos em até 24h úteis.
                  </p>
                </div>
              )}

              {status === 'error' && errorMessage && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-sm">
                  <p className="text-red-400 text-sm flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {errorMessage}
                  </p>
                </div>
              )}
            </form>
          </div>

          {/* ============================================
              INFORMAÇÕES DE CONTATO
              ============================================ */}
          <div className="space-y-12">
            
            {/* Dados de Contato */}
            <div>
              <h2 className="font-[var(--font-serif)] text-2xl md:text-3xl font-light text-white mb-8">
                Informações
              </h2>

              <div className="space-y-6">
                {/* E-mail */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 border border-[#2A2A2A] flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D4AF37] mb-1">E-mail</p>
                    <a href={`mailto:${contactInfo.email}`} className="text-white hover:text-[#D4AF37] transition-colors">
                      {contactInfo.email}
                    </a>
                  </div>
                </div>

                {/* Telefone */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 border border-[#2A2A2A] flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D4AF37] mb-1">Telefone</p>
                    <a href={`tel:${contactInfo.phone}`} className="text-white hover:text-[#D4AF37] transition-colors">
                      {contactInfo.phone}
                    </a>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 border border-[#2A2A2A] flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-[#D4AF37]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D4AF37] mb-1">WhatsApp</p>
                    <a href={`https://wa.me/55${contactInfo.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#D4AF37] transition-colors">
                      {contactInfo.whatsapp}
                    </a>
                  </div>
                </div>

                {/* Endereço */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 border border-[#2A2A2A] flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D4AF37] mb-1">Endereço</p>
                    <p className="text-white">{contactInfo.address}</p>
                  </div>
                </div>

                {/* Horário de Atendimento */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 border border-[#2A2A2A] flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D4AF37] mb-1">Horário de Atendimento</p>
                    <p className="text-white text-sm">{contactInfo.hours.weekday}</p>
                    <p className="text-white text-sm">{contactInfo.hours.weekend}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Redes Sociais */}
            <div>
              <h2 className="font-[var(--font-serif)] text-2xl md:text-3xl font-light text-white mb-6">
                Siga-nos
              </h2>
              <div className="flex gap-4">
                {[
                  { name: 'Instagram', href: 'https://instagram.com/hadarahstore' },
                  { name: 'Facebook', href: 'https://facebook.com/hadarahstore' },
                  { name: 'Pinterest', href: 'https://pinterest.com/hadarahstore' },
                ].map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      w-12 h-12
                      border border-[#2A2A2A]
                      flex items-center justify-center
                      text-[#A3A3A3]
                      transition-all duration-300
                      hover:border-[#D4AF37] hover:text-[#D4AF37] hover:scale-110
                    "
                    aria-label={social.name}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z"/>
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ============================================
            FAQ (PERGUNTAS FREQUENTES)
            ============================================ */}
        <section className="mt-20 pt-20 border-t border-[#2A2A2A]">
          <div className="text-center mb-12">
            <p className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.3em] mb-4">
              FAQ
            </p>
            <h2 className="font-[var(--font-serif)] text-2xl md:text-3xl font-light text-white">
              PERGUNTAS <span className="text-[#D4AF37] font-bold not-italic">FREQUENTES</span>
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            {faqItems.map((item, index) => (
              <div
                key={index}
                className="border border-[#2A2A2A] p-6 hover:border-[#D4AF37]/50 transition-colors duration-300"
              >
                <h3 className="text-white font-medium mb-3">{item.question}</h3>
                <p className="text-[#A3A3A3] text-sm leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}