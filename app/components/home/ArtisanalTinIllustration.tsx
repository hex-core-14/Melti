// app/components/home/ArtisanalTinIllustration.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface TinProps {
  cocoaPercent: string;
  accentColor: string;
  labelTint: string;
  categoryLabel: string;
  isHovered: boolean;
}

export default function ArtisanalTinIllustration({
  cocoaPercent,
  accentColor,
  labelTint,
  categoryLabel,
  isHovered,
}: TinProps) {
  return (
    <div
      style={{
        position: 'relative',
        width: '210px',
        height: '240px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
      }}
    >
      {/* Radial Spotlight Glow behind the tin */}
      <motion.div
        animate={{
          scale: isHovered ? 1.18 : 1,
          opacity: isHovered ? 0.55 : 0.32,
        }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        style={{
          position: 'absolute',
          width: '175px',
          height: '175px',
          borderRadius: '9999px',
          background: `radial-gradient(circle, ${accentColor} 0%, transparent 72%)`,
          filter: 'blur(18px)',
          pointerEvents: 'none',
        }}
      />

      {/* Floating Cocoa Nibs & Chocolate Chunks */}
      <motion.svg
        width="210"
        height="240"
        viewBox="0 0 210 240"
        style={{ position: 'absolute', inset: 0, overflow: 'visible', pointerEvents: 'none' }}
      >
        {/* Top-left floating cocoa chunk */}
        <motion.g
          animate={{
            y: isHovered ? -10 : 0,
            x: isHovered ? -6 : 0,
            rotate: isHovered ? -14 : -4,
          }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{ transformOrigin: '36px 56px' }}
        >
          <polygon points="28,46 44,42 48,58 32,64" fill="#3B1E0A" stroke="#D4A373" strokeWidth="1" />
          <polygon points="28,46 44,42 39,52 26,54" fill="#5C3012" />
        </motion.g>

        {/* Top-right floating gold sparkle / nib */}
        <motion.g
          animate={{
            y: isHovered ? -12 : 0,
            x: isHovered ? 7 : 0,
            rotate: isHovered ? 18 : 6,
          }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          style={{ transformOrigin: '174px 66px' }}
        >
          <ellipse cx="174" cy="66" rx="8" ry="5" fill="#4A250C" stroke="#EBC593" strokeWidth="1" />
          <path d="M168 66 Q174 63 180 66" stroke="#D4A373" strokeWidth="0.9" fill="none" />
        </motion.g>

        {/* Bottom-left cocoa bean */}
        <motion.g
          animate={{
            y: isHovered ? 6 : 0,
            x: isHovered ? -8 : 0,
            rotate: isHovered ? -12 : 0,
          }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <ellipse cx="32" cy="176" rx="9" ry="5.5" transform="rotate(-28 32 176)" fill="#582F0E" stroke="#D4A373" strokeWidth="0.9" />
        </motion.g>

        {/* Bottom-right square chocolate shard */}
        <motion.g
          animate={{
            y: isHovered ? 8 : 0,
            x: isHovered ? 6 : 0,
            rotate: isHovered ? 15 : 5,
          }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <rect x="166" y="164" width="14" height="14" rx="2.5" fill="#3D1F0A" stroke={accentColor} strokeWidth="1.1" />
        </motion.g>
      </motion.svg>

      {/* Main Artisanal Tin SVG */}
      <motion.svg
        width="148"
        height="196"
        viewBox="0 0 148 196"
        animate={{
          y: isHovered ? -6 : 0,
          rotate: isHovered ? -1.5 : 0,
        }}
        transition={{ type: 'spring', stiffness: 220, damping: 18 }}
        style={{ position: 'relative', zIndex: 2, overflow: 'visible' }}
      >
        <defs>
          {/* Metallic Gold Lid Gradient */}
          <linearGradient id={`lid-grad-${cocoaPercent}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#A8743E" />
            <stop offset="28%" stopColor="#F4D3A1" />
            <stop offset="55%" stopColor="#D4A373" />
            <stop offset="85%" stopColor="#8C5B2B" />
            <stop offset="100%" stopColor="#B8834B" />
          </linearGradient>

          {/* Matte Dark Cocoa Body Gradient */}
          <linearGradient id={`body-grad-${cocoaPercent}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#1B0F08" />
            <stop offset="24%" stopColor="#382011" />
            <stop offset="65%" stopColor="#24140A" />
            <stop offset="100%" stopColor="#120904" />
          </linearGradient>

          {/* Parchment Label Gradient */}
          <linearGradient id={`label-grad-${cocoaPercent}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#E6D2BC" />
            <stop offset="30%" stopColor={labelTint} />
            <stop offset="75%" stopColor={labelTint} />
            <stop offset="100%" stopColor="#D9C1A7" />
          </linearGradient>
        </defs>

        {/* Ground Shadow */}
        <ellipse cx="74" cy="188" rx="54" ry="7" fill="rgba(0,0,0,0.55)" />

        {/* Tin Cylindrical Body */}
        <rect
          x="18"
          y="34"
          width="112"
          height="148"
          rx="12"
          fill={`url(#body-grad-${cocoaPercent})`}
          stroke="#D4A373"
          strokeOpacity="0.35"
          strokeWidth="1.2"
        />

        {/* Metallic Gold Lid */}
        <rect
          x="14"
          y="16"
          width="120"
          height="22"
          rx="6"
          fill={`url(#lid-grad-${cocoaPercent})`}
          stroke="#582F0E"
          strokeWidth="1.2"
        />
        {/* Lid Rim Highlight */}
        <line x1="20" y1="20" x2="128" y2="20" stroke="#FFF8F0" strokeOpacity="0.55" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="15" y1="33" x2="133" y2="33" stroke="#3B1E0A" strokeOpacity="0.6" strokeWidth="1.5" />

        {/* Wrap-around Artisanal Label */}
        <rect
          x="19"
          y="56"
          width="110"
          height="104"
          fill={`url(#label-grad-${cocoaPercent})`}
        />

        {/* Melted Chocolate Drip Border along Top of Label */}
        <path
          d="M 19 56 H 129 V 66 C 122 66, 121 76, 115 76 C 109 76, 108 64, 101 64 C 94 64, 93 81, 86 81 C 79 81, 78 65, 71 65 C 64 65, 63 74, 56 74 C 49 74, 48 63, 41 63 C 34 63, 33 72, 26 72 C 22 72, 20 67, 19 66 Z"
          fill={accentColor}
        />

        {/* Brand Header on Label */}
        <text
          x="74"
          y="98"
          textAnchor="middle"
          fontSize="15"
          fontWeight="900"
          letterSpacing="2.5"
          fill="#1A120B"
        >
          MÈLTI.
        </text>

        {/* Category Subtitle */}
        <text
          x="74"
          y="111"
          textAnchor="middle"
          fontSize="6.5"
          fontWeight="800"
          letterSpacing="1.6"
          fill="#8C3002"
        >
          {categoryLabel.toUpperCase()}
        </text>

        {/* Divider Line */}
        <line x1="42" y1="118" x2="106" y2="118" stroke="#582F0E" strokeOpacity="0.3" strokeWidth="1" />

        {/* Cocoa Percentage Stamp Medallion */}
        <circle
          cx="74"
          cy="138"
          r="15"
          fill="#1A120B"
          stroke={accentColor}
          strokeWidth="1.8"
        />
        <text
          x="74"
          y="141"
          textAnchor="middle"
          fontSize="9.5"
          fontWeight="900"
          fill="#FFF8F0"
        >
          {cocoaPercent}
        </text>

        {/* Vertical Specular Glass/Metal Reflection across Tin */}
        <rect
          x="28"
          y="38"
          width="10"
          height="140"
          rx="5"
          fill="linear-gradient(180deg, rgba(255,255,255,0.16), rgba(255,255,255,0.02))"
          opacity="0.14"
        />
      </motion.svg>
    </div>
  );
}