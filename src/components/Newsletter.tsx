'use client';

import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/src/services/firebase';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

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
    <section className="bg-[#F5F4F2] px-6" style={{ padding: '60px 24px' }}>
      <div className="max-w-xl mx-auto text-center">
        <p className="text-[#C8A882] text-[11px] uppercase tracking-[0.35em] mb-3">
          Receba em primeira mão
        </p>
        <h3 className="font-[var(--font-playfair)] text-3xl font-light text-[#1A1A1A]">
          Seja o primeiro a saber
        </h3>
        <p className="text-sm text-[#6B6B6B] mt-3 leading-relaxed">
          Assine nossa newsletter e receba novidades, lançamentos e convites exclusivos.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 flex">
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status === 'error') setStatus('idle');
            }}
            placeholder="Seu e-mail"
            className="flex-1 bg-transparent border border-[#E8E4DF] px-4 py-3 text-sm text-[#1A1A1A] placeholder-[#A3A3A3] focus:outline-none focus:border-[#C8A882] transition-colors"
            aria-label="Seu e-mail"
          />
          <button
            type="submit"
            disabled={status === 'loading' || status === 'success'}
            className="border border-[#C8A882] bg-[#C8A882] text-[#1A1A1A] px-8 py-3 text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#b89468] hover:border-[#b89468] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'loading' ? 'Enviando...' : 'Inscrever'}
          </button>
        </form>

        {status === 'error' && errorMessage && (
          <p className="text-sm text-red-500 mt-3">{errorMessage}</p>
        )}
        {status === 'success' && (
          <p className="text-sm text-green-600 mt-3">Inscrição realizada. Obrigado!</p>
        )}

        <p className="text-xs text-[#A3A3A3] mt-4">
          Respeitamos sua privacidade. Cancelamento a qualquer momento.
        </p>
      </div>
    </section>
  );
}
