// app/components/orders/PourAccomplishmentHero.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RotateCcw, Award } from 'lucide-react';

interface PourAccomplishmentHeroProps {
  orderId: string;
  customerName?: string;
}

const CREAM = '#FFF8F0';
const GOLD = '#D4A373';
const GOLD_LIGHT = '#EBC593';
const TERRACOTTA = '#C86D51';

const CONFETTI_PARTICLES = [
  { id: 1, x: -115, y: -68, size: 8, color: GOLD_LIGHT, delay: 0 },
  { id: 2, x: 118, y: -62, size: 9, color: TERRACOTTA, delay: 0.05 },
  { id: 3, x: -88, y: -102, size: 6, color: CREAM, delay: 0.1 },
  { id: 4, x: 92, y: -98, size: 7, color: GOLD, delay: 0.08 },
  { id: 5, x: -132, y: -18, size: 7, color: TERRACOTTA, delay: 0.12 },
  { id: 6, x: 134, y: -22, size: 8, color: GOLD_LIGHT, delay: 0.04 },
  { id: 7, x: -54, y: -116, size: 6, color: GOLD_LIGHT, delay: 0.15 },
  { id: 8, x: 58, y: -114, size: 6, color: CREAM, delay: 0.14 },
];

export default function PourAccomplishmentHero({
  orderId,
  customerName,
}: PourAccomplishmentHeroProps) {
  // Stage 0: Stressed & sad -> Stage 1: Steaming Mèlti mug arrives -> Stage 2: Beaming & rewarded
  const [stage, setStage] = useState<0 | 1 | 2>(0);
  const [playCount, setPlayCount] = useState(0);

  useEffect(() => {
    setStage(0);
    const t1 = setTimeout(() => setStage(1), 1150);
    const t2 = setTimeout(() => setStage(2), 2200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [playCount]);

  const firstName = customerName?.trim().split(' ')[0] || 'Friend';
  const isHappy = stage === 2;
  const hasMug = stage >= 1;

  const stageCaption =
    stage === 0
      ? 'Long day. Low battery. Stress levels creeping up...'
      : stage === 1
      ? 'Hold on—32% real melted couverture incoming...'
      : `Good call, ${firstName}. You just chose real self-care.`;

  return (
    <div style={{ textAlign: 'center', position: 'relative' }}>
      {/* Top Order & Self-Care Pill */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '7px',
          padding: '6px 14px',
          borderRadius: '9999px',
          background: isHappy
            ? 'rgba(212, 163, 115, 0.2)'
            : 'rgba(255, 248, 240, 0.06)',
          border: isHappy
            ? '1px solid rgba(235, 197, 147, 0.55)'
            : '1px solid rgba(212, 163, 115, 0.25)',
          color: isHappy ? GOLD_LIGHT : 'rgba(235, 197, 147, 0.78)',
          fontSize: '10.5px',
          fontWeight: 800,
          letterSpacing: '0.13em',
          textTransform: 'uppercase',
          transition: 'all 0.4s ease',
        }}
      >
        <Sparkles size={12} style={{ color: TERRACOTTA }} />
        Order Confirmed • {orderId}
      </div>

      {/* Animated Character Stage */}
      <div
        style={{
          position: 'relative',
          width: '260px',
          height: '205px',
          margin: '16px auto 6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Warm Ambient Aura Glow (expands when happy) */}
        <motion.div
          animate={{
            scale: isHappy ? [0.95, 1.12, 1.05] : 0.72,
            opacity: isHappy ? 0.9 : 0.2,
          }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            width: '175px',
            height: '175px',
            borderRadius: '9999px',
            background:
              'radial-gradient(circle, rgba(235, 197, 147, 0.34) 0%, rgba(200, 109, 81, 0.14) 52%, transparent 74%)',
            pointerEvents: 'none',
          }}
        />

        {/* Golden Sparkle Confetti Burst on Stage 2 */}
        <AnimatePresence>
          {isHappy &&
            CONFETTI_PARTICLES.map((p) => (
              <motion.span
                key={`${playCount}-${p.id}`}
                initial={{ opacity: 0, x: 0, y: 10, scale: 0.2 }}
                animate={{
                  opacity: [0, 1, 1, 0],
                  x: p.x,
                  y: p.y,
                  scale: [0.4, 1.2, 0.9],
                }}
                transition={{
                  duration: 1.5,
                  delay: p.delay,
                  ease: 'easeOut',
                }}
                style={{
                  position: 'absolute',
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  borderRadius: p.id % 2 === 0 ? '9999px' : '2px',
                  rotate: '45deg',
                  backgroundColor: p.color,
                  boxShadow: `0 0 10px ${p.color}`,
                  pointerEvents: 'none',
                }}
              />
            ))}
        </AnimatePresence>

        {/* Expressive Vector Character SVG */}
        <svg
          viewBox="0 0 240 200"
          width="240"
          height="200"
          style={{ overflow: 'visible', zIndex: 2 }}
          aria-label="Character feeling stressed then becoming joyful with a mug of Melti hot chocolate"
        >
          {/* Stage 0: Little Storm / Stress Cloud above head */}
          <AnimatePresence>
            {stage === 0 && (
              <motion.g
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: [0, -3, 0] }}
                exit={{ opacity: 0, y: -14, scale: 0.7 }}
                transition={{ duration: 0.45 }}
              >
                <path
                  d="M96 26 C96 19, 105 16, 111 20 C115 14, 127 15, 130 22 C137 22, 141 28, 137 34 L98 34 C92 34, 91 27, 96 26 Z"
                  fill="#6E6259"
                  opacity="0.85"
                />
                {/* Tiny rain drops */}
                <line
                  x1="106"
                  y1="38"
                  x2="104"
                  y2="45"
                  stroke="#9C8F86"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <line
                  x1="118"
                  y1="38"
                  x2="116"
                  y2="45"
                  stroke="#9C8F86"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <line
                  x1="129"
                  y1="38"
                  x2="127"
                  y2="45"
                  stroke="#9C8F86"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </motion.g>
            )}
          </AnimatePresence>

          {/* Character Body & Head Group (perks up when happy) */}
          <motion.g
            animate={{
              y: isHappy ? -5 : stage === 1 ? -2 : 4,
              rotate: isHappy ? [0, -2.5, 2.5, 0] : 0,
            }}
            transition={{
              y: { type: 'spring', stiffness: 260, damping: 18 },
              rotate: { duration: 0.5, ease: 'easeInOut' },
            }}
          >
            {/* Cozy Sweater Torso */}
            <path
              d="M66 176 C66 142, 88 128, 120 128 C152 128, 174 142, 174 176 Z"
              fill={isHappy ? '#3D2214' : '#261811'}
              stroke={isHappy ? GOLD : '#4A3528'}
              strokeWidth="2.5"
            />
            {/* Sweater Collar */}
            <path
              d="M104 129 Q120 142 136 129"
              fill="none"
              stroke={GOLD_LIGHT}
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Neck */}
            <rect
              x="111"
              y="112"
              width="18"
              height="20"
              rx="8"
              fill="#F2C6A0"
            />

            {/* Head */}
            <circle
              cx="120"
              cy="84"
              r="34"
              fill="#F7CFA9"
              stroke={isHappy ? GOLD_LIGHT : '#8C6D56'}
              strokeWidth="2"
            />

            {/* Stylish Messy Hair */}
            <path
              d="M86 80 C84 54, 104 42, 123 44 C142 45, 156 57, 154 80 C150 67, 141 61, 129 61 C116 61, 108 66, 98 64 C92 63, 88 70, 86 80 Z"
              fill="#24130B"
            />

            {/* Rosy Warm Cheeks (appear when mug arrives & happy) */}
            <motion.circle
              cx="99"
              cy="92"
              r="5.5"
              fill={TERRACOTTA}
              animate={{ opacity: isHappy ? 0.55 : hasMug ? 0.28 : 0 }}
            />
            <motion.circle
              cx="141"
              cy="92"
              r="5.5"
              fill={TERRACOTTA}
              animate={{ opacity: isHappy ? 0.55 : hasMug ? 0.28 : 0 }}
            />

            {/* Eyebrows */}
            {isHappy ? (
              <>
                <path
                  d="M98 70 Q105 65 112 70"
                  fill="none"
                  stroke="#24130B"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  d="M128 70 Q135 65 142 70"
                  fill="none"
                  stroke="#24130B"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </>
            ) : (
              <>
                {/* Tired slanted eyebrows */}
                <line
                  x1="98"
                  y1="73"
                  x2="112"
                  y2="69"
                  stroke="#24130B"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <line
                  x1="142"
                  y1="73"
                  x2="128"
                  y2="69"
                  stroke="#24130B"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </>
            )}

            {/* Eyes */}
            {isHappy ? (
              <>
                {/* Joyful curved happy eyes ^ ^ */}
                <path
                  d="M99 83 Q105 75 111 83"
                  fill="none"
                  stroke="#24130B"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <path
                  d="M129 83 Q135 75 141 83"
                  fill="none"
                  stroke="#24130B"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </>
            ) : (
              <>
                {/* Tired droopy eyes */}
                <circle cx="105" cy="82" r="3.2" fill="#24130B" />
                <circle cx="135" cy="82" r="3.2" fill="#24130B" />
                <line
                  x1="99"
                  y1="79"
                  x2="111"
                  y2="80"
                  stroke="#F7CFA9"
                  strokeWidth="2.5"
                />
                <line
                  x1="129"
                  y1="80"
                  x2="141"
                  y2="79"
                  stroke="#F7CFA9"
                  strokeWidth="2.5"
                />
              </>
            )}

            {/* Mouth: Sad frown -> Surprised "o" -> Big joyful smile */}
            {stage === 0 && (
              <path
                d="M110 102 Q120 94 130 102"
                fill="none"
                stroke="#24130B"
                strokeWidth="2.8"
                strokeLinecap="round"
              />
            )}
            {stage === 1 && (
              <circle
                cx="120"
                cy="99"
                r="4.5"
                fill="#5A281A"
                stroke="#24130B"
                strokeWidth="2"
              />
            )}
            {stage === 2 && (
              <path
                d="M107 95 Q120 110 133 95 Z"
                fill="#FFF8F0"
                stroke="#24130B"
                strokeWidth="2.4"
                strokeLinejoin="round"
              />
            )}
          </motion.g>

          {/* Steaming MÈLTI Hot Chocolate Mug (glides up in Stage 1 & 2) */}
          <AnimatePresence>
            {hasMug && (
              <motion.g
                initial={{ opacity: 0, y: 34, scale: 0.75 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 280, damping: 20 }}
              >
                {/* Rising Cocoa Steam Waves */}
                <motion.path
                  d="M111 124 Q107 116 111 109"
                  fill="none"
                  stroke={GOLD_LIGHT}
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  animate={{ y: [-1, -6, -1], opacity: [0.35, 0.95, 0.35] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.path
                  d="M121 122 Q125 114 121 107"
                  fill="none"
                  stroke={CREAM}
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  animate={{ y: [-2, -7, -2], opacity: [0.4, 1, 0.4] }}
                  transition={{
                    duration: 2.1,
                    delay: 0.3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
                <motion.path
                  d="M130 124 Q126 116 130 109"
                  fill="none"
                  stroke={GOLD_LIGHT}
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  animate={{ y: [-1, -6, -1], opacity: [0.35, 0.95, 0.35] }}
                  transition={{
                    duration: 1.9,
                    delay: 0.6,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />

                {/* Mug Handle */}
                <path
                  d="M141 139 C152 139, 152 157, 141 157"
                  fill="none"
                  stroke={GOLD_LIGHT}
                  strokeWidth="4"
                  strokeLinecap="round"
                />

                {/* Ceramic Mug Body */}
                <rect
                  x="98"
                  y="132"
                  width="44"
                  height="34"
                  rx="8"
                  fill={TERRACOTTA}
                  stroke={GOLD_LIGHT}
                  strokeWidth="2"
                />

                {/* Rich Melted 32% Chocolate Rim */}
                <ellipse cx="120" cy="134" rx="19" ry="4" fill="#36180C" />

                {/* Tiny Mèlti Heart on Mug */}
                <text
                  x="120"
                  y="154"
                  textAnchor="middle"
                  fill={CREAM}
                  fontSize="11"
                  fontWeight="900"
                >
                  ♥
                </text>

                {/* Cute Hands Holding the Mug */}
                <circle
                  cx="98"
                  cy="151"
                  r="6.5"
                  fill="#F7CFA9"
                  stroke="#24130B"
                  strokeWidth="1.8"
                />
                <circle
                  cx="142"
                  cy="151"
                  r="6.5"
                  fill="#F7CFA9"
                  stroke="#24130B"
                  strokeWidth="1.8"
                />
              </motion.g>
            )}
          </AnimatePresence>
        </svg>

        {/* Floating "Self-Care Unlocked" Reward Badge */}
        <AnimatePresence>
          {isHappy && (
            <motion.div
              initial={{ opacity: 0, scale: 0.6, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 18 }}
              style={{
                position: 'absolute',
                bottom: '4px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 13px',
                borderRadius: '9999px',
                background: 'linear-gradient(135deg, #EBC593, #D4A373)',
                color: '#1A120B',
                fontSize: '10.5px',
                fontWeight: 900,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                boxShadow: '0 8px 20px rgba(212, 163, 115, 0.45)',
                zIndex: 4,
              }}
            >
              <Award size={13} /> Velvet Ritual Unlocked
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Animated Transition Caption */}
      <div style={{ minHeight: '24px', marginTop: '6px' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={stage}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            style={{
              fontSize: '13px',
              fontWeight: 800,
              color: isHappy ? GOLD_LIGHT : 'rgba(255, 248, 240, 0.72)',
              letterSpacing: '0.02em',
            }}
          >
            {stageCaption}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Main Accomplishment Headline */}
      <motion.h1
        animate={{ scale: isHappy ? [0.98, 1.02, 1] : 1 }}
        transition={{ duration: 0.4 }}
        style={{
          margin: '10px 0 8px',
          fontSize: 'clamp(24px, 3.8vw, 34px)',
          fontWeight: 900,
          lineHeight: 1.2,
          color: CREAM,
        }}
      >
        You Did Something Great for Yourself Today.
      </motion.h1>

      <p
        style={{
          margin: '0 auto',
          maxWidth: '500px',
          fontSize: '14px',
          lineHeight: 1.6,
          color: 'rgba(235, 197, 147, 0.8)',
        }}
      >
        Slow down—your <strong style={{ color: CREAM }}>32% real cocoa</strong>{' '}
        pour is officially locked in. Every velvety sip is worth the pause.
      </p>

      {/* Subtle Demo Replay Trigger */}
      <button
        type="button"
        onClick={() => setPlayCount((c) => c + 1)}
        style={{
          marginTop: '14px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          padding: '6px 12px',
          borderRadius: '9999px',
          border: '1px solid rgba(212, 163, 115, 0.24)',
          background: 'rgba(255, 248, 240, 0.03)',
          color: 'rgba(235, 197, 147, 0.72)',
          fontSize: '11px',
          fontWeight: 700,
          cursor: 'pointer',
        }}
      >
        <RotateCcw size={11} /> Replay Mood Shift
      </button>
    </div>
  );
}