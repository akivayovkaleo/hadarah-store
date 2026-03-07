'use client';
import { useEffect, useState } from 'react';
import { db } from '@/src/services/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Product } from '@/src/types/product';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const q = query(collection(db, 'products'), where('active', '==', true));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        setProducts(data);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <main className="min-h-screen">
      
      {/* 7️⃣ HERO SECTION - ESPAÇAMENTO E HIERARQUIA */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        
        {/* 1️⃣ Texto Gigante de Fundo (Ajustado) */}
        <div className="absolute inset-0 flex items-center justify-center z-0">
          <h1 className="background-text italic">HADARAH</h1>
        </div>

        <div className="z-10 reveal">
          {/* 4️⃣ Hierarquia de Texto */}
          <p className="text-[var(--gold-lannister)] text-[10px] md:text-xs font-bold tracking-[1.2em] uppercase mb-4 opacity-80">
            ESSÊNCIA • ELEGÂNCIA
          </p>
          
          <h2 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter text-white mb-2 leading-none">
            HADARAH
          </h2>
          
          <h3 className="text-lg md:text-xl font-light tracking-[0.3em] uppercase text-white/60">
            Adornada com <span className="text-[var(--gold-lannister)] italic">beleza</span>
          </h3>

          <div className="mt-16">
            <button className="btn-hadarah">
              Explorar Drop
            </button>
          </div>
        </div>
      </section>

      {/* VITRINE - ESTILO BOUTIQUE */}
      <section className="max-w-6xl mx-auto py-32 px-6 z-10 relative">
        <div className="flex flex-col items-center mb-24 reveal">
          <h2 className="text-sm font-bold uppercase tracking-[0.5em] text-[var(--gold-lannister)] mb-4">Coleções Atemporais</h2>
          <div className="w-16 h-[1px] bg-[var(--gold-lannister)]/50"></div>
        </div>

        {loading ? (
          <div className="text-center italic opacity-50 tracking-widest">Carregando Hadarah Store...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
            {products.map((product, index) => (
              <div 
                key={product.id} 
                className="group cursor-pointer reveal"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-black/40">
                  <img 
                    src={product.imageUrl} 
                    className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 group-hover:opacity-60" 
                  />
                  {/* Overlay de Ouro no Hover */}
                  <div className="absolute inset-0 border-[0.5px] border-white/10 group-hover:border-[var(--gold-lannister)] transition-all duration-700"></div>
                </div>
                <div className="mt-8 text-center">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-2 group-hover:text-[var(--gold-lannister)] transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-lg font-light italic text-white/40">R$ {product.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <footer className="py-20 text-center opacity-20 hover:opacity-100 transition-opacity duration-1000">
        <p className="text-[9px] tracking-[1em] uppercase">Florianópolis • Blumenau • Brasil</p>
      </footer>
    </main>
  );
}