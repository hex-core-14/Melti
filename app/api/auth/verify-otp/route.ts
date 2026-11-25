// app/api/auth/verify-otp/route.ts
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import {
  createUser,
  deleteOtp,
  findUserByEmail,
  getOtp,
  incrementOtpAttempts,
} from '@/lib/db';
import { subscribeContactToBrevo } from '@/lib/brevo';
import { createSessionCookie } from '@/lib/session';

export async function POST(req: Request) {
  try {
    const { email, otp, name, password, tasteMood } = await req.json();
    const normalizedEmail = String(email || '').trim().toLowerCase();
    const cleanOtp = String(otp || '').trim();
    const rawName = String(name || '').trim();
    const cleanName = rawName || normalizedEmail.split('@')[0];
    const firstName = (rawName ? rawName.split(/\s+/)[0] : '') || cleanName;
    const cleanPassword = String(password || '');
    const selectedMood = String(tasteMood || '72% Midnight Velvet');

    if (!normalizedEmail || !cleanOtp || cleanPassword.length < 6) {
      return NextResponse.json(
        { error: 'Email, 6-digit OTP, and a password (min 6 chars) are required.' },
        { status: 400 }
      );
    }

    const existingUser = await findUserByEmail(normalizedEmail);
    if (existingUser) {
      return NextResponse.json({ error: 'Account already registered.' }, { status: 409 });
    }

    const record = await getOtp(normalizedEmail);
    if (!record) {
      return NextResponse.json(
        { error: 'No OTP found for this email. Please request a new code.' },
        { status: 400 }
      );
    }

    if (Date.now() > new Date(record.expiresAt).getTime()) {
      await deleteOtp(normalizedEmail);
      return NextResponse.json(
        { error: 'OTP has expired. Please request a fresh code.' },
        { status: 400 }
      );
    }

    if (record.attempts >= 5) {
      await deleteOtp(normalizedEmail);
      return NextResponse.json(
        { error: 'Too many incorrect attempts. Please request a new code.' },
        { status: 429 }
      );
    }

    const isMatch = await bcrypt.compare(cleanOtp, record.otpHash);
    if (!isMatch) {
      await incrementOtpAttempts(normalizedEmail);
      return NextResponse.json({ error: 'Invalid OTP code. Try again.' }, { status: 400 });
    }

    // OTP verified -> save user to MongoDB
    await deleteOtp(normalizedEmail);
    const passwordHash = await bcrypt.hash(cleanPassword, 12);
    const newUser = await createUser({
      id: crypto.randomUUID(),
      name: cleanName,
      email: normalizedEmail,
      passwordHash,
      tasteMood: selectedMood,
      createdAt: new Date().toISOString(),
    });

    // Sync contact to Brevo List 3 with FIRSTNAME only (triggers automated welcome flow)
    const brevoResult = await subscribeContactToBrevo({
      email: newUser.email,
      firstName,
    });

    if (!brevoResult.ok) {
      console.error('[Verify OTP] Brevo List 3 sync failed:', brevoResult.error);
    }

    // Issue login session cookie
    await createSessionCookie({
      userId: newUser.id,
      email: newUser.email,
      name: newUser.name,
    });

    return NextResponse.json(
      {
        ok: true,
        message: 'Check your inbox for your welcome note & taste survey',
        user: { id: newUser.id, name: newUser.name, email: newUser.email },
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Verification failed.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}