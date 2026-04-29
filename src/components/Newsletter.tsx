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
        'use client';

        import { useState } from 'react';
        import { collection, addDoc } from 'firebase/firestore';
        import { db } from '@/src/services/firebase';

        export default function Newsletter() {
          const [email, setEmail] = useState('');
          const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
          const [errorMessage, setErrorMessage] = useState('');

          const validateEmail = (value: string) => {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(value);
          };

          const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            if (!email.trim()) {
              setStatus('error');
              setErrorMessage('Por favor, insira seu e-mail.');
              return;
            }
            if (!validateEmail(email)) {
              setStatus('error');
              setErrorMessage('E-mail inválido.');
              return;
            }

            setStatus('loading');
            try {
              await addDoc(collection(db, 'newsletter'), {
                email: email.trim().toLowerCase(),
                subscribedAt: new Date().toISOString(),
              });
              setStatus('success');
              setEmail('');
              setErrorMessage('');
              setTimeout(() => setStatus('idle'), 4000);
            } catch (err) {
              console.error(err);
              setStatus('error');
              setErrorMessage('Erro ao enviar. Tente novamente.');
            }
          };

          return (
            <section className="py-24 px-6 bg-[#0F0F0F]">
              <div className="max-w-xl mx-auto text-center">
                <p className="text-[#D4AF37] text-[12px] uppercase tracking-[0.3em] mb-3">Receba em primeira mão</p>
                <h3 className="text-3xl font-light text-white">Seja o primeiro a saber</h3>
                <p className="text-sm text-[#A3A3A3] mt-3">Assine nossa newsletter e receba novidades, lançamentos e convites exclusivos.</p>

                <form onSubmit={handleSubmit} className="mt-6 flex gap-0">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); if (status === 'error') setStatus('idle'); }}
                    placeholder="Seu e-mail"
                    className="flex-1 bg-transparent border border-[#2A2A2A] px-4 py-3 text-sm text-white placeholder-[#6B6B6B] focus:outline-none focus:border-[#D4AF37]"
                    aria-label="Seu e-mail"
                  />
                  <button
                    type="submit"
                    disabled={status === 'loading' || status === 'success'}
                    className="bg-transparent border border-[#D4AF37] text-[#D4AF37] px-8 py-3 text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#D4AF37] hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === 'loading' ? 'Enviando...' : 'Inscrever'}
                  </button>
                </form>

                {status === 'error' && errorMessage && (
                  <p className="text-sm text-red-400 mt-3">{errorMessage}</p>
                )}
                {status === 'success' && (
                  <p className="text-sm text-green-400 mt-3">Inscrição realizada. Obrigado!</p>
                )}

                <p className="text-xs text-[#6B6B6B] mt-4">Respeitamos sua privacidade. Cancelamento a qualquer momento.</p>
              </div>
            </section>
          );
        }