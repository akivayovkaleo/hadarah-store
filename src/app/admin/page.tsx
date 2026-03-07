'use client';
import { useState } from 'react';
import { auth } from '@/src/services/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      if (result.user) {
        // O replace evita que o usuário volte para o login ao clicar em "voltar"
        router.replace('/admin/dashboard'); 
      }
    } catch (error) {
      alert('Acesso negado. Verifique as credenciais da Hadarah.');
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--primary-bg)] px-4">
      {/* Background Decorativo - Texto Fantasma */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
        <span className="text-[25vw] font-black opacity-[0.03] uppercase italic">Hadarah</span>
      </div>

      <div className="z-10 w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-lg p-10 rounded-sm shadow-[0_20px_50px_rgba(0,0,0,0.1)] border-l-4 border-[var(--accent-gold)]">
          
          <header className="text-center mb-10">
            <h2 className="text-xs tracking-[0.5em] font-bold text-[var(--accent-blue)] uppercase mb-2">Painel de Controle</h2>
            <h1 className="text-4xl font-light italic tracking-tighter">
              Hadarah <span className="font-black not-italic text-[var(--accent-gold)]">Admin</span>
            </h1>
          </header>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="group">
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 group-focus-within:text-[var(--accent-blue)] transition-colors">E-mail</label>
              <input 
                type="email" 
                className="mt-1 w-full bg-transparent border-b border-gray-200 py-3 outline-none focus:border-[var(--accent-blue)] transition-all text-black font-medium"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="adm@hadarah.com"
                required
              />
            </div>

            <div className="group">
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 group-focus-within:text-[var(--accent-blue)] transition-colors">Senha</label>
              <input 
                type="password" 
                className="mt-1 w-full bg-transparent border-b border-gray-200 py-3 outline-none focus:border-[var(--accent-blue)] transition-all text-black"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full mt-4 bg-black text-white py-5 text-xs font-bold uppercase tracking-[0.3em] hover:bg-[var(--accent-gold)] hover:text-black transition-all duration-500 disabled:opacity-50"
            >
              {loading ? 'Autenticando...' : 'Entrar no Sistema'}
            </button>
          </form>

          <p className="mt-8 text-center text-[10px] text-gray-400 tracking-widest uppercase">
            Exclusivo para colaboradores autorizados
          </p>
        </div>
      </div>
    </main>
  );
}