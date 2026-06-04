'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/src/services/firebase';

interface ThemeDoc {
  storeName: string;
  primaryColor: string;
  accentColor: string;
  logoUrl: string;
}

const DEFAULT_THEME: ThemeDoc = {
  storeName: 'Hadarah Store',
  primaryColor: '#1A1A1A',
  accentColor: '#C8A882',
  logoUrl: '',
};

export default function AdminAparencia() {
  const [theme, setTheme] = useState<ThemeDoc>(DEFAULT_THEME);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const snap = await getDoc(doc(db, 'settings', 'theme'));
        if (snap.exists()) {
          const data = snap.data() as Partial<ThemeDoc>;
          setTheme({ ...DEFAULT_THEME, ...data });
          setLogoPreview(data.logoUrl ?? '');
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (feedback) {
      const t = setTimeout(() => setFeedback(null), 3500);
      return () => clearTimeout(t);
    }
  }, [feedback]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      let logoUrl = theme.logoUrl;

      if (logoFile) {
        const storageRef = ref(storage, `images/logo/${Date.now()}_${logoFile.name}`);
        await uploadBytes(storageRef, logoFile);
        logoUrl = await getDownloadURL(storageRef);
      }

      const updated: ThemeDoc = { ...theme, logoUrl };
      await setDoc(doc(db, 'settings', 'theme'), updated);

      setTheme(updated);
      setLogoFile(null);
      setFeedback({ type: 'ok', text: 'Aparência salva! Recarregue a loja para ver as mudanças.' });
    } catch (err) {
      console.error(err);
      setFeedback({ type: 'err', text: 'Erro ao salvar as configurações.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-7 h-7 border-2 border-[#C8A882] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-xl">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-[#1A1A1A] uppercase tracking-wider">Aparência</h1>
        <p className="text-sm text-[#6B6B6B] mt-0.5">Personalize as cores e identidade da loja</p>
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

      <form onSubmit={handleSave} className="bg-white border border-[#E8E4DF] p-8 space-y-8">

        {/* Store Name */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-[0.3em] text-[#6B6B6B] mb-2">
            Nome da Loja
          </label>
          <input
            type="text"
            value={theme.storeName}
            onChange={(e) => setTheme((t) => ({ ...t, storeName: e.target.value }))}
            className="w-full bg-transparent border-b border-[#E8E4DF] py-2.5 text-[#1A1A1A] text-sm outline-none focus:border-[#C8A882] transition-colors"
          />
        </div>

        {/* Colors */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-[0.3em] text-[#6B6B6B] mb-3">
              Cor Primária
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={theme.primaryColor}
                onChange={(e) => setTheme((t) => ({ ...t, primaryColor: e.target.value }))}
                className="w-10 h-10 border border-[#E8E4DF] cursor-pointer rounded-sm bg-transparent p-0.5"
              />
              <input
                type="text"
                value={theme.primaryColor}
                onChange={(e) => setTheme((t) => ({ ...t, primaryColor: e.target.value }))}
                className="flex-1 bg-transparent border-b border-[#E8E4DF] py-2 text-[#1A1A1A] text-sm uppercase outline-none focus:border-[#C8A882] transition-colors font-mono"
                maxLength={7}
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-[0.3em] text-[#6B6B6B] mb-3">
              Cor de Acento
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={theme.accentColor}
                onChange={(e) => setTheme((t) => ({ ...t, accentColor: e.target.value }))}
                className="w-10 h-10 border border-[#E8E4DF] cursor-pointer rounded-sm bg-transparent p-0.5"
              />
              <input
                type="text"
                value={theme.accentColor}
                onChange={(e) => setTheme((t) => ({ ...t, accentColor: e.target.value }))}
                className="flex-1 bg-transparent border-b border-[#E8E4DF] py-2 text-[#1A1A1A] text-sm uppercase outline-none focus:border-[#C8A882] transition-colors font-mono"
                maxLength={7}
              />
            </div>
          </div>
        </div>

        {/* Preview */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#6B6B6B] mb-3">Preview</p>
          <div
            className="flex items-center gap-4 p-4 border border-[#E8E4DF]"
            style={{ backgroundColor: '#FAFAF8' }}
          >
            <div className="w-8 h-8 rounded-sm" style={{ backgroundColor: theme.primaryColor }} />
            <div className="w-8 h-8 rounded-sm" style={{ backgroundColor: theme.accentColor }} />
            <span className="text-sm font-medium" style={{ color: theme.primaryColor }}>
              {theme.storeName}
            </span>
            <span
              className="text-xs px-3 py-1 font-bold uppercase tracking-wide"
              style={{ backgroundColor: theme.accentColor, color: '#FAFAF8' }}
            >
              CTA
            </span>
          </div>
        </div>

        {/* Logo upload */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-[0.3em] text-[#6B6B6B] mb-3">
            Logo da Loja
          </label>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="border border-[#E8E4DF] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#6B6B6B] hover:border-[#C8A882] hover:text-[#1A1A1A] transition-all"
          >
            Escolher logo
          </button>
          {logoPreview && (
            <div className="mt-3 relative w-40 h-16 overflow-hidden bg-[#F2EDE8] flex items-center justify-center">
              <Image
                src={logoPreview}
                alt="Logo preview"
                fill
                className="object-contain p-2"
                sizes="160px"
                unoptimized={logoPreview.startsWith('blob:')}
              />
            </div>
          )}
          <p className="text-[11px] text-[#6B6B6B] mt-2">
            Recomendado: PNG transparente, mínimo 400×120px
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-[#1A1A1A] text-white py-3.5 text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-[#C8A882] hover:text-[#1A1A1A] transition-all duration-300 disabled:opacity-50"
        >
          {saving ? 'Salvando...' : 'Salvar Aparência'}
        </button>
      </form>
    </div>
  );
}
