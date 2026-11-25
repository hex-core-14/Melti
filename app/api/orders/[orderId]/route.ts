// app/api/orders/[orderId]/route.ts
import { NextResponse } from 'next/server';
import { findOrderById } from '@/lib/db';

export async function GET(
  _req: Request,
  context: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await context.params;
    const order = await findOrderById(orderId);

    if (!order) {
      return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch {
    return NextResponse.json(
      { error: 'Unable to load order receipt.' },
      { status: 500 }
    );
  }
}