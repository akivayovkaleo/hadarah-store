# Hadarah Store

E-commerce de luxo para Havaianas personalizadas e vestuário premium. Experiência de compra sofisticada com design minimalista e integração completa de pagamentos.

## Tech Stack

| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js 16.1.6 (App Router) |
| UI | React 19 + Tailwind CSS v4 |
| Banco de dados | Firebase Firestore |
| Autenticação | Firebase Auth |
| Storage | Firebase Storage |
| Pagamentos | PagBank API (PIX, Boleto, Crédito) |
| Linguagem | TypeScript (strict mode) |

## Funcionalidades

- **Vitrine de produtos** — listagem por categoria (Havaianas / Roupas), filtros e página de detalhe com seleção de tamanho e controle de estoque em tempo real
- **Carrinho global** — persistido em localStorage, badge dinâmico no Navbar, validação de estoque máximo por tamanho
- **Checkout em 3 etapas** — dados de entrega → endereço → pagamento
- **Pagamentos via PagBank**
  - PIX: QR Code + copia-e-cola, expira em 30 min
  - Boleto: linha digitável + download do PDF
  - Cartão de crédito: estruturado (requer tokenização via PagBank.js)
- **Página de status do pedido** — polling automático a cada 3s enquanto pendente, exibe dados de pagamento (QR code PIX, barcode boleto)
- **Webhook PagBank** — validação HMAC-SHA256, decremento atômico de estoque via Firestore transaction
- **Área administrativa** — CRUD de produtos com upload de imagens para Firebase Storage, protegida por Firebase Auth

## Configuração

### 1. Instalar dependências

```bash
npm install
```

### 2. Variáveis de ambiente

Criar `.env.local` na raiz:

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# PagBank
PAGBANK_TOKEN=
PAGBANK_API_URL=https://sandbox.api.pagseguro.com
PAGBANK_WEBHOOK_SECRET=

# URL pública (para callback do webhook)
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 3. Rodar localmente

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

Para testar webhooks localmente, use [ngrok](https://ngrok.com) e configure `NEXT_PUBLIC_BASE_URL` com a URL pública gerada. Deixe `PAGBANK_WEBHOOK_SECRET` vazio para pular a validação HMAC em desenvolvimento.

## Estrutura de Rotas

| Rota | Descrição |
|------|-----------|
| `/` | Home — produtos em destaque |
| `/colecao/[categoria]` | Listagem por categoria |
| `/produto/[id]` | Detalhe do produto |
| `/carrinho` | Carrinho de compras |
| `/checkout` | Fluxo de pagamento |
| `/pedido/[id]` | Status do pedido (polling) |
| `/admin` | Área administrativa |
| `/api/payments/pagbank/create` | POST — criar pedido |
| `/api/payments/pagbank/webhook` | POST — webhook PagBank |

## Modelos de Dados

### Produto
```typescript
{
  name: string;
  price: number;
  category: 'havaianas' | 'roupas';
  imageUrl: string;
  sizes: Record<string, number>;  // { "37-38": 5, "M": 2 }
  description?: string;
  active: boolean;
}
```

### Pedido
```typescript
{
  referenceId: string;
  status: 'pending' | 'paid' | 'failed' | 'cancelled';
  customer: { name, email, taxId, phone };
  items: Array<{ id, name, quantity, price, size? }>;
  address: { street, number, complement?, neighborhood, city, state, postalCode };
  shipping: number;
  total: number;
  paymentMethod: 'credit_card' | 'pix' | 'boleto';
  paymentData?: { pixQrCode?, pixQrCodeText?, boletoUrl?, boletoBarcode? };
}
```

## Scripts

```bash
npm run dev      # Desenvolvimento
npm run build    # Build de produção
npm run start    # Servidor de produção
npm run lint     # Verificação de código
```
