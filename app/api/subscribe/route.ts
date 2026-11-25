// app/api/subscribe/route.ts
import { NextResponse } from 'next/server';
import { subscribeContactToBrevo } from '@/lib/brevo';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const email = typeof body?.email === 'string' ? body.email.trim() : '';
    const rawFirstName =
      typeof body?.firstName === 'string'
        ? body.firstName
        : typeof body?.name === 'string'
        ? body.name
        : '';

    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    const firstName = rawFirstName.trim().split(/\s+/)[0] || '';

    const result = await subscribeContactToBrevo({
      email,
      firstName,
    });

    if (!result.ok) {
      return NextResponse.json(
        { error: result.error || 'Could not subscribe right now.' },
        { status: result.status >= 400 && result.status < 500 ? result.status : 500 }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        message: 'Check your inbox for your welcome note & taste survey',
      },
      { status: result.status === 204 ? 200 : 201 }
    );
  } catch (err) {
    console.error('[API /api/subscribe] Unexpected error:', err);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}