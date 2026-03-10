'use client';

import { useState, useEffect } from 'react';
import { db, storage } from '@/src/services/firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { Product } from '@/src/types/product';

type ProductListProps = {
  onEdit?: (product: Product) => void;
};

export default function ProductList({ onEdit }: ProductListProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'havaianas' | 'roupas'>('all');

  // Buscar produtos do Firestore
  const fetchProducts = async () => {
    try {
      const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[];
      setProducts(list);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Excluir produto (com confirmação)
  const handleDelete = async (id: string, imageUrl: string) => {
    if (!confirm('Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.')) {
      return;
    }

    try {
      // 1. Deletar imagem do Storage
      if (imageUrl) {
        const imageRef = ref(storage, imageUrl);
        await deleteObject(imageRef).catch(() => console.log('Imagem não encontrada no storage'));
      }
      
      // 2. Deletar documento do Firestore
      await deleteDoc(doc(db, 'products', id));
      
      // 3. Atualizar lista localmente
      setProducts(prev => prev.filter(p => p.id !== id));
      alert('Produto excluído com sucesso.');
    } catch (error) {
      console.error('Erro ao excluir:', error);
      alert('Erro ao excluir produto.');
    }
  };

  // Alternar status ativo/inativo
  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, 'products', id), {
        active: !currentStatus
      });
      setProducts(prev => prev.map(p => 
        p.id === id ? { ...p, active: !currentStatus } : p
      ));
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  // Filtrar produtos
  const filteredProducts = filter === 'all' 
    ? products 
    : products.filter(p => p.category === filter);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-6 h-6 border-2 border-[var(--accent-gold)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="mt-12">
      
      {/* Header da Lista */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-neutral-200">
        <h3 className="text-lg font-serif text-black">Produtos Cadastrados</h3>
        
        {/* Filtros */}
        <div className="flex gap-2">
          {(['all', 'havaianas', 'roupas'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-wider rounded transition-all ${
                filter === cat
                  ? 'bg-[var(--accent-gold)] text-black'
                  : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
              }`}
            >
              {cat === 'all' ? 'Todos' : cat === 'havaianas' ? 'Havaianas' : 'Roupas'}
            </button>
          ))}
        </div>
      </div>

      {/* Tabela de Produtos */}
      <div className="overflow-x-auto rounded-sm border border-neutral-200">
        <table className="w-full text-left">
          <thead className="bg-neutral-50">
            <tr>
              <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-neutral-400">Produto</th>
              <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-neutral-400 hidden sm:table-cell">Categoria</th>
              <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-neutral-400">Preço</th>
              <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-neutral-400 hidden md:table-cell">Estoque</th>
              <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-neutral-400">Status</th>
              <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-neutral-400 text-right">Ações</th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-neutral-100">
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-neutral-400">
                  Nenhum produto encontrado.
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-neutral-50 transition-colors">
                  
                  {/* Nome + Imagem */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      {product.imageUrl && (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-sm border border-neutral-200"
                        />
                      )}
                      <span className="font-medium text-sm text-black">{product.name}</span>
                    </div>
                  </td>
                  
                  {/* Categoria */}
                  <td className="px-4 py-4 hidden sm:table-cell">
                    <span className="text-xs text-neutral-500 capitalize">
                      {product.category === 'havaianas' ? 'Havaianas' : 'Roupas'}
                    </span>
                  </td>
                  
                  {/* Preço */}
                  <td className="px-4 py-4">
                    <span className="font-bold text-black">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                    </span>
                  </td>
                  
                  {/* Estoque Total */}
                  <td className="px-4 py-4 hidden md:table-cell">
                    <span className="text-sm text-neutral-600">
                      {Object.values(product.sizes || {}).reduce((a, b) => a + b, 0)} un
                    </span>
                  </td>
                  
                  {/* Status Toggle */}
                  <td className="px-4 py-4">
                    <button
                      onClick={() => toggleActive(product.id, product.active)}
                      className={`px-2 py-1 text-[10px] font-black uppercase tracking-wider rounded ${
                        product.active
                          ? 'bg-green-100 text-green-700'
                          : 'bg-neutral-100 text-neutral-400'
                      }`}
                    >
                      {product.active ? 'Ativo' : 'Inativo'}
                    </button>
                  </td>
                  
                  {/* Ações */}
                  <td className="px-4 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(product)}
                          className="text-[10px] font-black uppercase tracking-wider text-[var(--accent-blue)] hover:underline"
                        >
                          Editar
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(product.id, product.imageUrl)}
                        className="text-[10px] font-black uppercase tracking-wider text-red-500 hover:underline"
                      >
                        Excluir
                        </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Rodapé da Tabela */}
      <div className="mt-4 flex justify-between items-center text-[10px] text-neutral-400 uppercase tracking-wider">
        <span>{filteredProducts.length} produto(s)</span>
        <button
          onClick={fetchProducts}
          className="hover:text-[var(--accent-gold)] transition-colors"
        >
          Atualizar lista
        </button>
      </div>
    </div>
  );
}