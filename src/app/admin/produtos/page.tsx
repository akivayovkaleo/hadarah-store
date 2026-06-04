'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc, doc, orderBy, query,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/src/services/firebase';
import { Product } from '@/src/types/product';

type FormMode = 'create' | 'edit';

const HAVAIANA_SIZES = ['33-34', '35-36', '37-38', '39-40', '41-42', '43-44'];
const ROUPA_SIZES = ['PP', 'P', 'M', 'G', 'GG', 'XG'];

function sizesFor(category: Product['category']) {
  if (category === 'havaianas') return HAVAIANA_SIZES;
  if (category === 'roupas') return ROUPA_SIZES;
  return ['UN'];
}

function Badge({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded-sm ${
        active ? 'bg-emerald-50 text-emerald-700' : 'bg-[#F0EDE8] text-[#6B6B6B]'
      }`}
    >
      {active ? 'Ativo' : 'Inativo'}
    </span>
  );
}

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  category: Product['category'];
  active: boolean;
  sizes: Record<string, number>;
  imageFile: File | null;
  imagePreview: string;
}

const EMPTY_FORM: ProductFormData = {
  name: '',
  description: '',
  price: '',
  category: 'havaianas',
  active: true,
  sizes: {},
  imageFile: null,
  imagePreview: '',
};

export default function AdminProdutos() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState<FormMode>('create');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductFormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(query(collection(db, 'products'), orderBy('createdAt', 'desc')));
      setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Product[]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  useEffect(() => {
    if (feedback) {
      const t = setTimeout(() => setFeedback(null), 3500);
      return () => clearTimeout(t);
    }
  }, [feedback]);

  const openCreate = () => {
    setMode('create');
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (p: Product) => {
    setMode('edit');
    setEditingId(p.id);
    setForm({
      name: p.name,
      description: p.description ?? '',
      price: String(p.price),
      category: p.category,
      active: p.active,
      sizes: { ...p.sizes },
      imageFile: null,
      imagePreview: p.imageUrl || p.image || '',
    });
    setModalOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm((f) => ({
      ...f,
      imageFile: file,
      imagePreview: URL.createObjectURL(file),
    }));
  };

  const handleSizeChange = (size: string, qty: number) => {
    setForm((f) => ({ ...f, sizes: { ...f.sizes, [size]: qty } }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'create' && !form.imageFile) {
      setFeedback({ type: 'err', text: 'Selecione uma imagem para o produto.' });
      return;
    }

    setSaving(true);
    try {
      let imageUrl = form.imagePreview;

      if (form.imageFile) {
        const storageRef = ref(storage, `images/produtos/${Date.now()}_${form.imageFile.name}`);
        await uploadBytes(storageRef, form.imageFile);
        imageUrl = await getDownloadURL(storageRef);
      }

      const data = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        category: form.category,
        active: form.active,
        sizes: form.sizes,
        imageUrl,
        image: imageUrl,
      };

      if (mode === 'create') {
        await addDoc(collection(db, 'products'), {
          ...data,
          createdAt: new Date().toISOString(),
        });
        setFeedback({ type: 'ok', text: 'Produto criado com sucesso!' });
      } else if (editingId) {
        await updateDoc(doc(db, 'products', editingId), data);
        setFeedback({ type: 'ok', text: 'Produto atualizado com sucesso!' });
      }

      setModalOpen(false);
      fetchProducts();
    } catch (err) {
      console.error(err);
      setFeedback({ type: 'err', text: 'Erro ao salvar. Verifique as permissões do Firebase.' });
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (p: Product) => {
    try {
      await updateDoc(doc(db, 'products', p.id), { active: !p.active });
      setProducts((prev) => prev.map((x) => (x.id === p.id ? { ...x, active: !x.active } : x)));
    } catch {
      setFeedback({ type: 'err', text: 'Erro ao alterar status.' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir este produto permanentemente?')) return;
    try {
      await deleteDoc(doc(db, 'products', id));
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setFeedback({ type: 'ok', text: 'Produto excluído.' });
    } catch {
      setFeedback({ type: 'err', text: 'Erro ao excluir produto.' });
    }
  };

  const totalStock = (sizes: Record<string, number>) =>
    Object.values(sizes).reduce((a, b) => a + b, 0);

  const availableSizes = sizesFor(form.category);

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold text-[#1A1A1A] uppercase tracking-wider">Produtos</h1>
          <p className="text-sm text-[#6B6B6B] mt-0.5">{products.length} itens na vitrine</p>
        </div>
        <button
          onClick={openCreate}
          className="bg-[#1A1A1A] text-white px-6 py-2.5 text-[11px] font-bold uppercase tracking-[0.25em] hover:bg-[#C8A882] hover:text-[#1A1A1A] transition-all duration-300"
        >
          + Novo Produto
        </button>
      </div>

      {/* Feedback banner */}
      {feedback && (
        <div
          className={`mb-6 px-4 py-3 border-l-4 text-sm font-medium ${
            feedback.type === 'ok'
              ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
              : 'bg-red-50 border-red-400 text-red-800'
          }`}
        >
          {feedback.text}
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-[#E8E4DF] overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-7 h-7 border-2 border-[#C8A882] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-[#6B6B6B] text-sm">
            Nenhum produto cadastrado. Clique em &quot;Novo Produto&quot; para começar.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E8E4DF] bg-[#FAFAF8]">
                  <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-[0.25em] text-[#6B6B6B] w-16">Foto</th>
                  <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-[0.25em] text-[#6B6B6B]">Nome</th>
                  <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-[0.25em] text-[#6B6B6B]">Categoria</th>
                  <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-[0.25em] text-[#6B6B6B]">Preço</th>
                  <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-[0.25em] text-[#6B6B6B]">Estoque</th>
                  <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-[0.25em] text-[#6B6B6B]">Status</th>
                  <th className="text-right px-4 py-3 text-[10px] font-bold uppercase tracking-[0.25em] text-[#6B6B6B]">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E4DF]">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-[#FAFAF8] transition-colors">
                    <td className="px-4 py-3">
                      <div className="w-12 h-12 relative overflow-hidden bg-[#F2EDE8]">
                        {(p.imageUrl || p.image) && (
                          <Image
                            src={p.imageUrl || p.image}
                            alt={p.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-[#1A1A1A] max-w-[200px] truncate">{p.name}</td>
                    <td className="px-4 py-3 text-[#6B6B6B] capitalize">{p.category}</td>
                    <td className="px-4 py-3 text-[#1A1A1A] font-medium">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(p.price)}
                    </td>
                    <td className="px-4 py-3 text-[#6B6B6B]">{totalStock(p.sizes ?? {})}</td>
                    <td className="px-4 py-3"><Badge active={p.active} /></td>
                    <td className="px-4 py-3 text-right space-x-3">
                      <button
                        onClick={() => openEdit(p)}
                        className="text-[11px] font-medium text-[#C8A882] hover:text-[#1A1A1A] uppercase tracking-wide transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleToggleActive(p)}
                        className="text-[11px] font-medium text-[#6B6B6B] hover:text-[#1A1A1A] uppercase tracking-wide transition-colors"
                      >
                        {p.active ? 'Desativar' : 'Ativar'}
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="text-[11px] font-medium text-red-400 hover:text-red-600 uppercase tracking-wide transition-colors"
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 py-8 px-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl shadow-2xl my-auto">
            {/* Modal header */}
            <div className="bg-[#1A1A1A] px-8 py-5 flex items-center justify-between">
              <h2
                className="text-white text-lg font-light"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                {mode === 'create' ? 'Novo Produto' : 'Editar Produto'}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="text-white/50 hover:text-white text-xl leading-none transition-colors"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSave} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left col */}
              <div className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.3em] text-[#6B6B6B] mb-2">
                    Nome *
                  </label>
                  <input
                    required
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Ex: Havaiana Signature"
                    className="w-full bg-transparent border-b border-[#E8E4DF] py-2.5 text-[#1A1A1A] text-sm outline-none focus:border-[#C8A882] transition-colors"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.3em] text-[#6B6B6B] mb-2">
                    Descrição
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    rows={3}
                    placeholder="Descrição opcional do produto..."
                    className="w-full bg-transparent border border-[#E8E4DF] p-3 text-[#1A1A1A] text-sm outline-none focus:border-[#C8A882] transition-colors resize-none"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.3em] text-[#6B6B6B] mb-2">
                    Preço (R$) *
                  </label>
                  <input
                    required
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                    placeholder="0,00"
                    className="w-full bg-transparent border-b border-[#E8E4DF] py-2.5 text-[#1A1A1A] text-sm outline-none focus:border-[#C8A882] transition-colors"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.3em] text-[#6B6B6B] mb-2">
                    Categoria *
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, category: e.target.value as Product['category'], sizes: {} }))
                    }
                    className="w-full bg-transparent border-b border-[#E8E4DF] py-2.5 text-[#1A1A1A] text-sm outline-none focus:border-[#C8A882] transition-colors cursor-pointer"
                  >
                    <option value="havaianas">Havaianas</option>
                    <option value="roupas">Roupas</option>
                    <option value="mercado">Mercado</option>
                  </select>
                </div>

                {/* Active toggle */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, active: !f.active }))}
                    className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                      form.active ? 'bg-[#C8A882]' : 'bg-[#E8E4DF]'
                    }`}
                  >
                    <span
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${
                        form.active ? 'left-6' : 'left-1'
                      }`}
                    />
                  </button>
                  <span className="text-sm text-[#1A1A1A]">
                    {form.active ? 'Produto ativo (visível na loja)' : 'Produto inativo (oculto)'}
                  </span>
                </div>

                {/* Image upload */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.3em] text-[#6B6B6B] mb-2">
                    Imagem {mode === 'create' ? '*' : '(opcional - substitui a atual)'}
                  </label>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="border border-[#E8E4DF] px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#6B6B6B] hover:border-[#C8A882] hover:text-[#1A1A1A] transition-all"
                  >
                    Escolher arquivo
                  </button>
                  {form.imagePreview && (
                    <div className="mt-3 relative w-28 h-28 overflow-hidden bg-[#F2EDE8]">
                      <Image
                        src={form.imagePreview}
                        alt="Preview"
                        fill
                        className="object-cover"
                        sizes="112px"
                        unoptimized={form.imagePreview.startsWith('blob:')}
                      />
                      <button
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, imageFile: null, imagePreview: '' }))}
                        className="absolute top-1 right-1 bg-black/60 text-white w-5 h-5 flex items-center justify-center text-xs hover:bg-red-500 transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Right col — Sizes */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.3em] text-[#6B6B6B] mb-4">
                  Estoque por Tamanho
                </label>
                <div className="space-y-3">
                  {availableSizes.map((size) => (
                    <div key={size} className="flex items-center gap-3">
                      <span className="text-sm font-medium text-[#1A1A1A] w-14">{size}</span>
                      <input
                        type="number"
                        min={0}
                        value={form.sizes[size] ?? 0}
                        onChange={(e) => handleSizeChange(size, Number(e.target.value))}
                        className="flex-1 bg-transparent border-b border-[#E8E4DF] py-1.5 text-right text-[#1A1A1A] text-sm outline-none focus:border-[#C8A882] transition-colors"
                      />
                      <span className="text-[10px] text-[#6B6B6B] uppercase">un</span>
                    </div>
                  ))}
                </div>

                {/* Save button at bottom of right col */}
                <div className="mt-10 space-y-3">
                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full bg-[#1A1A1A] text-white py-3.5 text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-[#C8A882] hover:text-[#1A1A1A] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? 'Salvando...' : mode === 'create' ? 'Publicar Produto' : 'Salvar Alterações'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="w-full border border-[#E8E4DF] text-[#6B6B6B] py-3 text-[11px] font-bold uppercase tracking-[0.3em] hover:border-[#1A1A1A] hover:text-[#1A1A1A] transition-all"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
