import { NextRequest, NextResponse } from 'next/server';
import { createPagBankOrder } from '@/src/services/payments/pagbank';
import { CheckoutOrder, OrderItem } from '@/src/types/order';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as CheckoutOrder;

    const orderPayload = {
      reference_id: body.referenceId,
      customer: {
        name: body.customer.name,
        email: body.customer.email,
        tax_id: body.customer.taxId,
        phones: [
          {
            country: '55',
            area: body.customer.phone.slice(0, 2),
            number: body.customer.phone.slice(2),
            type: 'MOBILE',
          },
        ],
      },
      items: body.items.map((item: OrderItem) => ({
        reference_id: item.id,
        name: item.name,
        quantity: item.quantity,
        unit_amount: Math.round(item.price * 100),
      })),
      shipping: {
        amount: Math.round(body.shipping * 100),
        address: {
          street: body.address.street,
          number: body.address.number,
          complement: body.address.complement || '',
          locality: body.address.neighborhood,
          city: body.address.city,
          region_code: body.address.state,
          country: 'BRA',
          postal_code: body.address.postalCode,
        },
      },
    };

    const result = await createPagBankOrder(orderPayload);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao criar pagamento';
    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 500 }
    );
  }
}
