'use client';

import { useState, useEffect } from 'react';
import { db, storage, auth } from '@/src/services/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { signOut } from 'firebase/auth';
import { useAuth } from '@/src/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  // Estados do Formulário
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<'havaianas' | 'roupas'>('havaianas');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [sizes, setSizes] = useState<{ [key: string]: number }>({});
  
  // Estados de UI
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Proteção de rota
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/admin');
    }
  }, [authLoading, user, router]);

  // Limpar mensagem após 3 segundos
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const availableSizes = category === 'havaianas' 
    ? ['33-34', '35-36', '37-38', '39-40', '41-42', '43-44'] 
    : ['P', 'M', 'G', 'GG', 'XG'];

  const handleSizeChange = (size: string, qty: number) => {
    setSizes(prev => ({ ...prev, [size]: qty }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/admin');
    } catch (error) {
      console.error('Erro ao sair:', error);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) {
      setMessage({ type: 'error', text: 'Selecione uma imagem do produto.' });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      // 1. Upload da Foto no Storage
      const fileRef = ref(storage, `products/${Date.now()}_${image.name}`);
      await uploadBytes(fileRef, image);
      const imageUrl = await getDownloadURL(fileRef);

      // 2. Salvar dados no Firestore
      await addDoc(collection(db, 'products'), {
        name,
        price: Number(price),
        category,
        imageUrl,
        sizes,
        active: true,
        createdAt: new Date().toISOString(),
        createdBy: user?.uid
      });

      setMessage({ type: 'success', text: 'Produto cadastrado com sucesso!' });
      
      // Resetar formulário
      setName('');
      setPrice('');
      setSizes({});
      setImage(null);
      setImagePreview(null);
      
    } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      console.error('Erro ao salvar:', error);
      setMessage({ type: 'error', text: 'Erro ao salvar. Verifique as permissões do Firebase.' });
    } finally {
      setSaving(false);
    }
  };

  // Loading inicial
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--primary-bg)]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[var(--accent-gold)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xs uppercase tracking-widest text-neutral-500">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--primary-bg)] py-12 px-4">
      <div className="max-w-5xl mx-auto">
        
        {/* Header com Logout */}
        <header className="flex justify-between items-center mb-10 pb-4 border-b border-neutral-200">
          <div>
            <h1 className="text-2xl font-black uppercase tracking-widest text-black">
              Painel Administrativo
            </h1>
            <p className="text-xs text-neutral-500 uppercase tracking-wider mt-1">
              Gerenciamento de Coleção
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold bg-[var(--accent-gold)] px-3 py-1.5 rounded text-black">
              HADARAH
            </span>
            <button
              onClick={handleLogout}
              className="text-xs text-neutral-400 hover:text-[var(--accent-blue)] transition-colors underline underline-offset-4"
            >
              Sair
            </button>
          </div>
        </header>

        {/* Mensagens de Feedback */}
        {message && (
          <div className={`mb-6 p-4 rounded-l border-l-4 ${
            message.type === 'success' 
              ? 'bg-green-50 border-green-500 text-green-800' 
              : 'bg-red-50 border-red-500 text-red-800'
          }`}>
            <p className="text-sm font-medium">{message.text}</p>
          </div>
        )}

        {/* Formulário */}
        <form onSubmit={handleSave} className="bg-white rounded-sm shadow-lg overflow-hidden">
          
          {/* Header do Form */}
          <div className="bg-neutral-900 px-8 py-5">
            <h2 className="text-lg font-serif text-white">
              Cadastrar Novo Produto
            </h2>
          </div>

          <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
            
            {/* Coluna Esquerda: Dados do Produto */}
            <div className="space-y-6">
              
              {/* Nome */}
              <div className="group">
                <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-400 group-focus-within:text-[var(--accent-blue)] transition-colors">
                  Nome do Produto
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2 w-full bg-transparent border-b border-neutral-200 py-3 outline-none focus:border-[var(--accent-blue)] transition-all text-black font-medium"
                  placeholder="Ex: Havaiana Signature Gold"
                  required
                />
              </div>

              {/* Preço */}
              <div className="group">
                <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-400 group-focus-within:text-[var(--accent-blue)] transition-colors">
                  Preço (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="mt-2 w-full bg-transparent border-b border-neutral-200 py-3 outline-none focus:border-[var(--accent-blue)] transition-all text-black font-medium"
                  placeholder="0,00"
                  required
                />
              </div>

              {/* Categoria */}
              <div className="group">
                <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-400 group-focus-within:text-[var(--accent-blue)] transition-colors">
                  Categoria
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as 'havaianas' | 'roupas')}
                  className="mt-2 w-full bg-transparent border-b border-neutral-200 py-3 outline-none focus:border-[var(--accent-blue)] transition-all text-black font-medium appearance-none cursor-pointer"
                >
                  <option value="havaianas">Havaianas Premium</option>
                  <option value="roupas">Roupas de Elite</option>
                </select>
              </div>

              {/* Upload de Imagem */}
              <div className="group">
                <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-400 group-focus-within:text-[var(--accent-blue)] transition-colors">
                  Foto do Produto
                </label>
                <div className="mt-2 flex items-center gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full text-sm text-neutral-500
                      file:mr-4 file:py-2.5 file:px-4
                      file:rounded-none file:border-0
                      file:text-[10px] file:font-black file:uppercase file:tracking-widest
                      file:bg-neutral-900 file:text-white
                      hover:file:bg-[var(--accent-gold)] hover:file:text-black
                      transition-all cursor-pointer"
                    required
                  />
                </div>
                
                {/* Preview da Imagem */}
                {imagePreview && (
                  <div className="mt-4 flex justify-center">
                    <div className="relative w-40 h-40 rounded-sm overflow-hidden border border-neutral-200">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImage(null);
                          setImagePreview(null);
                        }}
                        className="absolute top-2 right-2 bg-black/70 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center hover:bg-red-500 transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Coluna Direita: Estoque por Tamanho */}
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-4">
                  Estoque por Tamanho
                </label>
                
                <div className="space-y-3">
                  {availableSizes.map((size) => (
                    <div key={size} className="flex items-center justify-between group">
                      <span className="text-sm font-bold text-neutral-700 w-12">{size}</span>
                      <div className="flex-1 mx-4">
                        <input
                          type="number"
                          min="0"
                          value={sizes[size] ?? 0}
                          onChange={(e) => handleSizeChange(size, Number(e.target.value))}
                          className="w-full bg-transparent border-b border-neutral-200 py-2 text-right outline-none focus:border-[var(--accent-blue)] transition-all text-black"
                          placeholder="0"
                        />
                      </div>
                      <span className="text-[10px] text-neutral-400 uppercase">un</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Botão Salvar */}
              <button
                type="submit"
                disabled={saving || !image}
                className="w-full mt-8 bg-black text-white py-4 text-xs font-bold uppercase tracking-[0.3em] 
                  hover:bg-[var(--accent-gold)] hover:text-black 
                  disabled:opacity-50 disabled:cursor-not-allowed 
                  transition-all duration-500"
              >
                {saving ? 'Cadastrando...' : 'Publicar na Vitrine'}
              </button>

              {/* Dica */}
              <p className="text-[10px] text-neutral-400 text-center uppercase tracking-wider">
                O produto aparecerá imediatamente na loja
              </p>
            </div>
          </div>
        </form>

        {/* Footer */}
        <footer className="mt-12 text-center">
          <p className="text-[10px] text-neutral-400 uppercase tracking-widest">
            Hadarah Store © {new Date().getFullYear()} — Todos os direitos reservados
          </p>
        </footer>

      </div>
    </div>
  );
}