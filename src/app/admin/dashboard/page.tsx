'use client';
import { useState, useEffect } from 'react';
import { db, storage } from '@/src/services/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from '@/src/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  // Estados do Formulário
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<'havaianas' | 'roupas'>('havaianas');
  const [image, setImage] = useState<File | null>(null);
  const [sizes, setSizes] = useState<{ [key: string]: number }>({});

  // Redireciona se não estiver logado
  useEffect(() => {
    if (!loading && !user) {
      router.push('/admin');
    }
  }, [loading, user, router]);

  const availableSizes = category === 'havaianas' 
    ? ['33-34', '35-36', '37-38', '39-40', '41-42', '43-44'] 
    : ['P', 'M', 'G', 'GG', 'XG'];

  const handleSizeChange = (size: string, qty: number) => {
    setSizes(prev => ({ ...prev, [size]: qty }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) return alert("Adicione uma foto do produto!");

    try {
      // 1. Upload da Foto
      const fileRef = ref(storage, `products/${Date.now()}_${image.name}`);
      await uploadBytes(fileRef, image);
      const imageUrl = await getDownloadURL(fileRef);

      // 2. Salvar no Firestore
      await addDoc(collection(db, 'products'), {
        name,
        price: Number(price),
        category,
        imageUrl,
        sizes,
        active: true,
        createdAt: new Date().toISOString()
      });

      alert("Produto Hadarah cadastrado com sucesso!");
      // Limpar campos
      setName(''); setPrice(''); setSizes({}); setImage(null);
    } catch (error) {
      alert("Erro ao salvar. Verifique as permissões do Firebase.");
    }
  };

  if (loading) return <div className="flex justify-center mt-20">Carregando Painel...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 text-black">
      <header className="flex justify-between items-center mb-8 border-b-2 border-[var(--accent-gold)] pb-4">
        <h1 className="text-2xl font-black uppercase tracking-widest">Painel Administrativo</h1>
        <span className="text-sm font-bold bg-[var(--accent-gold)] px-3 py-1 rounded text-white">HADARAH</span>
      </header>

      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-8 rounded-xl shadow-xl">
        {/* Lado Esquerdo: Info Básica */}
        <div className="space-y-4">
          <label className="block font-bold">Nome do Produto</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full border-2 p-2 rounded outline-none focus:border-[var(--accent-gold)]" placeholder="Ex: Havaiana Tradicional" required />
          
          <label className="block font-bold">Preço (R$)</label>
          <input type="number" value={price} onChange={e => setPrice(e.target.value)} className="w-full border-2 p-2 rounded outline-none focus:border-[var(--accent-gold)]" placeholder="0.00" required />

          <label className="block font-bold">Categoria</label>
          <select
            value={category}
            onChange={e => setCategory(e.target.value as 'havaianas' | 'roupas')}
            className="w-full border-2 p-2 rounded outline-none focus:border-[var(--accent-gold)]"
          >
            <option value="havaianas">Havaianas</option>
            <option value="roupas">Roupas</option>
          </select>

          <label className="block font-bold">Foto do Produto</label>
          <input
            type="file"
            accept="image/*"
            onChange={e => {
              if (e.target.files && e.target.files[0]) {
                setImage(e.target.files[0]);
              }
            }}
            className="w-full"
            required
          />
        </div>

        {/* Lado Direito: Estoque por tamanho */}
        <div className="space-y-4">
          <label className="block font-bold">Estoque por Tamanho</label>
          {availableSizes.map(size => (
            <div key={size} className="flex items-center space-x-2">
              <span className="w-16">{size}</span>
              <input
                type="number"
                min="0"
                value={sizes[size] ?? 0}
                onChange={e => handleSizeChange(size, Number(e.target.value))}
                className="w-full border-2 p-2 rounded outline-none focus:border-[var(--accent-gold)]"
              />
            </div>
          ))}

          <button
            type="submit"
            className="w-full bg-[var(--accent-gold)] text-black font-bold py-3 rounded-lg hover:bg-black hover:text-white transition-colors"
          >
            SALVAR PRODUTO
          </button>
        </div>
      </form>
    </div>
  );
}