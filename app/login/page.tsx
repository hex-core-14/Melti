// app/login/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Mail, Lock, User, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

const TASTE_MOODS = [
  '72% Midnight Velvet',
  'Hazelnut Praline 62%',
  'Burnt Caramel & Sea Salt',
  'Malabar Chai & Cacao',
];

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'signup' | 'login'>('signup');
  const [signupStep, setSignupStep] = useState<'details' | 'otp'>('details');
  const [signupComplete, setSignupComplete] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tasteMood, setTasteMood] = useState(TASTE_MOODS[0]);
  const [otp, setOtp] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfo('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not send OTP');

      setInfo(`We sent a 6-digit verification code to ${email}.`);
      setSignupStep('otp');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfo('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, name, password, tasteMood }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'OTP verification failed');

      setSignupComplete(true);
      setInfo(data.message || 'Check your inbox for your welcome note & taste survey');

      setTimeout(() => {
        router.push('/');
        router.refresh();
      }, 2200);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Verification failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');

      router.push('/');
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '13px 16px 13px 42px',
    borderRadius: '14px',
    background: 'rgba(255, 248, 240, 0.05)',
    border: '1px solid rgba(212, 163, 115, 0.28)',
    color: '#FFF8F0',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
  };

  return (
    <div
      style={{
        minHeight: '100dvh',
        background: 'radial-gradient(circle at 50% 25%, #2B160B 0%, #120B06 70%)',
        color: '#FFF8F0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div style={{ width: '100%', maxWidth: '440px' }}>
        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: '#EBC593',
            textDecoration: 'none',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: '20px',
          }}
        >
          <ArrowLeft size={15} /> Back to Pour Bar
        </Link>

        <div
          style={{
            padding: '34px 28px',
            borderRadius: '28px',
            background: 'linear-gradient(160deg, rgba(38, 20, 10, 0.92) 0%, rgba(18, 11, 6, 0.98) 100%)',
            border: '1px solid rgba(212, 163, 115, 0.28)',
            boxShadow: '0 28px 64px rgba(0, 0, 0, 0.65)',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '22px' }}>
            <div style={{ fontSize: '26px', fontWeight: 900, letterSpacing: '0.14em' }}>
              MÈLTI<span style={{ color: '#D4A373' }}>.</span>
            </div>
            <p style={{ fontSize: '13px', color: 'rgba(235, 197, 147, 0.75)', marginTop: '6px' }}>
              {mode === 'signup'
                ? 'Join the Midnight Pour Club & unlock 15% off'
                : 'Welcome back to your small-batch stash'}
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              padding: '4px',
              borderRadius: '14px',
              background: 'rgba(0, 0, 0, 0.35)',
              border: '1px solid rgba(212, 163, 115, 0.16)',
              marginBottom: '22px',
            }}
          >
            {(['signup', 'login'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => {
                  setMode(tab);
                  setSignupStep('details');
                  setSignupComplete(false);
                  setError('');
                  setInfo('');
                }}
                style={{
                  padding: '10px',
                  borderRadius: '10px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  background: mode === tab ? 'linear-gradient(135deg, #EBC593, #D4A373)' : 'transparent',
                  color: mode === tab ? '#1A120B' : 'rgba(255, 248, 240, 0.7)',
                }}
              >
                {tab === 'signup' ? 'Create Account' : 'Log In'}
              </button>
            ))}
          </div>

          {error && (
            <div
              style={{
                padding: '11px 14px',
                borderRadius: '12px',
                background: 'rgba(200, 109, 81, 0.16)',
                border: '1px solid rgba(200, 109, 81, 0.45)',
                color: '#F6B8A6',
                fontSize: '12.5px',
                marginBottom: '16px',
              }}
            >
              {error}
            </div>
          )}

          {info && (
            <div
              role="status"
              style={{
                padding: '12px 14px',
                borderRadius: '12px',
                background: 'rgba(212, 163, 115, 0.16)',
                border: '1px solid rgba(235, 197, 147, 0.45)',
                color: '#EBC593',
                fontSize: '13px',
                fontWeight: 700,
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '9px',
              }}
            >
              <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
              <span>{info}</span>
            </div>
          )}

          {mode === 'signup' && signupComplete && (
            <div style={{ textAlign: 'center', paddingTop: '6px' }}>
              <p style={{ fontSize: '13px', color: 'rgba(255, 248, 240, 0.75)', marginBottom: '16px' }}>
                Taking you into the Pour Bar...
              </p>
              <button
                type="button"
                onClick={() => {
                  router.push('/');
                  router.refresh();
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  width: '100%',
                  padding: '14px',
                  borderRadius: '9999px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 900,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#1A120B',
                  background: 'linear-gradient(135deg, #EBC593 0%, #D4A373 60%, #B9824F 100%)',
                }}
              >
                Enter Pour Bar <ArrowRight size={15} />
              </button>
            </div>
          )}

          {mode === 'signup' && !signupComplete && signupStep === 'details' && (
            <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '14px', top: '15px', color: '#D4A373' }} />
                <input
                  type="text"
                  required
                  placeholder="Your First Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '14px', top: '15px', color: '#D4A373' }} />
                <input
                  type="email"
                  required
                  placeholder="Email Address (for OTP)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '14px', top: '15px', color: '#D4A373' }} />
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="Create Password (min 6 chars)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '11px',
                    fontWeight: 800,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: '#D4A373',
                    marginBottom: '6px',
                  }}
                >
                  Pick Your Cocoa Mood
                </label>
                <select
                  value={tasteMood}
                  onChange={(e) => setTasteMood(e.target.value)}
                  style={{ ...inputStyle, paddingLeft: '14px', background: '#1F1108' }}
                >
                  {TASTE_MOODS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  marginTop: '6px',
                  padding: '14px',
                  borderRadius: '9999px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 900,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#1A120B',
                  background: 'linear-gradient(135deg, #EBC593 0%, #D4A373 60%, #B9824F 100%)',
                }}
              >
                {loading ? 'Sending Verification Code...' : 'Send Verification OTP'}
              </button>
            </form>
          )}

          {mode === 'signup' && !signupComplete && signupStep === 'otp' && (
            <form onSubmit={handleVerifyAndRegister} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                required
                placeholder="Enter 6-Digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                style={{
                  ...inputStyle,
                  paddingLeft: '16px',
                  textAlign: 'center',
                  fontSize: '22px',
                  fontWeight: 900,
                  letterSpacing: '0.35em',
                }}
              />

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                style={{
                  padding: '14px',
                  borderRadius: '9999px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 900,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#1A120B',
                  background: 'linear-gradient(135deg, #EBC593 0%, #D4A373 60%, #B9824F 100%)',
                }}
              >
                {loading ? 'Verifying & Creating Account...' : 'Verify OTP & Complete Signup'}
              </button>

              <button
                type="button"
                onClick={() => setSignupStep('details')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#EBC593',
                  fontSize: '12px',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                Change email or resend OTP
              </button>
            </form>
          )}

          {mode === 'login' && (
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '14px', top: '15px', color: '#D4A373' }} />
                <input
                  type="email"
                  required
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '14px', top: '15px', color: '#D4A373' }} />
                <input
                  type="password"
                  required
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={inputStyle}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  marginTop: '6px',
                  padding: '14px',
                  borderRadius: '9999px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 900,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#1A120B',
                  background: 'linear-gradient(135deg, #EBC593 0%, #D4A373 60%, #B9824F 100%)',
                }}
              >
                {loading ? 'Signing In...' : 'Log In to Mèlti'}
              </button>
            </form>
          )}

          <div
            style={{
              marginTop: '20px',
              textAlign: 'center',
              fontSize: '11px',
              color: 'rgba(235, 197, 147, 0.65)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <Sparkles size={13} style={{ color: '#D4A373' }} />
            Verified members unlock 15% off with FIRSTPOUR15
          </div>
        </div>
      </div>
    </div>
  );
}