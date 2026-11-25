// app/components/common/SunHorizonToggle.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/app/context/ThemeContext';

const STARS = [
  { id: 1, cx: 16, cy: 10, r: 1.15 },
  { id: 2, cx: 28, cy: 7, r: 0.95 },
  { id: 3, cx: 51, cy: 11, r: 1.1 },
];

export default function SunHorizonToggle() {
  const { isLight, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isLight ? 'Switch to dark cocoa mode' : 'Switch to warm latte light mode'}
      title={isLight ? 'Sunset: Switch to Dark Mode' : 'Sunrise: Switch to Light Mode'}
      style={{
        position: 'relative',
        width: '68px',
        height: '34px',
        padding: 0,
        borderRadius: '9999px',
        border: isLight
          ? '1.5px solid rgba(140, 83, 39, 0.42)'
          : '1.5px solid rgba(235, 197, 147, 0.35)',
        overflow: 'hidden',
        cursor: 'pointer',
        background: 'transparent',
        boxShadow: isLight
          ? '0 4px 14px rgba(184, 115, 51, 0.22)'
          : '0 4px 14px rgba(0, 0, 0, 0.45)',
        flexShrink: 0,
      }}
    >
      {/* Animated Sky Backdrop */}
      <motion.div
        animate={{
          background: isLight
            ? 'linear-gradient(180deg, #F6DFC0 0%, #FFF7EB 72%)'
            : 'linear-gradient(180deg, #130A05 0%, #2B170D 78%)',
        }}
        transition={{ duration: 0.55, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          inset: 0,
        }}
      />

      {/* Horizon Scene SVG */}
      <svg
        viewBox="0 0 68 34"
        width="68"
        height="34"
        style={{ position: 'relative', display: 'block', zIndex: 1 }}
      >
        <defs>
          <radialGradient id="meltiSunGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFE4A3" stopOpacity="0.9" />
            <stop offset="55%" stopColor="#E69A4C" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#C86D51" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="meltiSunDisc" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFF0C2" />
            <stop offset="55%" stopColor="#EBC593" />
            <stop offset="100%" stopColor="#C86D51" />
          </linearGradient>
        </defs>

        {/* Twinkling Night Stars (visible when sun is set) */}
        {STARS.map((star) => (
          <motion.circle
            key={star.id}
            cx={star.cx}
            cy={star.cy}
            r={star.r}
            fill="#FFF8F0"
            animate={{
              opacity: isLight ? 0 : 0.85,
              y: isLight ? -6 : 0,
              scale: isLight ? 0.4 : 1,
            }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        ))}

        {/* Rising / Setting Sun Group */}
        <motion.g
          animate={{
            y: isLight ? 0 : 19,
            scale: isLight ? 1 : 0.78,
          }}
          transition={{
            type: 'spring',
            stiffness: 180,
            damping: 20,
          }}
          style={{ transformOrigin: '34px 13px' }}
        >
          {/* Ambient Sun Aura */}
          <motion.circle
            cx="34"
            cy="13"
            r="15"
            fill="url(#meltiSunGlow)"
            animate={{ opacity: isLight ? 1 : 0.25 }}
            transition={{ duration: 0.45 }}
          />

          {/* Subtle Rotating Sunbeams */}
          <motion.g
            animate={{
              rotate: isLight ? 45 : 0,
              opacity: isLight ? 0.9 : 0,
            }}
            transition={{ duration: 0.65, ease: 'easeOut' }}
            style={{ transformOrigin: '34px 13px' }}
            stroke="#D98A3C"
            strokeWidth="1.4"
            strokeLinecap="round"
          >
            <line x1="34" y1="2.5" x2="34" y2="4.5" />
            <line x1="23.5" y1="13" x2="25.5" y2="13" />
            <line x1="42.5" y1="13" x2="44.5" y2="13" />
            <line x1="26.5" y1="5.5" x2="28" y2="7" />
            <line x1="41.5" y1="5.5" x2="40" y2="7" />
          </motion.g>

          {/* Sun Disc */}
          <circle cx="34" cy="13" r="6.8" fill="url(#meltiSunDisc)" />
        </motion.g>

        {/* Foreground Curved Cocoa Horizon Ridge (clips the setting sun below it) */}
        <motion.path
          d="M-2 26 Q 34 19 70 26 L 70 36 L -2 36 Z"
          animate={{
            fill: isLight ? '#8C5327' : '#1E1109',
          }}
          transition={{ duration: 0.5 }}
        />

        {/* Warm Rim Highlight Along the Horizon Line */}
        <motion.path
          d="M-2 26 Q 34 19 70 26"
          fill="none"
          strokeWidth="1.2"
          animate={{
            stroke: isLight
              ? 'rgba(255, 240, 194, 0.85)'
              : 'rgba(200, 109, 81, 0.55)',
          }}
          transition={{ duration: 0.5 }}
        />
      </svg>
    </button>
  );
}