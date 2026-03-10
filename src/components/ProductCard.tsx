'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/src/types/product';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePosition({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
  };

  return (
    <Link href={`/produto/${product.id}`}>
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="group relative cursor-pointer"
        style={{
          transform: `
            perspective(1000px)
            rotateY(${mousePosition.x * 5}deg)
            rotateX(${-mousePosition.y * 5}deg)
            scale(${1 + Math.sqrt(mousePosition.x ** 2 + mousePosition.y ** 2) * 0.02})
          `,
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Imagem com Overlay Gradual */}
        <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-neutral-100">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 50vw, 33vw"
            priority={false}
            loading="lazy"
          />
          
          {/* Overlay que aparece no hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
          
          {/* Badge de Categoria */}
          <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
            <span className="bg-white/90 backdrop-blur-sm text-black text-[10px] font-black uppercase tracking-widest px-3 py-1.5">
              {product.category === 'havaianas' ? 'Havaianas' : 'Coleção'}
            </span>
          </div>

          {/* Botão "Ver Produto" */}
          <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
            <button className="w-full bg-white text-black text-xs font-bold uppercase tracking-[0.2em] py-3 hover:bg-[var(--accent-gold)] transition-colors">
              Ver Produto
            </button>
          </div>
        </div>

        {/* Informações do Produto */}
        <div className="mt-4 space-y-1">
          <h3 className="text-sm font-medium text-black group-hover:text-[var(--accent-gold)] transition-colors duration-300">
            {product.name}
          </h3>
          <p className="text-xs text-neutral-500">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
          </p>
        </div>
      </div>
    </Link>
  );
}