// app/api/cart/track/route.ts
import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/session';
import { trackBrevoEvent } from '@/lib/brevo';

interface TrackedCartItem {
  shortName?: string;
  name?: string;
  cocoaPercent?: string;
  quantity?: number;
  price?: number;
  unitPrice?: number;
}

export async function POST(req: Request) {
  try {
    const session = await getSessionUser();
    if (!session?.email) {
      // Guest user not logged in yet; skip silently
      return NextResponse.json({ ok: true, skipped: true });
    }

    const body = await req.json();
    const items: TrackedCartItem[] = Array.isArray(body?.items) ? body.items : [];

    if (items.length === 0) {
      return NextResponse.json({ ok: true, empty: true });
    }

    const itemCount = items.reduce((sum, i) => sum + (Number(i.quantity) || 1), 0);
    const cartTotal = items.reduce((sum, i) => {
      const price = Number(i.unitPrice ?? i.price ?? 0);
      const qty = Number(i.quantity) || 1;
      return sum + price * qty;
    }, 0);

    const itemsSummary = items
      .map((i) => {
        const label = i.shortName || i.name || 'MÈLTI Pack';
        const qty = Number(i.quantity) || 1;
        return `${label} × ${qty}`;
      })
      .join(', ');

    const appUrl = (
      process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    ).replace(/\/$/, '');

    await trackBrevoEvent({
      eventName: 'cart_updated',
      email: session.email,
      firstName: session.name?.split(/\s+/)[0],
      properties: {
        items_summary: itemsSummary,
        cart_total: cartTotal,
        item_count: itemCount,
        checkout_url: `${appUrl}/checkout`,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[Cart Track] Failed to send Brevo cart event:', err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}