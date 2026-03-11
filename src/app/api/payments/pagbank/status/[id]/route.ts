import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/src/lib/env';

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const response = await fetch(`${env.pagbankApiUrl}/orders/${id}`, {
      headers: {
        Authorization: `Bearer ${env.pagbankToken}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { message: 'Erro ao consultar status do pedido' },
      { status: 500 }
    );
  }
}
