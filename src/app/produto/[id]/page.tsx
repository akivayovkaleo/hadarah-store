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

export default function ProdutoPage() {
  const params = useParams();
  const productId = params.id as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

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

  // Adicionar ao carrinho (simulação)
  const handleAddToCart = async () => {
    if (!selectedSize) {
      alert('Por favor, selecione um tamanho.');
      return;
    }

    setIsAdding(true);
    
    // Simulação de adição ao carrinho
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    alert(`Produto adicionado ao carrinho!\n\n${product?.name}\nTamanho: ${selectedSize}\nQuantidade: ${quantity}`);
    
    setIsAdding(false);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F0F0F]">
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 py-20">
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

  // Calcular estoque total
  const totalStock = Object.values(product.sizes || {}).reduce((a, b) => a + b, 0);
  const availableSizes = Object.entries(product.sizes || {})
    .filter(([_, qty]) => qty > 0)
    .map(([size]) => size);

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
      <main className="max-w-7xl mx-auto px-6 py-12">
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
            {availableSizes.length > 0 && (
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
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`
                        py-3 px-4 border text-sm font-medium transition-all duration-300
                        ${
                          selectedSize === size
                            ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]'
                            : 'border-[#2A2A2A] text-[#A3A3A3] hover:border-[#D4AF37]/50 hover:text-white'
                        }
                      `}
                    >
                      {size}
                    </button>
                  ))}
                </div>

                {totalStock < 10 && totalStock > 0 && (
                  <p className="mt-3 text-sm text-orange-400">
                    ⚡ Apenas {totalStock} unidades disponíveis
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
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 border border-[#2A2A2A] flex items-center justify-center text-white hover:border-[#D4AF37] transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Botão Adicionar ao Carrinho */}
            <div className="space-y-4">
              <button
                onClick={handleAddToCart}
                disabled={isAdding || availableSizes.length === 0}
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

              {availableSizes.length === 0 && (
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
      <section className="bg-[#141414] py-20">
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
    </div>
  );
}