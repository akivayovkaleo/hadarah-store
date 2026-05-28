'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/src/services/firebase';
import { Product } from '@/src/types/product';
import Navbar from '@/src/components/Navbar';
import Footer from '@/src/components/Footer';
import { useCart } from '@/src/hooks/useCart';

export default function ProdutoPage() {
  const params = useParams();
  const productId = params.id as string;
  
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  // Buscar produto do Firebase
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, 'products', productId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() } as Product);
        } else {
          console.log('Produto não encontrado');
        }
      } catch (error) {
        console.error('Erro ao buscar produto:', error);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleAddToCart = () => {
    if (!selectedSize || !product) return;

    setIsAdding(true);
    addItem(product, selectedSize, quantity);

    setTimeout(() => {
      setIsAdding(false);
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 3000);
    }, 400);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F0F0F]">
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Skeleton da Imagem */}
            <div className="aspect-[3/4] bg-[#1A1A1A] animate-pulse rounded-sm" />
            
            {/* Skeleton das Informações */}
            <div className="space-y-6">
              <div className="h-8 bg-[#1A1A1A] animate-pulse rounded w-3/4" />
              <div className="h-6 bg-[#1A1A1A] animate-pulse rounded w-1/2" />
              <div className="h-32 bg-[#1A1A1A] animate-pulse rounded" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Produto não encontrado
  if (!product) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-[var(--font-serif)] text-white mb-4">Produto não encontrado</h1>
          <Link href="/colecao" className="text-[#D4AF37] hover:underline">
            Voltar para a coleção
          </Link>
        </div>
      </div>
    );
  }

  const allSizes = Object.entries(product.sizes || {});
  const totalStock = Object.values(product.sizes || {}).reduce((a, b) => a + b, 0);
  const selectedSizeStock = selectedSize ? (product.sizes[selectedSize] ?? 0) : 0;
  const canAddToCart = selectedSize !== null && selectedSizeStock > 0;

  return (
    <div className="min-h-screen bg-[#0F0F0F]">
      <Navbar />
      
      {/* ============================================
          BREADCRUMB
          ============================================ */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <nav className="text-sm">
          <ol className="flex items-center space-x-2 text-[#6B6B6B]">
            <li><Link href="/" className="hover:text-[#D4AF37] transition-colors">Home</Link></li>
            <li>/</li>
            <li><Link href="/colecao" className="hover:text-[#D4AF37] transition-colors">Coleção</Link></li>
            <li>/</li>
            <li className="text-[#D4AF37]">{product.name}</li>
          </ol>
        </nav>
      </div>

      {/* ============================================
          CONTEÚDO PRINCIPAL
          ============================================ */}
      <main className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* ============================================
              GALERIA DE IMAGENS
              ============================================ */}
          <div className="space-y-4">
            {/* Imagem Principal */}
            <div className="aspect-[3/4] bg-[#1A1A1A] rounded-sm overflow-hidden">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>

            {/* Thumbnails (se houver mais imagens no futuro) */}
            <div className="flex gap-4">
              <button
                onClick={() => setSelectedImage(0)}
                className={`w-20 h-20 rounded-sm overflow-hidden border-2 transition-all ${
                  selectedImage === 0 ? 'border-[#D4AF37]' : 'border-transparent opacity-50 hover:opacity-100'
                }`}
              >
                <Image
                  src={product.imageUrl}
                  alt={`${product.name} - vista 1`}
                  width={80}
                  height={80}
                  className="object-cover w-full h-full"
                />
              </button>
            </div>
          </div>

          {/* ============================================
              INFORMAÇÕES DO PRODUTO
              ============================================ */}
          <div className="space-y-8">
            
            {/* Header */}
            <div>
              <p className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.3em] mb-3">
                {product.category === 'havaianas' ? 'Havaianas Premium' : 'Coleção Exclusiva'}
              </p>
              <h1 className="font-[var(--font-serif)] text-3xl md:text-4xl font-light text-white mb-4">
                {product.name}
              </h1>
              <p className="text-2xl text-[#D4AF37] font-medium">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(product.price)}
              </p>
            </div>

            {/* Descrição */}
            <div className="prose prose-invert max-w-none">
              <p className="text-[#A3A3A3] leading-relaxed">
                {product.description ||
                  `Peça exclusiva desenvolvida com materiais premium e atenção aos detalhes.
Cada produto Hadarah é cuidadosamente selecionado para oferecer o máximo
em exclusividade e sofisticação.`}
              </p>
            </div>

            {/* Tamanho */}
            {allSizes.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm font-medium text-white uppercase tracking-wider">
                    Tamanho
                  </label>
                  <button className="text-[10px] text-[#6B6B6B] underline hover:text-[#D4AF37] transition-colors">
                    Guia de tamanhos
                  </button>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {allSizes.map(([size, stock]) => (
                    <button
                      key={size}
                      onClick={() => stock > 0 ? setSelectedSize(size) : undefined}
                      disabled={stock === 0}
                      className={`
                        py-3 px-4 border text-sm font-medium transition-all duration-300
                        ${stock === 0
                          ? 'border-[#1A1A1A] text-[#3A3A3A] cursor-not-allowed line-through'
                          : selectedSize === size
                            ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]'
                            : 'border-[#2A2A2A] text-[#A3A3A3] hover:border-[#D4AF37]/50 hover:text-white'
                        }
                      `}
                    >
                      {size}
                    </button>
                  ))}
                </div>

                {selectedSize && selectedSizeStock > 0 && selectedSizeStock < 5 && (
                  <p className="mt-3 text-sm text-orange-400">
                    ⚡ Apenas {selectedSizeStock} {selectedSizeStock === 1 ? 'unidade' : 'unidades'} neste tamanho
                  </p>
                )}
                {!selectedSize && totalStock > 0 && totalStock < 10 && (
                  <p className="mt-3 text-sm text-orange-400">
                    ⚡ Restam poucas unidades
                  </p>
                )}
              </div>
            )}

            {/* Quantidade */}
            <div>
              <label className="block text-sm font-medium text-white uppercase tracking-wider mb-4">
                Quantidade
              </label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 border border-[#2A2A2A] flex items-center justify-center text-white hover:border-[#D4AF37] transition-colors"
                >
                  -
                </button>
                <span className="w-12 text-center text-lg font-medium text-white">{quantity}</span>
                <button
                  onClick={() => setQuantity(prev => Math.min(prev + 1, selectedSizeStock || 1))}
                  disabled={selectedSizeStock > 0 && quantity >= selectedSizeStock}
                  className="w-12 h-12 border border-[#2A2A2A] flex items-center justify-center text-white hover:border-[#D4AF37] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  +
                </button>
              </div>
            </div>

            {/* Botão Adicionar ao Carrinho */}
            <div className="space-y-4">
              {!selectedSize && totalStock > 0 && (
                <p className="text-[11px] text-[#D4AF37] uppercase tracking-wider text-center">
                  Selecione um tamanho
                </p>
              )}
              <button
                onClick={handleAddToCart}
                disabled={isAdding || !canAddToCart}
                className="
                  w-full
                  py-4
                  bg-[#D4AF37]
                  text-[#0F0F0F]
                  text-[11px] font-black uppercase tracking-[0.3em]
                  hover:bg-[#D4AF37]/90
                  transition-all duration-300
                  disabled:opacity-50 disabled:cursor-not-allowed
                  focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 focus:ring-offset-[#0F0F0F]
                "
              >
                {isAdding ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Adicionando...
                  </span>
                ) : (
                  'ADICIONAR AO CARRINHO'
                )}
              </button>

              {totalStock === 0 && (
                <p className="text-center text-sm text-red-400">
                  Produto temporariamente esgotado
                </p>
              )}
            </div>

            {/* Informações Adicionais */}
            <div className="pt-8 border-t border-[#2A2A2A] space-y-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-[#D4AF37] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-white">Entrega expressa</p>
                  <p className="text-xs text-[#6B6B6B]">Envio em até 24h úteis</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-[#D4AF37] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-white">Compra segura</p>
                  <p className="text-xs text-[#6B6B6B]">Pagamento 100% protegido</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-[#D4AF37] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-white">Troca grátis</p>
                  <p className="text-xs text-[#6B6B6B]">30 dias para trocar</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ============================================
          PRODUTOS RELACIONADOS (opcional)
          ============================================ */}
      <section className="bg-[#141414] py-24">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-[var(--font-serif)] text-2xl md:text-3xl text-white mb-12 text-center">
            VOCÊ TAMBÉM PODE GOSTAR
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Aqui você pode adicionar produtos relacionados */}
            <p className="col-span-full text-center text-[#6B6B6B]">
              Produtos relacionados em breve...
            </p>
          </div>
        </div>
      </section>

      <Footer />

      {/* Toast de confirmação */}
      <div
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 px-6 py-4 bg-[#141414] border border-[#D4AF37]/40 shadow-2xl transition-all duration-300 whitespace-nowrap ${
          toastVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#D4AF37]/20">
          <svg className="w-4 h-4 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <p className="text-white text-sm font-medium">Adicionado ao carrinho!</p>
          <p className="text-[#6B6B6B] text-xs">{product?.name} — Tam. {selectedSize}</p>
        </div>
        <Link
          href="/carrinho"
          className="ml-2 text-[10px] text-[#D4AF37] font-black uppercase tracking-wider hover:underline"
        >
          Ver carrinho →
        </Link>
      </div>
    </div>
  );
}