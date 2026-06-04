'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/src/services/firebase';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Set session cookie for 7 days (middleware checks this)
      document.cookie = `hadarah_admin_session=1; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
      router.replace('/admin/produtos');
    } catch {
      setError('Credenciais inválidas. Verifique e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#FAFAF8] px-4">
      {/* Ghost text */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none select-none">
        <span
          className="text-[22vw] font-black uppercase text-[#1A1A1A]/[0.03]"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Admin
        </span>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Card */}
        <div className="bg-white border border-[#E8E4DF] shadow-sm px-10 py-12">
          {/* Logo */}
          <div className="text-center mb-10">
            <p className="text-[10px] uppercase tracking-[0.5em] text-[#C8A882] font-bold mb-3">
              Painel de Controle
            </p>
            <h1
              className="text-4xl font-light text-[#1A1A1A] leading-none"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Hadarah<span className="font-black text-[#C8A882]">.</span>
            </h1>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 border-l-4 border-red-400 bg-red-50 px-4 py-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-7">
            <div className="group">
              <label className="block text-[10px] font-bold uppercase tracking-[0.3em] text-[#6B6B6B] mb-2">
                E-mail
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@hadarahstore.com"
                className="w-full bg-transparent border-b border-[#E8E4DF] py-3 text-[#1A1A1A] text-sm outline-none focus:border-[#C8A882] transition-colors placeholder:text-[#BDBDBD]"
              />
            </div>

            <div className="group">
              <label className="block text-[10px] font-bold uppercase tracking-[0.3em] text-[#6B6B6B] mb-2">
                Senha
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-transparent border-b border-[#E8E4DF] py-3 text-[#1A1A1A] text-sm outline-none focus:border-[#C8A882] transition-colors placeholder:text-[#BDBDBD]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1A1A1A] text-white py-4 text-[11px] font-bold uppercase tracking-[0.35em] hover:bg-[#C8A882] hover:text-[#1A1A1A] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? 'Autenticando...' : 'Acessar Painel'}
            </button>
          </form>

          <p className="mt-8 text-center text-[10px] text-[#6B6B6B] uppercase tracking-widest">
            Acesso restrito a colaboradores autorizados
          </p>
        </div>
      </div>
    </main>
  );
}
