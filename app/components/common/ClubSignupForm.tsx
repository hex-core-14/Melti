// app/components/common/ClubSignupForm.tsx
'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { buildPersonalizedSurveyUrl } from '@/lib/brevo';

interface ClubSignupFormProps {
  /** Show optional First Name input alongside Email */
  showFirstName?: boolean;
  /** Compact inline layout (e.g., Footer) vs stacked card/modal layout */
  compact?: boolean;
  onSuccess?: (email: string) => void;
}

const CREAM = '#FFF8F0';
const COCOA = '#1A120B';
const GOLD = '#D4A373';
const GOLD_LIGHT = '#EBC593';

export default function ClubSignupForm({
  showFirstName = true,
  compact = false,
  onSuccess,
}: ClubSignupFormProps) {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setFeedback('');

    const cleanEmail = email.trim();

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          firstName: firstName.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus('error');
        setFeedback(data.error || 'Unable to sign up. Please try again.');
        return;
      }

      setSubmittedEmail(cleanEmail);
      setStatus('success');
      setFeedback(
        data.message || 'Check your inbox for your welcome note & taste survey'
      );
      onSuccess?.(cleanEmail);
      setFirstName('');
      setEmail('');
    } catch {
      setStatus('error');
      setFeedback('Network error. Please check your connection and retry.');
    }
  };

  if (status === 'success') {
    const questUrl = buildPersonalizedSurveyUrl(submittedEmail);

    return (
      <div
        role="status"
        style={{
          padding: '18px 20px',
          borderRadius: '18px',
          background: 'linear-gradient(160deg, #24140C 0%, #150C07 100%)',
          border: '1px solid rgba(235, 197, 147, 0.45)',
          color: CREAM,
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
          boxShadow: '0 16px 36px rgba(0, 0, 0, 0.45)',
        }}
      >
        <CheckCircle2
          size={22}
          style={{ color: GOLD_LIGHT, flexShrink: 0, marginTop: '2px' }}
        />
        <div>
          <div style={{ fontSize: '14px', fontWeight: 800, color: GOLD_LIGHT }}>
            {feedback}
          </div>
          <div
            style={{
              marginTop: '10px',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <a
              href={questUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '7px 14px',
                borderRadius: '9999px',
                background: `linear-gradient(135deg, ${GOLD_LIGHT} 0%, ${GOLD} 100%)`,
                color: COCOA,
                fontSize: '11.5px',
                fontWeight: 900,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                textDecoration: 'none',
              }}
            >
              Play 2-Min Cocoa Quest <ExternalLink size={12} />
            </a>

            <button
              type="button"
              onClick={() => {
                setStatus('idle');
                setFeedback('');
                setSubmittedEmail('');
              }}
              style={{
                padding: 0,
                border: 'none',
                background: 'transparent',
                color: 'rgba(255, 248, 240, 0.65)',
                fontSize: '11.5px',
                textDecoration: 'underline',
                cursor: 'pointer',
              }}
            >
              Add another email
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        width: '100%',
        padding: compact ? '0' : '24px',
        borderRadius: compact ? '0' : '24px',
        background: compact
          ? 'transparent'
          : 'linear-gradient(160deg, #24140C 0%, #150C07 100%)',
        border: compact ? 'none' : '1px solid rgba(212, 163, 115, 0.25)',
        boxShadow: compact ? 'none' : '0 22px 48px rgba(0, 0, 0, 0.5)',
      }}
    >
      {!compact && (
        <div style={{ marginBottom: '16px' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 11px',
              borderRadius: '9999px',
              background: 'rgba(212, 163, 115, 0.12)',
              border: '1px solid rgba(212, 163, 115, 0.28)',
              color: GOLD_LIGHT,
              fontSize: '10px',
              fontWeight: 800,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}
          >
            <Sparkles size={11} /> Midnight Pour Club
          </span>
          <h3
            style={{
              margin: '10px 0 4px',
              fontSize: '20px',
              fontWeight: 900,
              color: CREAM,
            }}
          >
            Unlock Your MÈLTI Welcome Reward
          </h3>
          <p
            style={{
              margin: 0,
              fontSize: '13px',
              lineHeight: 1.55,
              color: 'rgba(235, 197, 147, 0.76)',
            }}
          >
            Join for small-batch 32% cocoa drops and play our 2-minute
            interactive hot chocolate quest (5 quick questions) to unlock your
            welcome treat.
          </p>
        </div>
      )}

      <div
        style={{
          display: 'flex',
          flexDirection: compact ? 'row' : 'column',
          flexWrap: 'wrap',
          gap: '10px',
        }}
      >
        {showFirstName && (
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First name (optional)"
            disabled={status === 'loading'}
            style={{
              flex: compact ? '1 1 150px' : '1 1 auto',
              padding: '12px 14px',
              borderRadius: '12px',
              background: 'rgba(255, 248, 240, 0.05)',
              border: '1px solid rgba(212, 163, 115, 0.26)',
              color: CREAM,
              fontSize: '13.5px',
              outline: 'none',
            }}
          />
        )}

        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email address"
          disabled={status === 'loading'}
          style={{
            flex: compact ? '1 1 220px' : '1 1 auto',
            padding: '12px 14px',
            borderRadius: '12px',
            background: 'rgba(255, 248, 240, 0.05)',
            border: '1px solid rgba(212, 163, 115, 0.26)',
            color: CREAM,
            fontSize: '13.5px',
            outline: 'none',
          }}
        />

        <button
          type="submit"
          disabled={status === 'loading'}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '7px',
            padding: '13px 22px',
            borderRadius: '9999px',
            border: 'none',
            cursor: status === 'loading' ? 'not-allowed' : 'pointer',
            opacity: status === 'loading' ? 0.65 : 1,
            fontSize: '12px',
            fontWeight: 900,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: COCOA,
            background: `linear-gradient(135deg, ${GOLD_LIGHT} 0%, ${GOLD} 60%, #B9824F 100%)`,
            boxShadow: '0 8px 22px rgba(212, 163, 115, 0.28)',
          }}
        >
          {status === 'loading' ? (
            'Joining...'
          ) : (
            <>
              Join &amp; Start Quest <ArrowRight size={14} />
            </>
          )}
        </button>
      </div>

      {status === 'error' && feedback && (
        <div
          role="alert"
          style={{
            marginTop: '10px',
            padding: '9px 12px',
            borderRadius: '10px',
            background: 'rgba(200, 109, 81, 0.18)',
            border: '1px solid rgba(200, 109, 81, 0.45)',
            color: '#F6B8A6',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
          }}
        >
          <AlertCircle size={14} style={{ flexShrink: 0 }} />
          <span>{feedback}</span>
        </div>
      )}
    </form>
  );
}