'use client';

import { useState, useEffect, useRef } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/src/services/firebase';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Intersection Observer para animação ao scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Validação de e-mail
  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Enviar inscrição
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação
    if (!email.trim()) {
      setStatus('error');
      setErrorMessage('Por favor, insira seu e-mail.');
      return;
    }

    if (!validateEmail(email)) {
      setStatus('error');
      setErrorMessage('Por favor, insira um e-mail válido.');
      return;
    }

    setStatus('loading');

    try {
      // Salvar no Firebase Firestore
      await addDoc(collection(db, 'newsletter'), {
        email: email.trim().toLowerCase(),
        subscribedAt: new Date().toISOString(),
        status: 'active',
      });

      setStatus('success');
      setEmail('');
      setErrorMessage('');
      
      // Resetar status após 5 segundos
      setTimeout(() => setStatus('idle'), 5000);
      
    } catch (error) {
      console.error('Erro ao inscrever:', error);
      setStatus('error');
      setErrorMessage('Ocorreu um erro. Tente novamente mais tarde.');
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-32 px-6 bg-[#0F0F0F] overflow-hidden"
    >
      {/* ============================================
          FUNDO COM PADRÃO SUTIL
          ============================================ */}
      <div className="absolute inset-0 opacity-5">
        {/* Grid pattern sutil */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, #D4AF37 1px, transparent 1px),
              linear-gradient(to bottom, #D4AF37 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* ============================================
          CONTEÚDO PRINCIPAL
          ============================================ */}
      <div className="relative z-10 max-w-3xl mx-auto text-center">
        
        {/* Ícone Decorativo (Envelope) */}
        <div
          className={`
            w-16 h-16 mx-auto mb-8
            border border-[#D4AF37]/40
            flex items-center justify-center
            transition-all duration-700 ease-out
            ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}
          `}
          style={{ transitionDelay: '100ms' }}
        >
          <svg
            className="w-6 h-6 text-[#D4AF37]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>

        {/* Título da Seção */}
        <h2
          className={`
            font-[var(--font-serif)]
            text-3xl md:text-4xl lg:text-5xl
            font-light
            text-white
            mb-4
            transition-all duration-700 ease-out
            ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}
          `}
          style={{ transitionDelay: '200ms' }}
        >
          EXCLUSIVIDADE EM <span className="font-bold text-[#D4AF37] not-italic">PRIMEIRO LUGAR</span>
        </h2>

        {/* Descrição */}
        <p
          className={`
            text-[#A3A3A3]
            text-sm md:text-base
            max-w-xl mx-auto
            mb-10
            leading-relaxed
            transition-all duration-700 ease-out
            ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
          `}
          style={{ transitionDelay: '300ms' }}
        >
          Assine nossa newsletter e receba acesso antecipado a lançamentos, 
          convites para eventos privados e conteúdos exclusivos.
        </p>

        {/* ============================================
            FORMULÁRIO DE INSCRIÇÃO
            ============================================ */}
        <form
          onSubmit={handleSubmit}
          className={`
            flex flex-col sm:flex-row gap-4 max-w-md mx-auto
            transition-all duration-700 ease-out
            ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
          `}
          style={{ transitionDelay: '400ms' }}
        >
          {/* Campo de E-mail */}
          <div className="flex-1 relative">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === 'error') setStatus('idle');
              }}
              placeholder="Seu e-mail"
              disabled={status === 'loading' || status === 'success'}
              className={`
                w-full
                bg-transparent
                border-b
                py-4 px-2
                text-white
                text-sm
                outline-none
                transition-all duration-300
                placeholder:text-[#6B6B6B]
                ${
                  status === 'error'
                    ? 'border-red-500 focus:border-red-500'
                    : status === 'success'
                    ? 'border-green-500'
                    : 'border-[#2A2A2A] focus:border-[#D4AF37]'
                }
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
              aria-label="E-mail para newsletter"
            />
            
            {/* Indicador de foco (linha animada) */}
            <div
              className={`
                absolute bottom-0 left-0 h-px bg-[#D4AF37]
                transition-all duration-300
                ${status === 'error' ? 'bg-red-500' : status === 'success' ? 'bg-green-500' : ''}
              `}
              style={{
                width: status === 'idle' ? '0%' : '100%',
              }}
            />
          </div>

          {/* Botão de Inscrição */}
          <button
            type="submit"
            disabled={status === 'loading' || status === 'success'}
            className={`
              group relative
              px-8 py-4
              bg-[#D4AF37]
              text-[#0F0F0F]
              text-[10px] font-black uppercase tracking-[0.25em]
              transition-all duration-500 ease-out
              focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 focus:ring-offset-[#0F0F0F]
              disabled:opacity-50 disabled:cursor-not-allowed
              overflow-hidden
            `}
          >
            <span className="relative z-10 flex items-center gap-2">
              {status === 'loading' ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Enviando...
                </>
              ) : status === 'success' ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Inscrito!
                </>
              ) : (
                'INSCREVER'
              )}
            </span>
            
            {/* Efeito de brilho no hover */}
            {status === 'idle' && (
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
            )}
          </button>
        </form>

        {/* ============================================
            MENSAGENS DE FEEDBACK
            ============================================ */}
        
        {/* Mensagem de Sucesso */}
        {status === 'success' && (
          <div
            className="mt-6 flex items-center justify-center gap-2 text-green-400"
            style={{
              animation: 'fadeIn 0.5s ease-out forwards',
            }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-sm">
              Bem-vindo à família Hadarah. Verifique seu e-mail para confirmar.
            </p>
          </div>
        )}

        {/* Mensagem de Erro */}
        {status === 'error' && errorMessage && (
          <div
            className="mt-6 flex items-center justify-center gap-2 text-red-400"
            style={{
              animation: 'fadeIn 0.5s ease-out forwards',
            }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm">{errorMessage}</p>
          </div>
        )}

        {/* Texto de Privacidade */}
        <p
          className={`
            mt-8 text-[10px] text-[#6B6B6B] uppercase tracking-[0.2em]
            transition-all duration-700 ease-out
            ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
          `}
          style={{ transitionDelay: '500ms' }}
        >
          Respeitamos sua privacidade. Cancelamento a qualquer momento.
        </p>
      </div>


      {/* ============================================
          ELEMENTOS DECORATIVOS
          ============================================ */}
      
      {/* Linhas laterais */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 hidden lg:block">
        <div className="w-px h-32 bg-gradient-to-b from-transparent via-[#D4AF37]/30 to-transparent" />
      </div>

      <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden lg:block">
        <div className="w-px h-32 bg-gradient-to-b from-transparent via-[#D4AF37]/30 to-transparent" />
      </div>

      {/* Círculos decorativos */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 border border-[#D4AF37]/5 rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 border border-[#D4AF37]/5 rounded-full pointer-events-none" />
    </section>
  );
}