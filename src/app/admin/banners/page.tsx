'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc, doc, orderBy, query,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/src/services/firebase';
import { Banner } from '@/src/types/banner';

interface BannerForm {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  active: boolean;
  imageFile: File | null;
  imagePreview: string;
}

const EMPTY_FORM: BannerForm = {
  title: '',
  subtitle: '',
  ctaText: 'Explorar Coleção',
  ctaLink: '/colecao',
  active: true,
  imageFile: null,
  imagePreview: '',
};

export default function AdminBanners() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<BannerForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(query(collection(db, 'banners'), orderBy('order', 'asc')));
      setBanners(snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Banner[]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBanners(); }, []);

  useEffect(() => {
    if (feedback) {
      const t = setTimeout(() => setFeedback(null), 3000);
      return () => clearTimeout(t);
    }
  }, [feedback]);

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (b: Banner) => {
    setEditingId(b.id);
    setForm({
      title: b.title,
      subtitle: b.subtitle,
      ctaText: b.ctaText,
      ctaLink: b.ctaLink,
      active: b.active,
      imageFile: null,
      imagePreview: b.imageUrl,
    });
    setModalOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm((f) => ({ ...f, imageFile: file, imagePreview: URL.createObjectURL(file) }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId && !form.imageFile) {
      setFeedback({ type: 'err', text: 'Selecione uma imagem para o banner.' });
      return;
    }

    setSaving(true);
    try {
      let imageUrl = form.imagePreview;

      if (form.imageFile) {
        const storageRef = ref(storage, `images/banners/${Date.now()}_${form.imageFile.name}`);
        await uploadBytes(storageRef, form.imageFile);
        imageUrl = await getDownloadURL(storageRef);
      }

      const data = {
        title: form.title,
        subtitle: form.subtitle,
        ctaText: form.ctaText,
        ctaLink: form.ctaLink,
        active: form.active,
        imageUrl,
      };

      if (editingId) {
        await updateDoc(doc(db, 'banners', editingId), data);
        setFeedback({ type: 'ok', text: 'Banner atualizado!' });
      } else {
        const nextOrder = banners.length > 0 ? Math.max(...banners.map((b) => b.order)) + 1 : 0;
        await addDoc(collection(db, 'banners'), {
          ...data,
          order: nextOrder,
          createdAt: new Date().toISOString(),
        });
        setFeedback({ type: 'ok', text: 'Banner adicionado!' });
      }

      setModalOpen(false);
      fetchBanners();
    } catch (err) {
      console.error(err);
      setFeedback({ type: 'err', text: 'Erro ao salvar banner.' });
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (b: Banner) => {
    try {
      await updateDoc(doc(db, 'banners', b.id), { active: !b.active });
      setBanners((prev) => prev.map((x) => (x.id === b.id ? { ...x, active: !x.active } : x)));
    } catch {
      setFeedback({ type: 'err', text: 'Erro ao alterar status.' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir este banner?')) return;
    try {
      await deleteDoc(doc(db, 'banners', id));
      setBanners((prev) => prev.filter((b) => b.id !== id));
      setFeedback({ type: 'ok', text: 'Banner excluído.' });
    } catch {
      setFeedback({ type: 'err', text: 'Erro ao excluir.' });
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= banners.length) return;

    const updated = [...banners];
    const tmp = updated[index];
    updated[index] = updated[target];
    updated[target] = tmp;

    const reordered = updated.map((b, i) => ({ ...b, order: i }));
    setBanners(reordered);

    try {
      await Promise.all(
        reordered.map((b) => updateDoc(doc(db, 'banners', b.id), { order: b.order }))
      );
    } catch {
      setFeedback({ type: 'err', text: 'Erro ao reordenar.' });
      fetchBanners();
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold text-[#1A1A1A] uppercase tracking-wider">Banners</h1>
          <p className="text-sm text-[#6B6B6B] mt-0.5">{banners.filter((b) => b.active).length} ativos • {banners.length} total</p>
        </div>
        <button
          onClick={openCreate}
          className="bg-[#1A1A1A] text-white px-6 py-2.5 text-[11px] font-bold uppercase tracking-[0.25em] hover:bg-[#C8A882] hover:text-[#1A1A1A] transition-all duration-300"
        >
          + Novo Banner
        </button>
      </div>

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

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-7 h-7 border-2 border-[#C8A882] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : banners.length === 0 ? (
        <div className="bg-white border border-[#E8E4DF] p-10 text-center text-[#6B6B6B] text-sm">
          Nenhum banner cadastrado. O hero da loja usa as imagens padrão.
        </div>
      ) : (
        <div className="space-y-3">
          {banners.map((b, i) => (
            <div
              key={b.id}
              className={`bg-white border flex items-center gap-5 p-4 transition-all ${
                b.active ? 'border-[#E8E4DF]' : 'border-[#E8E4DF] opacity-60'
              }`}
            >
              {/* Order controls */}
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => handleMove(i, 'up')}
                  disabled={i === 0}
                  className="p-1 text-[#6B6B6B] hover:text-[#1A1A1A] disabled:opacity-20 transition-colors"
                  aria-label="Mover para cima"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                  </svg>
                </button>
                <span className="text-[10px] text-[#6B6B6B] text-center">{i + 1}</span>
                <button
                  onClick={() => handleMove(i, 'down')}
                  disabled={i === banners.length - 1}
                  className="p-1 text-[#6B6B6B] hover:text-[#1A1A1A] disabled:opacity-20 transition-colors"
                  aria-label="Mover para baixo"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              {/* Thumbnail */}
              <div className="w-24 h-14 relative overflow-hidden bg-[#F2EDE8] flex-shrink-0">
                {b.imageUrl && (
                  <Image src={b.imageUrl} alt={b.title} fill className="object-cover" sizes="96px" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-[#1A1A1A] text-sm truncate">{b.title}</p>
                <p className="text-[#6B6B6B] text-xs truncate mt-0.5">{b.subtitle}</p>
                <p className="text-[10px] text-[#C8A882] mt-1 uppercase tracking-wide">
                  CTA: {b.ctaText} → {b.ctaLink}
                </p>
              </div>

              {/* Status */}
              <span
                className={`text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 ${
                  b.active ? 'bg-emerald-50 text-emerald-700' : 'bg-[#F0EDE8] text-[#6B6B6B]'
                }`}
              >
                {b.active ? 'Ativo' : 'Inativo'}
              </span>

              {/* Actions */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <button
                  onClick={() => openEdit(b)}
                  className="text-[11px] font-medium text-[#C8A882] hover:text-[#1A1A1A] uppercase tracking-wide transition-colors"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleToggleActive(b)}
                  className="text-[11px] font-medium text-[#6B6B6B] hover:text-[#1A1A1A] uppercase tracking-wide transition-colors"
                >
                  {b.active ? 'Desativar' : 'Ativar'}
                </button>
                <button
                  onClick={() => handleDelete(b.id)}
                  className="text-[11px] font-medium text-red-400 hover:text-red-600 uppercase tracking-wide transition-colors"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white w-full max-w-lg shadow-2xl">
            <div className="bg-[#1A1A1A] px-8 py-5 flex items-center justify-between">
              <h2
                className="text-white text-lg font-light"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                {editingId ? 'Editar Banner' : 'Novo Banner'}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="text-white/50 hover:text-white text-xl leading-none transition-colors"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSave} className="p-8 space-y-6">
              {/* Image */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.3em] text-[#6B6B6B] mb-2">
                  Imagem {!editingId && '*'}
                </label>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="border border-[#E8E4DF] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#6B6B6B] hover:border-[#C8A882] hover:text-[#1A1A1A] transition-all"
                >
                  Escolher arquivo
                </button>
                {form.imagePreview && (
                  <div className="mt-3 relative w-full h-32 overflow-hidden bg-[#F2EDE8]">
                    <Image
                      src={form.imagePreview}
                      alt="Preview"
                      fill
                      className="object-cover"
                      sizes="400px"
                      unoptimized={form.imagePreview.startsWith('blob:')}
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.3em] text-[#6B6B6B] mb-2">Título *</label>
                <input
                  required
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="NOVA COLEÇÃO"
                  className="w-full bg-transparent border-b border-[#E8E4DF] py-2.5 text-[#1A1A1A] text-sm outline-none focus:border-[#C8A882] transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.3em] text-[#6B6B6B] mb-2">Subtítulo</label>
                <input
                  type="text"
                  value={form.subtitle}
                  onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
                  placeholder="Descrição do banner..."
                  className="w-full bg-transparent border-b border-[#E8E4DF] py-2.5 text-[#1A1A1A] text-sm outline-none focus:border-[#C8A882] transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.3em] text-[#6B6B6B] mb-2">Texto do Botão</label>
                  <input
                    type="text"
                    value={form.ctaText}
                    onChange={(e) => setForm((f) => ({ ...f, ctaText: e.target.value }))}
                    placeholder="Explorar Coleção"
                    className="w-full bg-transparent border-b border-[#E8E4DF] py-2.5 text-[#1A1A1A] text-sm outline-none focus:border-[#C8A882] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.3em] text-[#6B6B6B] mb-2">Link do Botão</label>
                  <input
                    type="text"
                    value={form.ctaLink}
                    onChange={(e) => setForm((f) => ({ ...f, ctaLink: e.target.value }))}
                    placeholder="/colecao"
                    className="w-full bg-transparent border-b border-[#E8E4DF] py-2.5 text-[#1A1A1A] text-sm outline-none focus:border-[#C8A882] transition-colors"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, active: !f.active }))}
                  className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${form.active ? 'bg-[#C8A882]' : 'bg-[#E8E4DF]'}`}
                >
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${form.active ? 'left-6' : 'left-1'}`} />
                </button>
                <span className="text-sm text-[#1A1A1A]">{form.active ? 'Banner ativo' : 'Banner inativo'}</span>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-[#1A1A1A] text-white py-3 text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-[#C8A882] hover:text-[#1A1A1A] transition-all duration-300 disabled:opacity-50"
                >
                  {saving ? 'Salvando...' : 'Salvar Banner'}
                </button>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 border border-[#E8E4DF] text-[#6B6B6B] py-3 text-[11px] font-bold uppercase tracking-[0.3em] hover:border-[#1A1A1A] hover:text-[#1A1A1A] transition-all"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
