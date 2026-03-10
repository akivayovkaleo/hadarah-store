'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '@/src/services/firebase';
import { Product } from '@/src/types/product';

// Componente interno: Skeleton de carregamento elegante
function ProductSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[3/4] bg-[var(--card-bg)] rounded-sm" />
      <div className="mt-4 space-y-2">
        <div className="h-4 bg-[var(--border-color)] rounded w-3/4" />
        <div className="h-3 bg-[var(--border-color)] rounded w-1/2" />
      </div>
    </div>
  );
}

// Componente interno: Card de Produto com Hover Magnético
function LuxuryProductCard({ product }: { product: Product }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  return (
    <Link href={`/produto/${product.id}`}>
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setMousePos({ x: 0, y: 0 })}
        className="group relative cursor-none md:cursor-none"
        style={{
          transform: `
            perspective(1000px)
            rotateY(${mousePos.x * 4}deg)
            rotateX(${-mousePos.y * 4}deg)
            scale(${1 + Math.sqrt(mousePos.x ** 2 + mousePos.y ** 2) * 0.03})
          `,
          transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Container da Imagem */}
        <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-[var(--card-bg)] shadow-lg">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 50vw, 33vw"
            loading="lazy"
            priority={false}
          />
          
          {/* Overlay Gradual */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
          
          {/* Badge de Categoria */}
          <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-75 translate-y-2 group-hover:translate-y-0">
            <span className="bg-[var(--accent-gold)] text-black text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5">
              {product.category === 'havaianas' ? 'Havaianas' : 'Coleção'}
            </span>
          </div>

          {/* Botão "Ver Produto" */}
          <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out">
            <button className="w-full bg-white/95 backdrop-blur-sm text-black text-[10px] font-black uppercase tracking-[0.25em] py-3.5 hover:bg-[var(--accent-gold)] transition-colors duration-300">
              Ver Produto
            </button>
          </div>

          {/* Brilho Dourado no Hover */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[var(--accent-gold)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
        </div>

        {/* Informações */}
        <div className="mt-5 space-y-1.5">
          <h3 className="text-sm font-[var(--font-serif)] font-light text-white group-hover:text-[var(--accent-gold)] transition-colors duration-300">
            {product.name}
          </h3>
          <p className="text-xs text-[var(--text-secondary)] font-medium">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Buscar produtos ativos do Firebase
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const q = query(
          collection(db, 'products'),
          where('active', '==', true),
          orderBy('createdAt', 'desc'),
          limit(6)
        );
        const snapshot = await getDocs(q);
        const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[];
        setProducts(list);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedProducts();
  }, []);

  // Handle newsletter signup
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setNewsletterStatus('error');
      return;
    }
    // Aqui você integraria com seu backend/Firebase
    setNewsletterStatus('success');
    setEmail('');
    setTimeout(() => setNewsletterStatus('idle'), 4000);
  };

  return (
    <main className="min-h-screen">
      
      {/* ============================================
          HERO SECTION - Impacto Visual Imediato
          ============================================ */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        
        {/* Background com Imagem/Vídeo */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=2070"
            alt="Hadarah Store - Luxo e Elegância"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          {/* Overlay Escuro Elegante */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-[var(--primary-bg)]" />
        </div>

        {/* Conteúdo Central */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto animate-fade-in">
          
          {/* Slogan Superior */}
          <p className="text-[var(--accent-gold)] text-[10px] font-black uppercase tracking-[0.4em] mb-6 opacity-0 animate-[fadeIn_1s_ease-out_0.3s_forwards]">
            Adornada com beleza
          </p>
          
          {/* Título Principal */}
          <h1 className="font-[var(--font-serif)] text-5xl md:text-7xl lg:text-8xl font-light text-white mb-8 leading-tight opacity-0 animate-[fadeIn_1s_ease-out_0.5s_forwards]">
            HADARAH
            <span className="block text-[var(--accent-gold)] font-bold text-4xl md:text-6xl lg:text-7xl mt-2 not-italic">
              Store
            </span>
          </h1>
          
          {/* Descrição */}
          <p className="text-[var(--text-secondary)] text-sm md:text-base max-w-xl mx-auto mb-10 opacity-0 animate-[fadeIn_1s_ease-out_0.7s_forwards]">
            Peças exclusivas para quem entende que luxo é uma forma de expressão. 
            Roupas de elite, joias artesanais e havaianas premium.
          </p>
          
          {/* Botões de Ação */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center opacity-0 animate-[fadeIn_1s_ease-out_0.9s_forwards]">
            <Link href="#colecao" className="btn-primary">
              Explorar Coleção
            </Link>
            <Link href="#sobre" className="btn-secondary">
              Nossa História
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-[var(--accent-gold)]/60 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-[var(--accent-gold)] rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>


      {/* ============================================
          VITRINE DE PRODUTOS - Grid Elegante
          ============================================ */}
      <section id="colecao" className="py-24 px-6 bg-[var(--primary-bg)]">
        <div className="max-w-7xl mx-auto">
          
          {/* Header da Seção */}
          <div className="text-center mb-16">
            <p className="text-[var(--accent-gold)] text-[10px] font-black uppercase tracking-[0.3em] mb-4">
              Coleção Exclusiva
            </p>
            <h2 className="font-[var(--font-serif)] text-3xl md:text-4xl font-light text-white">
              Peças Selecionadas
            </h2>
            <div className="w-24 h-px bg-[var(--accent-gold)] mx-auto mt-6" />
          </div>

          {/* Grid de Produtos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => <ProductSkeleton key={i} />)
              : products.map((product) => (
                  <LuxuryProductCard key={product.id} product={product} />
                ))}
          </div>

          {/* Botão Ver Mais */}
          {!loading && products.length > 0 && (
            <div className="text-center mt-16">
              <Link href="/colecao" className="btn-secondary inline-flex items-center gap-2">
                Ver Coleção Completa
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          )}

          {/* Estado Vazio */}
          {!loading && products.length === 0 && (
            <div className="text-center py-16">
              <p className="text-[var(--text-muted)] text-sm">
                Nossa coleção está sendo renovada. Volte em breve.
              </p>
            </div>
          )}
        </div>
      </section>


      {/* ============================================
          SOBRE A HADARAH - Storytelling de Luxo
          ============================================ */}
      <section id="sobre" className="py-24 px-6 bg-[var(--secondary-bg)]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Imagem com Efeito */}
          <div className="relative aspect-[4/5] lg:aspect-square overflow-hidden rounded-sm group">
            <Image
              src="https://images.unsplash.com/photo-1550614000-4b9519e02a48?auto=format&fit=crop&q=80&w=1974"
              alt="Ateliê Hadarah - Artesanato de Luxo"
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 50vw"
              loading="lazy"
            />
            <div className="absolute inset-0 border-2 border-[var(--accent-gold)]/30 m-4 pointer-events-none" />
          </div>

          {/* Conteúdo */}
          <div className="space-y-8">
            <div>
              <p className="text-[var(--accent-gold)] text-[10px] font-black uppercase tracking-[0.3em] mb-4">
                Nossa Essência
              </p>
              <h2 className="font-[var(--font-serif)] text-3xl md:text-4xl font-light text-white mb-6">
                Mais que uma marca, <br />
                <span className="text-[var(--accent-gold)] font-bold not-italic">uma declaração</span>
              </h2>
            </div>
            
            <div className="space-y-4 text-[var(--text-secondary)] text-sm leading-relaxed">
              <p>
                A Hadarah nasceu do desejo de transformar o vestir em arte. Cada peça é cuidadosamente 
                selecionada ou desenvolvida em parceria com artesãos que compartilham nossa visão: 
                luxo não é sobre ostentação, é sobre essência.
              </p>
              <p>
                Nossas havaianas premium são feitas com materiais sustentáveis e detalhes em ouro 18k. 
                Nossas roupas seguem cortes atemporais que valorizam a silhueta sem sacrificar o conforto.
              </p>
            </div>

            {/* Stats Elegantes */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-[var(--border-color)]">
              <div>
                <p className="text-2xl font-[var(--font-serif)] text-white">100+</p>
                <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">Peças Exclusivas</p>
              </div>
              <div>
                <p className="text-2xl font-[var(--font-serif)] text-white">18k</p>
                <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">Detalhes em Ouro</p>
              </div>
              <div>
                <p className="text-2xl font-[var(--font-serif)] text-white">∞</p>
                <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">Elegância</p>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ============================================
          NEWSLETTER - Captura de Leads Elegante
          ============================================ */}
      <section className="py-24 px-6 bg-[var(--primary-bg)]">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-[var(--accent-gold)] text-[10px] font-black uppercase tracking-[0.3em] mb-4">
            Exclusividade em Primeiro Lugar
          </p>
          <h3 className="font-[var(--font-serif)] text-2xl md:text-3xl font-light text-white mb-6">
            Seja o primeiro a saber das novas coleções
          </h3>
          <p className="text-[var(--text-secondary)] text-sm mb-8 max-w-md mx-auto">
            Assine nossa newsletter e receba acesso antecipado a lançamentos, 
            eventos privados e conteúdos exclusivos.
          </p>

          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Seu e-mail"
              className="input-luxury flex-1 text-center sm:text-left"
              required
            />
            <button type="submit" className="btn-primary whitespace-nowrap">
              Assinar
            </button>
          </form>

          {/* Feedback */}
          {newsletterStatus === 'success' && (
            <p className="mt-4 text-[var(--accent-gold)] text-sm animate-fade-in">
              ✓ Bem-vindo à família Hadarah.
            </p>
          )}
          {newsletterStatus === 'error' && (
            <p className="mt-4 text-red-400 text-sm animate-fade-in">
              Por favor, insira um e-mail válido.
            </p>
          )}
        </div>
      </section>


      {/* ============================================
          FOOTER - Estrutura Elegante e Funcional
          ============================================ */}
      <footer className="bg-[var(--secondary-bg)] border-t border-[var(--border-color)]">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            
            {/* Brand */}
            <div className="md:col-span-2">
              <h4 className="font-[var(--font-serif)] text-2xl text-white mb-4">
                HADARAH<span className="text-[var(--accent-gold)]">.</span>
              </h4>
              <p className="text-[var(--text-secondary)] text-sm max-w-sm mb-6">
                Adornada com beleza. Peças exclusivas para quem entende que 
                luxo é uma forma de expressão.
              </p>
              <div className="flex gap-4">
                {['Instagram', 'Pinterest', 'WhatsApp'].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="text-[var(--text-muted)] hover:text-[var(--accent-gold)] transition-colors text-sm uppercase tracking-wider"
                  >
                    {social}
                  </a>
                ))}
              </div>
            </div>

            {/* Links */}
            <div>
              <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--accent-gold)] mb-4">
                Navegação
              </h5>
              <ul className="space-y-3 text-sm">
                {['Home', 'Coleção', 'Sobre', 'Contato'].map((link) => (
                  <li key={link}>
                    <a href={`#${link.toLowerCase()}`} className="text-[var(--text-secondary)] hover:text-white transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--accent-gold)] mb-4">
                Legal
              </h5>
              <ul className="space-y-3 text-sm">
                {['Privacidade', 'Termos', 'Entregas', 'Trocas'].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-[var(--text-secondary)] hover:text-white transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-16 pt-8 border-t border-[var(--border-color)] flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
              © {new Date().getFullYear()} Hadarah Store. Todos os direitos reservados.
            </p>
            <p className="text-[10px] text-[var(--text-muted)]">
              Desenvolvido com <span className="text-[var(--accent-gold)]">◆</span> para a excelência
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}