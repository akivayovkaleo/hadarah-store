'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/src/services/firebase';
import { Product } from '@/src/types/product';
import Footer from '@/src/components/Footer';

const BAG_ICON = (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round"
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
);

export default function ProdutoClient({ id }: { id: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [imageVisible, setImageVisible] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const snap = await getDoc(doc(db, 'products', id));
        if (snap.exists()) setProduct({ id: snap.id, ...snap.data() } as Product);
      } catch (err) {
        console.error('Erro ao buscar produto:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleImageSelect = (index: number) => {
    if (index === selectedImage) return;
    setImageVisible(false);
    setTimeout(() => {
      setSelectedImage(index);
      setImageVisible(true);
    }, 200);
  };

  const handleAddToCart = async () => {
    if (!selectedSize) {
      alert('Selecione um tamanho para continuar.');
      return;
    }
    setIsAdding(true);
    await new Promise((r) => setTimeout(r, 900));
    alert(`Produto adicionado!\n${product?.name} — ${selectedSize} × ${quantity}`);
    setIsAdding(false);
  };

  // ── Loading ──
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAF8]">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="aspect-[3/4] bg-[#E8E4DF] animate-pulse rounded-sm" />
            <div className="space-y-6 pt-4">
              <div className="h-6 bg-[#E8E4DF] animate-pulse rounded w-1/2" />
              <div className="h-10 bg-[#E8E4DF] animate-pulse rounded w-3/4" />
              <div className="h-32 bg-[#E8E4DF] animate-pulse rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Not found ──
  if (!product) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-light text-[#1A1A1A] mb-4"
              style={{ fontFamily: 'var(--font-playfair)' }}>
            Produto não encontrado
          </h1>
          <Link href="/colecao"
                className="text-sm text-[#C8A882] hover:text-[#1A1A1A] transition-colors footer-link">
            Voltar para a coleção
          </Link>
        </div>
      </div>
    );
  }

  const availableSizes = Object.entries(product.sizes ?? {})
    .filter(([, qty]) => qty > 0)
    .map(([size]) => size);
  const totalStock = Object.values(product.sizes ?? {}).reduce((a, b) => a + b, 0);

  const images = [
    product.imageUrl || product.image,
    ...(product.imageUrlHover ? [product.imageUrlHover] : []),
  ].filter(Boolean) as string[];

  return (
    <div className="min-h-screen bg-[#FAFAF8]">

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 pt-6 pb-2">
        <nav>
          <ol className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[#6B6B6B]">
            <li><Link href="/" className="hover:text-[#C8A882] transition-colors">Home</Link></li>
            <li>/</li>
            <li><Link href="/colecao" className="hover:text-[#C8A882] transition-colors">Coleção</Link></li>
            <li>/</li>
            <li className="text-[#1A1A1A] font-medium truncate max-w-[200px]">{product.name}</li>
          </ol>
        </nav>
      </div>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-6 py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

          {/* ── Gallery ── */}
          <div className="space-y-3">
            {/* Main image — fade on switch */}
            <div className="relative aspect-[3/4] bg-[#F2EDE8] overflow-hidden rounded-sm">
              <Image
                src={images[selectedImage] ?? ''}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                quality={90}
                className={[
                  'object-cover transition-opacity duration-200',
                  imageVisible ? 'opacity-100' : 'opacity-0',
                ].join(' ')}
              />
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3">
                {images.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => handleImageSelect(i)}
                    className={[
                      'w-20 h-20 relative overflow-hidden rounded-sm transition-all duration-200 border-2',
                      selectedImage === i
                        ? 'border-[#1A1A1A]'
                        : 'border-transparent opacity-55 hover:opacity-100 hover:border-[#E8E4DF]',
                    ].join(' ')}
                    aria-label={`Ver imagem ${i + 1}`}
                  >
                    <Image src={src} alt={`Vista ${i + 1}`} fill sizes="80px"
                           className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Info ── */}
          <div className="space-y-8 lg:pt-2">

            {/* Header */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#C8A882] mb-3">
                {product.category === 'havaianas' ? 'Havaianas Premium' : 'Coleção Exclusiva'}
              </p>
              <h1 className="text-3xl md:text-4xl font-light text-[#1A1A1A] mb-4 leading-tight"
                  style={{ fontFamily: 'var(--font-playfair)' }}>
                {product.name}
              </h1>
              <p className="text-2xl font-medium text-[#C8A882]">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
              </p>
            </div>

            {/* Description */}
            <p className="text-sm text-[#6B6B6B] leading-relaxed">
              {product.description ||
                'Peça exclusiva desenvolvida com materiais premium e atenção aos detalhes. Cada produto Hadarah é cuidadosamente selecionado para oferecer o máximo em exclusividade e sofisticação.'}
            </p>

            {/* Size selector */}
            {availableSizes.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#1A1A1A]">
                    Tamanho
                  </span>
                  <button className="text-[10px] text-[#6B6B6B] hover:text-[#C8A882] transition-colors uppercase tracking-wider">
                    Guia de tamanhos
                  </button>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={[
                        'px-4 py-2.5 border text-sm font-medium transition-all duration-200',
                        selectedSize === size
                          ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                          : 'border-[#E8E4DF] text-[#6B6B6B] hover:border-[#1A1A1A] hover:text-[#1A1A1A]',
                      ].join(' ')}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {totalStock < 10 && totalStock > 0 && (
                  <p className="mt-2.5 text-xs text-amber-600">
                    ⚡ Apenas {totalStock} unidades disponíveis
                  </p>
                )}
              </div>
            )}

            {/* Quantity */}
            <div>
              <span className="block text-[11px] font-bold uppercase tracking-[0.3em] text-[#1A1A1A] mb-3">
                Quantidade
              </span>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-11 h-11 border border-[#E8E4DF] flex items-center justify-center text-[#1A1A1A] hover:border-[#1A1A1A] transition-colors"
                >
                  −
                </button>
                <span className="w-10 text-center text-base font-medium text-[#1A1A1A]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-11 h-11 border border-[#E8E4DF] flex items-center justify-center text-[#1A1A1A] hover:border-[#1A1A1A] transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to cart — slide animation */}
            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                disabled={isAdding || availableSizes.length === 0}
                className="group relative overflow-hidden w-full py-4 bg-[#1A1A1A] text-white btn-ripple disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C8A882]"
              >
                {/* Default label */}
                <span className={[
                  'flex items-center justify-center text-[11px] font-bold uppercase tracking-[0.35em]',
                  'transition-all duration-300',
                  isAdding ? 'opacity-0 -translate-y-3' : 'opacity-100 translate-y-0 group-hover:-translate-y-full group-hover:opacity-0',
                ].join(' ')}>
                  {availableSizes.length === 0 ? 'Esgotado' : 'Adicionar ao Carrinho'}
                </span>

                {/* Hover / adding state */}
                <span className={[
                  'absolute inset-0 flex items-center justify-center gap-2',
                  'text-[11px] font-bold uppercase tracking-[0.35em]',
                  'transition-all duration-300',
                  isAdding
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-full group-hover:translate-y-0 group-hover:opacity-100',
                ].join(' ')}>
                  {isAdding ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Adicionando...
                    </>
                  ) : (
                    <>{BAG_ICON} Adicionar ao Carrinho</>
                  )}
                </span>
              </button>

              {availableSizes.length === 0 && (
                <p className="text-center text-xs text-red-500">Produto temporariamente esgotado</p>
              )}
            </div>

            {/* Trust badges */}
            <div className="pt-6 border-t border-[#E8E4DF] space-y-4">
              {[
                { title: 'Entrega expressa', sub: 'Envio em até 24h úteis' },
                { title: 'Compra segura', sub: 'Pagamento 100% protegido' },
                { title: 'Troca grátis', sub: '30 dias para trocar' },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-3">
                  <div className="w-1 h-1 rounded-full bg-[#C8A882] mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-[#1A1A1A]">{item.title}</p>
                    <p className="text-xs text-[#6B6B6B]">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
