// app/api/account/route.ts
import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/session';
import {
  findOrdersByEmail,
  findUserProfileByEmail,
  updateUserProfileByEmail,
} from '@/lib/db';

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json(
        { authenticated: false, profile: null, orders: [] },
        { status: 401 }
      );
    }

    const [profile, orders] = await Promise.all([
      findUserProfileByEmail(session.email),
      findOrdersByEmail(session.email),
    ]);

    return NextResponse.json({
      authenticated: true,
      profile: profile || {
        userId: session.userId,
        name: session.name,
        email: session.email,
      },
      orders,
    });
  } catch {
    return NextResponse.json(
      { error: 'Unable to load account details.' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = await req.json();

    const updated = await updateUserProfileByEmail(session.email, {
      name: typeof body.name === 'string' ? body.name : undefined,
      tasteMood:
        typeof body.tasteMood === 'string' ? body.tasteMood : undefined,
      defaultAddress:
        body.defaultAddress && typeof body.defaultAddress === 'object'
          ? {
              phone: String(body.defaultAddress.phone || ''),
              line1: String(body.defaultAddress.line1 || ''),
              city: String(body.defaultAddress.city || ''),
              state: String(body.defaultAddress.state || 'Karnataka'),
              pincode: String(body.defaultAddress.pincode || ''),
            }
          : undefined,
    });

    return NextResponse.json({ ok: true, profile: updated });
  } catch {
    return NextResponse.json(
      { error: 'Failed to save preferences.' },
      { status: 500 }
    );
  }
}