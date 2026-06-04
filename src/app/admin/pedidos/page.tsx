'use client';

import { useState, useEffect } from 'react';
import {
  collection, getDocs, orderBy, query, where,
} from 'firebase/firestore';
import { db } from '@/src/services/firebase';

type OrderStatus = 'pending' | 'paid' | 'failed' | 'cancelled';

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
  size?: string;
}

interface Order {
  id: string;
  customer: { name: string; email: string; phone?: string };
  address?: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  items: OrderItem[];
  total: number;
  paymentMethod: string;
  status: OrderStatus;
  createdAt: string;
}

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pendente',
  paid: 'Pago',
  failed: 'Falhou',
  cancelled: 'Cancelado',
};

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: 'bg-amber-50 text-amber-700',
  paid: 'bg-emerald-50 text-emerald-700',
  failed: 'bg-red-50 text-red-700',
  cancelled: 'bg-[#F0EDE8] text-[#6B6B6B]',
};

const FILTERS: { label: string; value: OrderStatus | 'all' }[] = [
  { label: 'Todos', value: 'all' },
  { label: 'Pendente', value: 'pending' },
  { label: 'Pago', value: 'paid' },
  { label: 'Falhou', value: 'failed' },
  { label: 'Cancelado', value: 'cancelled' },
];

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateStr;
  }
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

export default function AdminPedidos() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all');
  const [selected, setSelected] = useState<Order | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const q = filter === 'all'
          ? query(collection(db, 'orders'), orderBy('createdAt', 'desc'))
          : query(
              collection(db, 'orders'),
              where('status', '==', filter),
              orderBy('createdAt', 'desc')
            );
        const snap = await getDocs(q);
        setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Order[]);
      } catch (err) {
        console.error('Erro ao buscar pedidos:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [filter]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-xl font-bold text-[#1A1A1A] uppercase tracking-wider">Pedidos</h1>
        <p className="text-sm text-[#6B6B6B] mt-0.5">{orders.length} pedidos encontrados</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-6 border-b border-[#E8E4DF]">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.2em] transition-all -mb-px border-b-2 ${
              filter === f.value
                ? 'border-[#C8A882] text-[#1A1A1A]'
                : 'border-transparent text-[#6B6B6B] hover:text-[#1A1A1A]'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border border-[#E8E4DF] overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-7 h-7 border-2 border-[#C8A882] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 text-[#6B6B6B] text-sm">
            Nenhum pedido encontrado para este filtro.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E8E4DF] bg-[#FAFAF8]">
                  <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-[0.25em] text-[#6B6B6B]">ID</th>
                  <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-[0.25em] text-[#6B6B6B]">Cliente</th>
                  <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-[0.25em] text-[#6B6B6B]">Total</th>
                  <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-[0.25em] text-[#6B6B6B]">Pagamento</th>
                  <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-[0.25em] text-[#6B6B6B]">Status</th>
                  <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-[0.25em] text-[#6B6B6B]">Data</th>
                  <th className="text-right px-4 py-3 text-[10px] font-bold uppercase tracking-[0.25em] text-[#6B6B6B]">Detalhes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E4DF]">
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-[#FAFAF8] transition-colors"
                  >
                    <td className="px-4 py-3 font-mono text-[11px] text-[#6B6B6B]">
                      #{order.id.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-[#1A1A1A]">{order.customer?.name ?? '—'}</p>
                      <p className="text-[11px] text-[#6B6B6B]">{order.customer?.email ?? ''}</p>
                    </td>
                    <td className="px-4 py-3 font-medium text-[#1A1A1A]">
                      {formatCurrency(order.total ?? 0)}
                    </td>
                    <td className="px-4 py-3 text-[#6B6B6B] capitalize text-sm">
                      {order.paymentMethod ?? '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                          STATUS_STYLES[order.status] ?? 'bg-[#F0EDE8] text-[#6B6B6B]'
                        }`}
                      >
                        {STATUS_LABELS[order.status] ?? order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[11px] text-[#6B6B6B]">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setSelected(order)}
                        className="text-[11px] font-medium text-[#C8A882] hover:text-[#1A1A1A] uppercase tracking-wide transition-colors"
                      >
                        Ver
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8 overflow-y-auto">
          <div className="bg-white w-full max-w-lg shadow-2xl my-auto">
            <div className="bg-[#1A1A1A] px-8 py-5 flex items-center justify-between">
              <h2
                className="text-white text-lg font-light"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                Pedido #{selected.id.slice(-8).toUpperCase()}
              </h2>
              <button
                onClick={() => setSelected(null)}
                className="text-white/50 hover:text-white text-xl leading-none transition-colors"
              >
                ×
              </button>
            </div>

            <div className="p-8 space-y-6">
              {/* Status */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#6B6B6B]">Status</span>
                <span
                  className={`px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${
                    STATUS_STYLES[selected.status] ?? 'bg-[#F0EDE8] text-[#6B6B6B]'
                  }`}
                >
                  {STATUS_LABELS[selected.status] ?? selected.status}
                </span>
              </div>

              {/* Customer */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#6B6B6B] mb-2">Cliente</p>
                <p className="text-sm text-[#1A1A1A] font-medium">{selected.customer?.name ?? '—'}</p>
                <p className="text-sm text-[#6B6B6B]">{selected.customer?.email ?? ''}</p>
                {selected.customer?.phone && (
                  <p className="text-sm text-[#6B6B6B]">{selected.customer.phone}</p>
                )}
              </div>

              {/* Address */}
              {selected.address && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#6B6B6B] mb-2">Endereço</p>
                  <p className="text-sm text-[#1A1A1A]">
                    {selected.address.street}, {selected.address.number}
                    {selected.address.complement ? ` — ${selected.address.complement}` : ''}
                  </p>
                  <p className="text-sm text-[#6B6B6B]">
                    {selected.address.neighborhood}, {selected.address.city} — {selected.address.state}
                  </p>
                  <p className="text-sm text-[#6B6B6B]">CEP: {selected.address.zipCode}</p>
                </div>
              )}

              {/* Items */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#6B6B6B] mb-3">Itens</p>
                <div className="space-y-2">
                  {(selected.items ?? []).map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="text-[#1A1A1A]">
                        {item.name}
                        {item.size ? ` (${item.size})` : ''} × {item.quantity}
                      </span>
                      <span className="text-[#6B6B6B]">{formatCurrency(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-[#E8E4DF] mt-3 pt-3 flex items-center justify-between font-bold text-sm">
                  <span className="text-[#1A1A1A]">Total</span>
                  <span className="text-[#1A1A1A]">{formatCurrency(selected.total ?? 0)}</span>
                </div>
              </div>

              {/* Payment & date */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#6B6B6B] mb-1">Pagamento</p>
                  <p className="text-[#1A1A1A] capitalize">{selected.paymentMethod ?? '—'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#6B6B6B] mb-1">Data</p>
                  <p className="text-[#1A1A1A]">{formatDate(selected.createdAt)}</p>
                </div>
              </div>

              <button
                onClick={() => setSelected(null)}
                className="w-full border border-[#E8E4DF] text-[#6B6B6B] py-3 text-[11px] font-bold uppercase tracking-[0.3em] hover:border-[#1A1A1A] hover:text-[#1A1A1A] transition-all"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
