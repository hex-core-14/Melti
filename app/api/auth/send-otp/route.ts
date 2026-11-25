// app/api/auth/send-otp/route.ts
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { findUserByEmail, saveOtp } from '@/lib/db';
import { sendOtpEmail } from '@/lib/brevo';

export async function POST(req: Request) {
  try {
    const { email, name } = await req.json();
    const normalizedEmail = String(email || '').trim().toLowerCase();

    if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    const existingUser = await findUserByEmail(normalizedEmail);
    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists. Please log in.' },
        { status: 409 }
      );
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const otpHash = await bcrypt.hash(otp, 10);

    await saveOtp({
      email: normalizedEmail,
      otpHash,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      attempts: 0,
    });

    await sendOtpEmail(normalizedEmail, otp, String(name || '').trim());

    return NextResponse.json({
      ok: true,
      message: `Verification code sent to ${normalizedEmail}`,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to send OTP.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}