import { env } from '@/src/lib/env';

export async function createPagBankOrder(payload: unknown) {
  const response = await fetch(`${env.pagbankApiUrl}/orders`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.pagbankToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || 'Erro ao criar pedido no PagBank');
  }

  return data;
}
