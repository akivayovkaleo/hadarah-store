# CLAUDE.md — Hadarah Store

## Visão Geral

E-commerce de luxo built with Next.js 16 App Router, Firebase, Tailwind CSS v4, e integração PagBank. Produtos principais: Havaianas personalizadas e vestuário premium.

## Comandos

```bash
npm run dev      # Servidor de desenvolvimento (localhost:3000)
npm run build    # Build de produção
npm run start    # Servidor de produção
npm run lint     # ESLint
```

## Variáveis de Ambiente

Criar `.env.local` na raiz com:

```env
# Firebase (Client SDK)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# PagBank
PAGBANK_TOKEN=                    # Bearer token da API PagBank
PAGBANK_API_URL=https://sandbox.api.pagseguro.com  # ou api de produção
PAGBANK_WEBHOOK_SECRET=           # Segredo HMAC para validar webhooks (vazio = skip em dev)

# App
NEXT_PUBLIC_BASE_URL=http://localhost:3000  # URL pública para webhook callback
```

## Stack

- **Next.js 16.1.6** — App Router, `src/app/` directory, route handlers em `src/app/api/`
- **React 19** — hooks modernos, `'use client'` apenas onde necessário
- **TypeScript strict** — `strict: true`, path alias `@/*` → raiz do projeto
- **Tailwind CSS v4** — sem `tailwind.config`, tokens inline
- **Firebase Client SDK v12** — Firestore, Auth, Storage, Analytics (client-side only)
- **PagBank API** — PIX, Boleto, Cartão de Crédito (crédito requer tokenização client-side via PagBank.js)

## Estrutura de Arquivos

```
src/
├── app/
│   ├── layout.tsx              # Root layout — wraps CartProvider + Navbar
│   ├── page.tsx                # Home page (produtos em destaque do Firestore)
│   ├── produto/[id]/page.tsx   # Detalhe do produto, seleção de tamanho, addToCart
│   ├── carrinho/page.tsx       # Carrinho de compras (lê CartContext)
│   ├── checkout/page.tsx       # Fluxo 3 steps: cart → shipping → payment
│   ├── pedido/[id]/page.tsx    # Status do pedido com polling a cada 3s
│   ├── colecao/[categoria]/    # Listagem por categoria
│   ├── admin/
│   │   ├── login/page.tsx      # Login Firebase Auth
│   │   └── dashboard/page.tsx  # CRUD de produtos, upload para Storage
│   └── api/payments/pagbank/
│       ├── create/route.ts     # POST — cria pedido no Firestore + PagBank
│       ├── webhook/route.ts    # POST — webhook PagBank (HMAC + decremento estoque)
│       └── status/[id]/route.ts
├── components/
│   ├── Navbar.tsx              # Badge dinâmico do carrinho via useCart()
│   ├── Hero.tsx
│   ├── ProductCard.tsx
│   ├── FeaturedProducts.tsx
│   └── admin/ProductList.tsx
├── context/
│   └── CartContext.tsx         # Estado global do carrinho + localStorage
├── hooks/
│   ├── useCart.ts              # Wrapper de useContext(CartContext)
│   └── useAuth.ts
├── services/
│   ├── firebase.ts             # Init Firebase, exports: db, auth, storage
│   └── payments/pagbank.ts
├── types/
│   ├── order.ts                # OrderStatus, PaymentData, CheckoutOrder, StoredOrder
│   ├── product.ts
│   └── payment.ts
└── lib/
    └── env.ts                  # process.env wrappers
```

## Firestore — Coleções

### `products`
```typescript
{
  id: string;                        // doc ID gerado pelo Firestore
  name: string;
  price: number;                     // em reais (float)
  category: 'havaianas' | 'roupas';
  imageUrl: string;                  // Firebase Storage URL
  sizes: Record<string, number>;     // { "37-38": 5, "M": 2 } — estoque por tamanho
  description?: string;
  active: boolean;
  createdAt: Timestamp;
}
```

### `orders`
```typescript
{
  id: string;                        // doc ID = orderId retornado ao frontend
  referenceId: string;               // UUID gerado no checkout (usado no PagBank)
  status: 'pending' | 'paid' | 'failed' | 'cancelled';
  pagbankOrderId?: string;           // ID retornado pela API PagBank
  customer: { name, email, taxId, phone };
  items: Array<{ id, name, quantity, price, size? }>;
  address: { street, number, complement?, neighborhood, city, state, postalCode };
  shipping: number;
  total: number;
  paymentMethod: 'credit_card' | 'pix' | 'boleto';
  paymentData?: {
    pixQrCode?: string;              // URL PNG do QR code
    pixQrCodeText?: string;          // String copia-e-cola
    boletoUrl?: string;              // URL PDF
    boletoBarcode?: string;          // Linha digitável
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

## Padrões Arquiteturais Importantes

### CartContext + Hidratação
`CartContext.tsx` resolve hidratação em dois `useEffect`:
1. Mount: lê localStorage, popula `items`, seta `hydrated = true`
2. Subsequent: escreve localStorage apenas quando `hydrated === true`

O checkout usa `isHydrated` para evitar redirect falso durante SSR:
```typescript
if (isHydrated && cartItems.length === 0) router.replace('/carrinho');
```

### Webhook HMAC-SHA256
`webhook/route.ts` valida assinatura via `timingSafeEqual`. Se `PAGBANK_WEBHOOK_SECRET` estiver vazio, a validação é pulada (útil em desenvolvimento com ngrok). Em produção, sempre configurar o secret.

### Decremento de Estoque Atômico
`decrementStock()` usa `runTransaction` do Firestore — lê todos os docs de produtos primeiro, então escreve, garantindo que pedidos simultâneos não corrompam o estoque.

### Polling de Status do Pedido
`pedido/[id]/page.tsx` faz polling via `setInterval` a cada 3s, usando `useRef<ReturnType<typeof setInterval>>` para cleanup. O polling só ativa quando `order.status === 'pending'` e é limpo ao mudar de status ou ao desmontar o componente.

## Convenções de Código

- **Componentes client-side** — `'use client'` na primeira linha apenas quando necessário
- **Formatação de moeda** — `Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })`
- **Tamanhos compostos** — chave do carrinho é `id + size` (mesmo produto em tamanhos diferentes = entradas separadas)
- **API routes** — sempre retornam `NextResponse.json(...)`, erros de validação = 400, erros internos = 500
- **Imports** — usar alias `@/src/...` nunca caminhos relativos longos

## Design System

- Background: `#0F0F0F` (preto luxo)
- Accent: `#D4AF37` (dourado)
- Fontes: Playfair Display (headings) + Inter (body)
- Cursor customizado: `LuxuryCursor.tsx`

## Problemas Conhecidos

1. **Firebase Client SDK em API routes** — O projeto usa o Client SDK (não Admin SDK) nos route handlers. Em produção, é preferível usar `firebase-admin` com service account para evitar problemas de autenticação com regras do Firestore.
2. **Cartão de crédito** — O método `credit_card` na API está estruturado mas requer tokenização client-side via PagBank.js. O campo `card.encrypted` está comentado em `create/route.ts`.
3. **`firebase.ts`** — Exporta `db`, `auth`, `storage` mas analytics só é inicializado client-side (guarda `typeof window !== 'undefined'`).
