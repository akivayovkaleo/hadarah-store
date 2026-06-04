'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { collection, getDocs, where, query } from 'firebase/firestore';
import { db } from '@/src/services/firebase';

interface Stats {
  totalProducts: number;
  activeProducts: number;
  totalOrders: number;
  paidOrders: number;
  pendingOrders: number;
  activeBanners: number;
}

const QUICK_LINKS = [
  { label: 'Gerenciar Produtos', href: '/admin/produtos', desc: 'Adicione, edite ou remova produtos da vitrine' },
  { label: 'Gerenciar Banners', href: '/admin/banners', desc: 'Configure o hero slideshow da home' },
  { label: 'Pedidos', href: '/admin/pedidos', desc: 'Veja e gerencie os pedidos recebidos' },
  { label: 'Aparência', href: '/admin/aparencia', desc: 'Personalize cores e identidade visual' },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productsSnap, activeProductsSnap, ordersSnap, paidSnap, pendingSnap, bannersSnap] = await Promise.all([
          getDocs(collection(db, 'products')),
          getDocs(query(collection(db, 'products'), where('active', '==', true))),
          getDocs(collection(db, 'orders')),
          getDocs(query(collection(db, 'orders'), where('status', '==', 'paid'))),
          getDocs(query(collection(db, 'orders'), where('status', '==', 'pending'))),
          getDocs(query(collection(db, 'banners'), where('active', '==', true))),
        ]);

        setStats({
          totalProducts: productsSnap.size,
          activeProducts: activeProductsSnap.size,
          totalOrders: ordersSnap.size,
          paidOrders: paidSnap.size,
          pendingOrders: pendingSnap.size,
          activeBanners: bannersSnap.size,
        });
      } catch (err) {
        console.error('Erro ao buscar estatísticas:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = stats
    ? [
        { label: 'Produtos Ativos', value: stats.activeProducts, sub: `${stats.totalProducts} total` },
        { label: 'Pedidos Pagos', value: stats.paidOrders, sub: `${stats.pendingOrders} pendentes` },
        { label: 'Total de Pedidos', value: stats.totalOrders, sub: 'no banco de dados' },
        { label: 'Banners Ativos', value: stats.activeBanners, sub: 'exibidos no hero' },
      ]
    : [];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-xl font-bold text-[#1A1A1A] uppercase tracking-wider">Dashboard</h1>
        <p className="text-sm text-[#6B6B6B] mt-0.5">Visão geral da loja</p>
      </div>

      {/* Stats */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white border border-[#E8E4DF] p-5 animate-pulse">
              <div className="h-3 w-24 bg-[#E8E4DF] rounded mb-3" />
              <div className="h-8 w-12 bg-[#E8E4DF] rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {statCards.map((s) => (
            <div key={s.label} className="bg-white border border-[#E8E4DF] p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#6B6B6B] mb-2">{s.label}</p>
              <p
                className="text-4xl font-black text-[#1A1A1A] leading-none"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                {s.value}
              </p>
              <p className="text-[11px] text-[#6B6B6B] mt-1">{s.sub}</p>
            </div>
          ))}
        </div>
      )}

      {/* Quick links */}
      <div>
        <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#6B6B6B] mb-4">Acesso Rápido</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {QUICK_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="bg-white border border-[#E8E4DF] p-5 hover:border-[#C8A882] transition-all group block"
            >
              <p className="font-bold text-sm text-[#1A1A1A] group-hover:text-[#C8A882] transition-colors uppercase tracking-wide">
                {link.label}
              </p>
              <p className="text-[12px] text-[#6B6B6B] mt-1">{link.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
