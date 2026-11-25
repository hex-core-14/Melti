
// app/api/orders/route.ts
import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/session';
import {
  createOrder,
  findOrdersByEmail,
  OrderItemRecord,
  ShippingAddressRecord,
} from '@/lib/db';
import {
  sendOrderConfirmationEmail,
  sendOrderConfirmationSms,
  trackBrevoEvent,
} from '@/lib/brevo';

export async function GET() {
  try {
    const session = await getSessionUser();

    if (!session) {
      return NextResponse.json({ orders: [] });
    }

    const orders = await findOrdersByEmail(session.email);

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('[Orders] Fetch error:', error);

    return NextResponse.json(
      { error: 'Unable to fetch orders.' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSessionUser();
    const body = await req.json();

    const items: OrderItemRecord[] = Array.isArray(body.items)
      ? body.items
      : [];

    const shippingAddress: ShippingAddressRecord | undefined =
      body.shippingAddress;

    if (items.length === 0) {
      return NextResponse.json(
        { error: 'Your Pour Bag is empty.' },
        { status: 400 }
      );
    }

    if (
      !shippingAddress?.fullName?.trim() ||
      !shippingAddress?.email?.trim() ||
      !shippingAddress?.phone?.trim() ||
      !shippingAddress?.line1?.trim() ||
      !shippingAddress?.city?.trim() ||
      !shippingAddress?.pincode?.trim()
    ) {
      return NextResponse.json(
        { error: 'Please complete all shipping address fields.' },
        { status: 400 }
      );
    }

    const subtotal = items.reduce(
      (sum, item) =>
        sum + Number(item.unitPrice) * Number(item.quantity),
      0
    );

    const couponCode =
      typeof body.couponCode === 'string' && body.couponCode.trim()
        ? body.couponCode.trim().toUpperCase()
        : null;

    let discount = 0;

    if (couponCode === 'FIRSTPOUR15') {
      discount = Math.round(subtotal * 0.15);
    } else if (couponCode === 'MELTI150' && subtotal >= 250) {
      discount = 150;
    }

    const discountedSubtotal = Math.max(0, subtotal - discount);
    const shippingFee = discountedSubtotal >= 999 ? 0 : 49;
    const totalAmount = discountedSubtotal + shippingFee;

    const paymentMethod =
      body.paymentMethod === 'demo_card' ||
      body.paymentMethod === 'demo_cod'
        ? body.paymentMethod
        : 'demo_upi';

    const order = await createOrder({
      userId: session?.userId,
      customerEmail: session?.email || shippingAddress.email,
      items,
      subtotal,
      discount,
      shippingFee,
      totalAmount,
      couponCode,
      paymentMethod,
      paymentStatus:
        paymentMethod === 'demo_cod' ? 'cod_confirmed' : 'paid_demo',
      orderStatus: 'confirmed',
      shippingAddress: {
        fullName: shippingAddress.fullName.trim(),
        email: (
          session?.email || shippingAddress.email
        ).trim().toLowerCase(),
        phone: shippingAddress.phone.trim(),
        line1: shippingAddress.line1.trim(),
        city: shippingAddress.city.trim(),
        state: (shippingAddress.state || 'Karnataka').trim(),
        pincode: shippingAddress.pincode.trim(),
      },
    });

    console.log(
      '[Orders] Triggering Brevo Email + SMS + order_completed event for:',
      order.orderId
    );

    const [
      emailOutcome,
      smsOutcome,
      eventOutcome,
    ] = await Promise.allSettled([
      sendOrderConfirmationEmail(order),
      sendOrderConfirmationSms(order),
      trackBrevoEvent({
        eventName: 'order_completed',
        email: order.customerEmail,
        firstName: order.shippingAddress.fullName.split(/\s+/)[0],
        properties: {
          order_id: order.orderId,
          total_amount: order.totalAmount,
        },
      }),
    ]);

    if (emailOutcome.status === 'rejected') {
      console.error(
        '[Orders] Brevo email error:',
        emailOutcome.reason
      );
    }

    if (smsOutcome.status === 'rejected') {
      console.error(
        '[Orders] Brevo SMS error:',
        smsOutcome.reason
      );
    }

    if (eventOutcome.status === 'rejected') {
      console.error(
        '[Orders] Brevo event error:',
        eventOutcome.reason
      );
    }

    const emailSent =
      emailOutcome.status === 'fulfilled' &&
      Boolean(emailOutcome.value);

    const smsSent =
      smsOutcome.status === 'fulfilled' &&
      Boolean(smsOutcome.value);

    return NextResponse.json(
      { ok: true, order, emailSent, smsSent },
      { status: 201 }
    );
  } catch (error) {
    console.error('[Orders] Order creation error:', error);

    return NextResponse.json(
      { error: 'Unable to place your order.' },
      { status: 500 }
    );
  }
}
