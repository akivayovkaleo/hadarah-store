'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/src/components/Navbar';
import Footer from '@/src/components/Footer';

// gera um número de pedido aleatório
function generateOrderNumber() {
  return Math.random().toString(36).substr(2, 9).toUpperCase();
}

// Tipo do item do carrinho
interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
}

export default function CheckoutPage() {
  const [step, setStep] = useState<'cart' | 'shipping' | 'payment' | 'confirmation'>('shipping');
  const [loading, setLoading] = useState(false);

  // gerar número de pedido quando chegamos à etapa de confirmação
  const [orderNumber, setOrderNumber] = useState('');
  useEffect(() => {
    if (step === 'confirmation') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOrderNumber(generateOrderNumber());
    }
  }, [step]);

  // Dados do formulário
  const [formData, setFormData] = useState({
    // Dados Pessoais
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    cpf: '',
    
    // Endereço
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
    
    // Pagamento
    paymentMethod: 'credit',
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCVV: '',
    installments: '1',
    
    // Entrega
    shippingMethod: 'standard',
  });

  // Dados do carrinho (simulado)
  const cartItems: CartItem[] = [
    {
      id: '1',
      name: 'Havaiana Signature Gold',
      price: 299.90,
      image: 'https://images.unsplash.com/photo-1603487742131-4160d6986ba2?auto=format&fit=crop&q=80&w=800',
      size: '39-40',
      quantity: 1,
    },
    {
      id: '2',
      name: 'Vestido Longo Elegance',
      price: 899.90,
      image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800',
      size: 'M',
      quantity: 1,
    },
  ];

  // Calcular totais
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = formData.shippingMethod === 'express' ? 49.90 : 29.90;
  const total = subtotal + shipping;

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Máscaras simples
    let formattedValue = value;
    if (name === 'cpf') {
      formattedValue = value.replace(/\D/g, '').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    if (name === 'zipCode') {
      formattedValue = value.replace(/\D/g, '').replace(/(\d{5})(\d)/, '$1-$2');
    }
    if (name === 'cardNumber') {
      formattedValue = value.replace(/\D/g, '').replace(/(\d{4})(\d)/, '$1 $2').replace(/(\d{4})(\d)/, '$1 $2').replace(/(\d{4})(\d)/, '$1 $2');
    }
    if (name === 'cardExpiry') {
      formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
    }
    if (name === 'cardCVV') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    }

    setFormData({ ...formData, [name]: formattedValue });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulação de processamento
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Em produção: enviar para Firebase/Stripe/PagSeguro
    console.log('Pedido enviado:', formData);

    setLoading(false);
    setStep('confirmation');
  };

  // Página de Confirmação
  if (step === 'confirmation') {
    
    return (
      <div className="min-h-screen bg-[#0F0F0F]">
        <Navbar />
        <main className="max-w-3xl mx-auto px-6 py-20">
          <div className="text-center py-12">
            {/* Ícone de Sucesso */}
            <div className="w-20 h-20 mx-auto mb-8 bg-[#D4AF37]/20 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h1 className="font-[var(--font-serif)] text-3xl md:text-4xl font-light text-white mb-4">
              Pedido Confirmado!
            </h1>
            <p className="text-[#A3A3A3] text-sm mb-2">
              Número do pedido: <span className="text-[#D4AF37] font-bold">{orderNumber}</span>
            </p>
            <p className="text-[#A3A3A3] text-sm mb-8 max-w-md mx-auto">
              Enviamos um e-mail de confirmação para <strong>{formData.email}</strong>. 
              Você receberá o código de rastreio em até 24h úteis.
            </p>

            <div className="p-6 bg-[#141414] border border-[#2A2A2A] rounded-sm mb-8">
              <h2 className="text-white font-medium mb-4 text-left">Resumo do Pedido</h2>
              <div className="space-y-3 text-sm text-left">
                <div className="flex justify-between">
                  <span className="text-[#A3A3A3]">Subtotal</span>
                  <span className="text-white">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A3A3A3]">Frete</span>
                  <span className="text-white">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(shipping)}
                  </span>
                </div>
                <div className="flex justify-between pt-4 border-t border-[#2A2A2A]">
                  <span className="text-[#D4AF37] font-bold">Total</span>
                  <span className="text-[#D4AF37] font-bold">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/colecao"
                className="
                  px-10 py-4
                  bg-[#D4AF37]
                  text-[#0F0F0F]
                  text-[11px] font-black uppercase tracking-[0.3em]
                  hover:bg-[#D4AF37]/90
                  transition-all duration-300
                "
              >
                Continuar Comprando
              </Link>
              <Link
                href="/pedidos"
                className="
                  px-10 py-4
                  border border-[#D4AF37]
                  text-[#D4AF37]
                  text-[11px] font-black uppercase tracking-[0.3em]
                  hover:bg-[#D4AF37] hover:text-[#0F0F0F]
                  transition-all duration-300
                "
              >
                Acompanhar Pedido
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F]">
      <Navbar />
      
      {/* ============================================
          HERO DA PÁGINA
          ============================================ */}
      <section className="relative h-[30vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[#0F0F0F]" />
        <div className="relative z-10 text-center px-6">
          <p className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.4em] mb-4">
            Finalizar Compra
          </p>
          <h1 className="font-[var(--font-serif)] text-4xl md:text-5xl font-light text-white">
            CHECKOUT
          </h1>
        </div>
      </section>

      {/* ============================================
          BARRA DE PROGRESSO
          ============================================ */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-center">
          {['Carrinho', 'Entrega', 'Pagamento', 'Confirmação'].map((label, index) => {
            const steps = ['cart', 'shipping', 'payment', 'confirmation'];
            const currentIndex = steps.indexOf(step);
            const isCompleted = index < currentIndex;
            const isCurrent = index === currentIndex;

            return (
              <div key={label} className="flex items-center">
                <div className="flex items-center">
                  <div
                    className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                      ${isCompleted ? 'bg-[#D4AF37] text-[#0F0F0F]' : isCurrent ? 'border-2 border-[#D4AF37] text-[#D4AF37]' : 'border-2 border-[#2A2A2A] text-[#6B6B6B]'}
                    `}
                  >
                    {isCompleted ? '✓' : index + 1}
                  </div>
                  <span className={`ml-2 text-sm hidden md:block ${isCurrent ? 'text-white' : 'text-[#6B6B6B]'}`}>
                    {label}
                  </span>
                </div>
                {index < 3 && (
                  <div className={`w-12 md:w-24 h-0.5 mx-4 ${isCompleted ? 'bg-[#D4AF37]' : 'bg-[#2A2A2A]'}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ============================================
          CONTEÚDO PRINCIPAL
          ============================================ */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* ============================================
                FORMULÁRIO PRINCIPAL
                ============================================ */}
            <div className="lg:col-span-2 space-y-12">
              
              {/* Dados Pessoais */}
              <section>
                <h2 className="font-[var(--font-serif)] text-xl font-light text-white mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 bg-[#D4AF37]/20 text-[#D4AF37] rounded-full flex items-center justify-center text-sm font-bold">1</span>
                  Dados Pessoais
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-[#141414] border border-[#2A2A2A] rounded-sm">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#A3A3A3] mb-2">Nome *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full bg-transparent border-b border-[#2A2A2A] py-3 px-0 text-white outline-none focus:border-[#D4AF37] transition-colors placeholder:text-[#6B6B6B]"
                      placeholder="Seu nome"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#A3A3A3] mb-2">Sobrenome *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full bg-transparent border-b border-[#2A2A2A] py-3 px-0 text-white outline-none focus:border-[#D4AF37] transition-colors placeholder:text-[#6B6B6B]"
                      placeholder="Seu sobrenome"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#A3A3A3] mb-2">E-mail *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full bg-transparent border-b border-[#2A2A2A] py-3 px-0 text-white outline-none focus:border-[#D4AF37] transition-colors placeholder:text-[#6B6B6B]"
                      placeholder="seu@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#A3A3A3] mb-2">Telefone *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full bg-transparent border-b border-[#2A2A2A] py-3 px-0 text-white outline-none focus:border-[#D4AF37] transition-colors placeholder:text-[#6B6B6B]"
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#A3A3A3] mb-2">CPF *</label>
                    <input
                      type="text"
                      name="cpf"
                      value={formData.cpf}
                      onChange={handleChange}
                      required
                      maxLength={14}
                      className="w-full bg-transparent border-b border-[#2A2A2A] py-3 px-0 text-white outline-none focus:border-[#D4AF37] transition-colors placeholder:text-[#6B6B6B]"
                      placeholder="000.000.000-00"
                    />
                  </div>
                </div>
              </section>

              {/* Endereço de Entrega */}
              <section>
                <h2 className="font-[var(--font-serif)] text-xl font-light text-white mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 bg-[#D4AF37]/20 text-[#D4AF37] rounded-full flex items-center justify-center text-sm font-bold">2</span>
                  Endereço de Entrega
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-[#141414] border border-[#2A2A2A] rounded-sm">
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#A3A3A3] mb-2">CEP *</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      required
                      maxLength={9}
                      className="w-full bg-transparent border-b border-[#2A2A2A] py-3 px-0 text-white outline-none focus:border-[#D4AF37] transition-colors placeholder:text-[#6B6B6B]"
                      placeholder="00000-000"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#A3A3A3] mb-2">Rua *</label>
                    <input
                      type="text"
                      name="street"
                      value={formData.street}
                      onChange={handleChange}
                      required
                      className="w-full bg-transparent border-b border-[#2A2A2A] py-3 px-0 text-white outline-none focus:border-[#D4AF37] transition-colors placeholder:text-[#6B6B6B]"
                      placeholder="Nome da rua"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#A3A3A3] mb-2">Número *</label>
                    <input
                      type="text"
                      name="number"
                      value={formData.number}
                      onChange={handleChange}
                      required
                      className="w-full bg-transparent border-b border-[#2A2A2A] py-3 px-0 text-white outline-none focus:border-[#D4AF37] transition-colors placeholder:text-[#6B6B6B]"
                      placeholder="123"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#A3A3A3] mb-2">Complemento</label>
                    <input
                      type="text"
                      name="complement"
                      value={formData.complement}
                      onChange={handleChange}
                      className="w-full bg-transparent border-b border-[#2A2A2A] py-3 px-0 text-white outline-none focus:border-[#D4AF37] transition-colors placeholder:text-[#6B6B6B]"
                      placeholder="Apto, Bloco..."
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#A3A3A3] mb-2">Bairro *</label>
                    <input
                      type="text"
                      name="neighborhood"
                      value={formData.neighborhood}
                      onChange={handleChange}
                      required
                      className="w-full bg-transparent border-b border-[#2A2A2A] py-3 px-0 text-white outline-none focus:border-[#D4AF37] transition-colors placeholder:text-[#6B6B6B]"
                      placeholder="Seu bairro"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#A3A3A3] mb-2">Cidade *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      className="w-full bg-transparent border-b border-[#2A2A2A] py-3 px-0 text-white outline-none focus:border-[#D4AF37] transition-colors placeholder:text-[#6B6B6B]"
                      placeholder="Sua cidade"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#A3A3A3] mb-2">Estado *</label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      required
                      className="w-full bg-transparent border-b border-[#2A2A2A] py-3 px-0 text-white outline-none focus:border-[#D4AF37] transition-colors"
                    >
                      <option value="" className="bg-[#0F0F0F]">Selecione</option>
                      <option value="SP" className="bg-[#0F0F0F]">São Paulo</option>
                      <option value="RJ" className="bg-[#0F0F0F]">Rio de Janeiro</option>
                      <option value="MG" className="bg-[#0F0F0F]">Minas Gerais</option>
                      {/* Adicione outros estados */}
                    </select>
                  </div>
                </div>
              </section>

              {/* Pagamento */}
              <section>
                <h2 className="font-[var(--font-serif)] text-xl font-light text-white mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 bg-[#D4AF37]/20 text-[#D4AF37] rounded-full flex items-center justify-center text-sm font-bold">3</span>
                  Pagamento
                </h2>
                <div className="p-6 bg-[#141414] border border-[#2A2A2A] rounded-sm space-y-6">
                  
                  {/* Método de Pagamento */}
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { id: 'credit', label: 'Cartão de Crédito', icon: '💳' },
                      { id: 'pix', label: 'PIX', icon: '💠' },
                      { id: 'boleto', label: 'Boleto', icon: '📄' },
                    ].map((method) => (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, paymentMethod: method.id })}
                        className={`
                          p-4 border rounded-sm text-center transition-all
                          ${formData.paymentMethod === method.id ? 'border-[#D4AF37] bg-[#D4AF37]/10' : 'border-[#2A2A2A] hover:border-[#D4AF37]/50'}
                        `}
                      >
                        <span className="text-2xl mb-2 block">{method.icon}</span>
                        <span className="text-[10px] font-black uppercase tracking-[0.15em] text-white">{method.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Dados do Cartão (apenas se crédito selecionado) */}
                  {formData.paymentMethod === 'credit' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-[#2A2A2A]">
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#A3A3A3] mb-2">Número do Cartão *</label>
                        <input
                          type="text"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleChange}
                          required
                          maxLength={19}
                          className="w-full bg-transparent border-b border-[#2A2A2A] py-3 px-0 text-white outline-none focus:border-[#D4AF37] transition-colors placeholder:text-[#6B6B6B]"
                          placeholder="0000 0000 0000 0000"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#A3A3A3] mb-2">Nome no Cartão *</label>
                        <input
                          type="text"
                          name="cardName"
                          value={formData.cardName}
                          onChange={handleChange}
                          required
                          className="w-full bg-transparent border-b border-[#2A2A2A] py-3 px-0 text-white outline-none focus:border-[#D4AF37] transition-colors placeholder:text-[#6B6B6B]"
                          placeholder="COMO NO CARTÃO"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#A3A3A3] mb-2">Validade *</label>
                        <input
                          type="text"
                          name="cardExpiry"
                          value={formData.cardExpiry}
                          onChange={handleChange}
                          required
                          maxLength={5}
                          className="w-full bg-transparent border-b border-[#2A2A2A] py-3 px-0 text-white outline-none focus:border-[#D4AF37] transition-colors placeholder:text-[#6B6B6B]"
                          placeholder="MM/AA"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#A3A3A3] mb-2">CVV *</label>
                        <input
                          type="text"
                          name="cardCVV"
                          value={formData.cardCVV}
                          onChange={handleChange}
                          required
                          maxLength={4}
                          className="w-full bg-transparent border-b border-[#2A2A2A] py-3 px-0 text-white outline-none focus:border-[#D4AF37] transition-colors placeholder:text-[#6B6B6B]"
                          placeholder="000"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#A3A3A3] mb-2">Parcelas</label>
                        <select
                          name="installments"
                          value={formData.installments}
                          onChange={handleChange}
                          className="w-full bg-transparent border-b border-[#2A2A2A] py-3 px-0 text-white outline-none focus:border-[#D4AF37] transition-colors"
                        >
                          <option value="1" className="bg-[#0F0F0F]">1x sem juros</option>
                          <option value="2" className="bg-[#0F0F0F]">2x sem juros</option>
                          <option value="3" className="bg-[#0F0F0F]">3x sem juros</option>
                          <option value="4" className="bg-[#0F0F0F]">4x sem juros</option>
                          <option value="5" className="bg-[#0F0F0F]">5x sem juros</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Info PIX */}
                  {formData.paymentMethod === 'pix' && (
                    <div className="pt-6 border-t border-[#2A2A2A]">
                      <p className="text-[#A3A3A3] text-sm">
                        O código PIX será gerado após confirmar o pedido. Você terá 1 hora para realizar o pagamento.
                      </p>
                    </div>
                  )}

                  {/* Info Boleto */}
                  {formData.paymentMethod === 'boleto' && (
                    <div className="pt-6 border-t border-[#2A2A2A]">
                      <p className="text-[#A3A3A3] text-sm">
                        O boleto será gerado após confirmar o pedido. Vencimento em 3 dias úteis.
                      </p>
                    </div>
                  )}
                </div>
              </section>
            </div>

            {/* ============================================
                RESUMO DO PEDIDO (SIDEBAR)
                ============================================ */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 p-6 bg-[#141414] border border-[#2A2A2A] rounded-sm">
                <h2 className="font-[var(--font-serif)] text-xl font-light text-white mb-6">
                  Resumo do Pedido
                </h2>

                {/* Produtos */}
                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-16 h-20 flex-shrink-0 overflow-hidden rounded-sm bg-[#1A1A1A]">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={64}
                          height={80}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-sm line-clamp-2">{item.name}</p>
                        <p className="text-[#6B6B6B] text-xs">Tam: {item.size} | Qtd: {item.quantity}</p>
                        <p className="text-[#D4AF37] text-xs font-medium mt-1">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totais */}
                <div className="space-y-3 pt-6 border-t border-[#2A2A2A]">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#A3A3A3]">Subtotal</span>
                    <span className="text-white">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#A3A3A3]">Frete</span>
                    <span className="text-white">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(shipping)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-4 border-t border-[#2A2A2A]">
                    <span className="text-[#D4AF37] font-bold">Total</span>
                    <span className="text-[#D4AF37] font-bold">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}
                    </span>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-6 w-full bg-[#D4AF37] text-[#0F0F0F] py-3 font-black uppercase tracking-[0.3em] hover:bg-[#D4AF37]/90 transition-colors"
                >
                  {loading ? 'Processando...' : 'Confirmar Pedido'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}