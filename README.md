# Hadarah Store - Luxury E-commerce

Este é o projeto da **Hadarah Store**, uma plataforma de e-commerce de luxo inspirada em grandes marcas da moda mundial. O projeto oferece uma experiência de compra sofisticada e exclusiva, focada em Havaianas personalizadas e vestuário de alta qualidade.

## 🎯 Objetivo do Projeto

O objetivo principal é criar uma vitrine digital premium que combine uma estética minimalista e luxuosa com funcionalidades robustas de e-commerce. A Hadarah Store busca elevar a percepção de valor dos produtos através de um design refinado, animações suaves e um processo de checkout fluido e seguro.

## 🛠️ Tech Stack

- **Framework:** Next.js 16.1.6 (App Router)
- **Estilização:** Tailwind CSS v4
- **Backend:** Firebase (Firestore, Authentication, Storage)
- **Pagamentos:** PagBank API (Pix, Cartão de Crédito, Boleto)
- **Tipagem:** TypeScript

## 📂 Estrutura de Arquivos Principal

Abaixo estão os caminhos dos arquivos e diretórios fundamentais para o funcionamento do projeto:

### Páginas e Rotas (`src/app/`)
- `src/app/page.tsx`: Página inicial com destaques e vitrine principal.
- `src/app/produto/[id]/page.tsx`: Detalhes do produto e seleção de variações.
- `src/app/carrinho/page.tsx`: Gerenciamento de itens selecionados.
- `src/app/checkout/page.tsx`: Fluxo de finalização de compra e pagamento.
- `src/app/admin/`: Área administrativa para gestão de produtos e pedidos.
- `src/app/api/payments/pagbank/`: Endpoints para integração com o gateway de pagamento.

### Componentes (`src/components/`)
- `src/components/Navbar.tsx`: Navegação principal.
- `src/components/Hero.tsx`: Banner de impacto da página inicial.
- `src/components/ProductCard.tsx`: Card de exibição de produto individual.
- `src/components/LuxuryCursor.tsx`: Cursor customizado para experiência premium.

### Serviços e Lógica (`src/services/` & `src/lib/`)
- `src/services/firebase.ts`: Configuração e inicialização do Firebase.
- `src/services/payments/pagbank.ts`: Integração lógica com a API do PagBank.
- `src/lib/env.ts`: Gerenciamento centralizado de variáveis de ambiente.

## 📊 Estrutura de Dados

O projeto utiliza os seguintes modelos de dados principais:

### Produto (`Product`)
Localizado em: `src/types/product.ts`
```typescript
{
  id: string;
  name: string;
  price: number;
  category: 'havaianas' | 'roupas';
  imageUrl: string;
  sizes: { [key: string]: number }; // Ex: { "37-38": 5, "M": 2 }
  description?: string;
  active: boolean;
  createdAt: string;
}
```

### Pedido/Checkout (`CheckoutOrder`)
Localizado em: `src/types/order.ts`
```typescript
{
  referenceId: string;
  customer: {
    name: string;
    email: string;
    taxId: string;
    phone: string;
  };
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
    image?: string;
    size?: string;
  }>;
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    postalCode: string;
  };
  shipping: number;
  total: number;
  paymentMethod: 'credit_card' | 'pix' | 'boleto';
}
```

## 🚀 Desenvolvimento

Para rodar o projeto localmente:

```bash
npm install
npm run dev
```

Crie um arquivo `.env.local` com as credenciais necessárias do Firebase e PagBank.
