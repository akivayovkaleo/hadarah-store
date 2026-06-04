export const env = {
  pagbankToken: process.env.PAGBANK_TOKEN || '',
  pagbankApiUrl: process.env.PAGBANK_API_URL || 'https://sandbox.api.pagseguro.com',
  // Segredo configurado no painel do PagBank para validar assinatura HMAC dos webhooks.
  // Deixe vazio em desenvolvimento para pular a validação.
  pagbankWebhookSecret: process.env.PAGBANK_WEBHOOK_SECRET || '',
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
};
