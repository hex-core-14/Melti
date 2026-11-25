// app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { findUserByEmail } from '@/lib/db';
import { createSessionCookie } from '@/lib/session';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    const normalizedEmail = String(email || '').trim().toLowerCase();
    const rawPassword = String(password || '');

    const user = await findUserByEmail(normalizedEmail);
    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    const valid = await bcrypt.compare(rawPassword, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    await createSessionCookie({
      userId: user.id,
      email: user.email,
      name: user.name,
    });

    return NextResponse.json({
      ok: true,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch {
    return NextResponse.json({ error: 'Unable to log in right now.' }, { status: 500 });
  }
}