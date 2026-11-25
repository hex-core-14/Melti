  // app/components/home/WhyMelti.tsx
  'use client';

  import React, { useState } from 'react';
  import { motion, AnimatePresence } from 'framer-motion';
  import { Sparkles, Check, X } from 'lucide-react';

  const CREAM = '#FFF8F0';
  const COCOA = '#1A120B';
  const COCOA_DEEP = '#120B06';
  const GOLD = '#D4A373';
  const GOLD_LIGHT = '#EBC593';
  const TERRACOTTA = '#C86D51';

  type ComparisonMode = 'melti' | 'powder';

  const COMPARISON_DATA: Record<
    ComparisonMode,
    {
      badge: string;
      headline: string;
      subtext: string;
      viscosity: number;
      cocoaButter: string;
      sugarShare: string;
      points: { text: string; positive: boolean }[];
    }
  > = {
    melti: {
      badge: 'Mèlti Artisanal Standard',
      headline: '100% Real Shaved Couverture Blocks',
      subtext:
        'We shave whole single-origin chocolate bars into delicate curls. When whisked into hot milk, natural cocoa butter emulsifies into a glossy, café-thick pour.',
      viscosity: 94,
      cocoaButter: '38% Natural Cocoa Butter',
      sugarShare: 'Unrefined Cane Sugar',
      points: [
        { text: 'Single-origin Idukki & Malabar cacao beans', positive: true },
        { text: 'Zero alkalized cocoa dust or starch thickeners', positive: true },
        { text: 'No hydrogenated palm oil or soy lecithin fillers', positive: true },
        { text: 'Melts cleanly in 60 seconds with rich crema', positive: true },
      ],
    },
    powder: {
      badge: 'Typical Supermarket Tin',
      headline: 'Defatted Cocoa Dust & Sugar Fillers',
      subtext:
        'Most instant mixes strip out valuable cocoa butter to sell separately, leaving behind chalky alkali-treated powder bulked up with refined sugar and gums.',
      viscosity: 28,
      cocoaButter: '< 10% Stripped Cocoa Fat',
      sugarShare: 'Up to 75% Refined Sugar',
      points: [
        { text: 'Heavy refined sugar & maltodextrin bulking', positive: false },
        { text: 'Xanthan gum & cornstarch to fake thickness', positive: false },
        { text: 'Artificial vanillin & synthetic chocolate flavour', positive: false },
        { text: 'Leaves a watery cup with gritty sediment at the bottom', positive: false },
      ],
    },
  };

  const WHY_MELTI_CSS = `
  .mwm-section {
    position: relative;
    padding: 116px 24px;
    background: linear-gradient(180deg, #0D0704 0%, ${COCOA} 48%, ${COCOA_DEEP} 100%);
    color: ${CREAM};
    overflow: hidden;
    border-top: 1px solid rgba(212, 163, 115, 0.14);
  }

  .mwm-glow-orb {
    position: absolute;
    width: 560px;
    height: 560px;
    border-radius: 9999px;
    background: radial-gradient(circle, rgba(200, 109, 81, 0.12) 0%, transparent 70%);
    top: 18%;
    left: 50%;
    transform: translateX(-50%);
    pointer-events: none;
  }

  .mwm-container {
    max-width: 1220px;
    margin: 0 auto;
    position: relative;
    z-index: 2;
  }

  .mwm-header {
    text-align: center;
    max-width: 700px;
    margin: 0 auto 56px;
  }

  .mwm-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 7px 16px;
    border-radius: 9999px;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: ${GOLD_LIGHT};
    background: rgba(212, 163, 115, 0.1);
    border: 1px solid rgba(212, 163, 115, 0.28);
    margin-bottom: 18px;
  }

  .mwm-title {
    font-size: clamp(34px, 5vw, 56px);
    font-weight: 900;
    line-height: 1.08;
    letter-spacing: -0.02em;
    color: ${CREAM};
    margin: 0;
  }

  .mwm-title-accent {
    background: linear-gradient(135deg, ${GOLD_LIGHT} 0%, ${GOLD} 55%, ${TERRACOTTA} 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .mwm-subtitle {
    margin-top: 16px;
    font-size: 16px;
    line-height: 1.65;
    color: rgba(235, 197, 147, 0.76);
    font-weight: 500;
  }

  /* ===== Interactive Cup Comparison Stage ===== */
  .mwm-lab-card {
    display: grid;
    grid-template-columns: 1.05fr 1.15fr;
    gap: 36px;
    align-items: center;
    padding: 36px;
    border-radius: 32px;
    background: linear-gradient(145deg, rgba(43, 22, 11, 0.78) 0%, rgba(18, 11, 6, 0.96) 100%);
    border: 1px solid rgba(212, 163, 115, 0.24);
    box-shadow: 0 28px 64px rgba(0, 0, 0, 0.55), inset 0 1px 0 rgba(255, 248, 240, 0.08);
    margin-bottom: 44px;
  }

  @media (max-width: 920px) {
    .mwm-lab-card {
      grid-template-columns: 1fr;
      padding: 24px;
    }
  }

  .mwm-visual-box {
    position: relative;
    border-radius: 24px;
    background: radial-gradient(circle at 50% 45%, rgba(212, 163, 115, 0.1) 0%, rgba(12, 7, 4, 0.85) 100%);
    border: 1px solid rgba(212, 163, 115, 0.16);
    padding: 24px 16px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .mwm-toggle-pill {
    display: inline-flex;
    padding: 4px;
    border-radius: 9999px;
    background: rgba(12, 7, 4, 0.9);
    border: 1px solid rgba(212, 163, 115, 0.25);
    margin-bottom: 18px;
  }

  .mwm-toggle-btn {
    padding: 9px 18px;
    border-radius: 9999px;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    border: none;
    cursor: pointer;
    background: transparent;
    color: rgba(255, 248, 240, 0.65);
    transition: all 0.25s ease;
  }

  .mwm-toggle-btn.active-melti {
    background: linear-gradient(135deg, ${GOLD_LIGHT} 0%, ${GOLD} 60%, #B9824F 100%);
    color: ${COCOA};
    box-shadow: 0 6px 18px rgba(212, 163, 115, 0.28);
  }

  .mwm-toggle-btn.active-powder {
    background: rgba(255, 248, 240, 0.14);
    color: ${CREAM};
  }

  .mwm-stat-pills {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px;
    margin-top: 14px;
  }

  .mwm-stat-chip {
    padding: 5px 12px;
    border-radius: 9999px;
    font-size: 11px;
    font-weight: 700;
    background: rgba(255, 248, 240, 0.05);
    border: 1px solid rgba(212, 163, 115, 0.2);
    color: ${GOLD_LIGHT};
  }

  .mwm-checklist {
    list-style: none;
    padding: 0;
    margin: 20px 0 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .mwm-check-item {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 14px;
    font-weight: 600;
    color: rgba(255, 248, 240, 0.88);
  }

  .mwm-check-icon {
    width: 24px;
    height: 24px;
    border-radius: 9999px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  /* ===== 4-Card Asymmetric Bento Grid ===== */
  .mwm-bento {
    display: grid;
    grid-template-columns: repeat(12, minmax(0, 1fr));
    gap: 24px;
  }

  .mwm-bento-wide {
    grid-column: span 7;
  }

  .mwm-bento-narrow {
    grid-column: span 5;
  }

  @media (max-width: 920px) {
    .mwm-bento-wide,
    .mwm-bento-narrow {
      grid-column: span 12;
    }
  }

  .mwm-bento-card {
    position: relative;
    padding: 30px;
    border-radius: 28px;
    background: linear-gradient(155deg, rgba(36, 20, 10, 0.86) 0%, rgba(18, 11, 6, 0.96) 100%);
    border: 1px solid rgba(212, 163, 115, 0.18);
    box-shadow: 0 20px 44px rgba(0, 0, 0, 0.42), inset 0 1px 0 rgba(255, 248, 240, 0.06);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 20px;
    overflow: hidden;
    transition: border-color 0.3s ease, transform 0.3s ease;
  }

  .mwm-bento-card:hover {
    border-color: rgba(212, 163, 115, 0.45);
  }

  .mwm-bento-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
  }

  .mwm-metric-tag {
    padding: 5px 12px;
    border-radius: 9999px;
    font-size: 10.5px;
    font-weight: 800;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: ${GOLD_LIGHT};
    background: rgba(212, 163, 115, 0.1);
    border: 1px solid rgba(212, 163, 115, 0.25);
    white-space: nowrap;
  }

  .mwm-card-heading {
    font-size: 22px;
    font-weight: 900;
    color: ${CREAM};
    margin: 14px 0 8px;
    letter-spacing: -0.01em;
  }

  .mwm-card-copy {
    font-size: 14px;
    line-height: 1.65;
    color: rgba(235, 197, 147, 0.74);
    margin: 0;
  }
  `;

  function PourComparisonIllustration({ mode }: { mode: ComparisonMode }) {
    const isMelti = mode === 'melti';

    return (
      <svg
        width="290"
        height="220"
        viewBox="0 0 290 220"
        style={{ overflow: 'visible', display: 'block' }}
        role="img"
        aria-label={isMelti ? 'Thick glossy Melti couverture pour' : 'Thin watery instant cocoa mix'}
      >
        <defs>
          <linearGradient id="mug-ceramic" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#26160C" />
            <stop offset="35%" stopColor="#3B2314" />
            <stop offset="100%" stopColor="#180D06" />
          </linearGradient>
          <linearGradient id="melti-velvet-liquid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6E3518" />
            <stop offset="50%" stopColor="#4A210D" />
            <stop offset="100%" stopColor="#2B1206" />
          </linearGradient>
          <linearGradient id="powder-watery-liquid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#9C7E69" />
            <stop offset="100%" stopColor="#6E5341" />
          </linearGradient>
        </defs>

        {/* Ambient Ground Shadow */}
        <ellipse cx="140" cy="202" rx="76" ry="9" fill="rgba(0,0,0,0.6)" />

        {/* Rising Steam Wisps */}
        <motion.path
          d="M 112 58 Q 104 42, 114 26 T 112 4"
          fill="none"
          stroke={GOLD_LIGHT}
          strokeWidth="2"
          strokeLinecap="round"
          animate={{ opacity: isMelti ? [0.2, 0.65, 0.2] : [0.05, 0.2, 0.05], y: [0, -6, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.path
          d="M 142 52 Q 150 36, 140 20 T 144 0"
          fill="none"
          stroke={GOLD_LIGHT}
          strokeWidth="2"
          strokeLinecap="round"
          animate={{ opacity: isMelti ? [0.25, 0.7, 0.25] : [0.05, 0.2, 0.05], y: [0, -8, 0] }}
          transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
        />
        <motion.path
          d="M 170 60 Q 162 44, 172 28 T 168 6"
          fill="none"
          stroke={GOLD_LIGHT}
          strokeWidth="2"
          strokeLinecap="round"
          animate={{ opacity: isMelti ? [0.2, 0.6, 0.2] : [0.05, 0.2, 0.05], y: [0, -5, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1.1 }}
        />

        {/* Mug Handle */}
        <path
          d="M 204 96 H 224 C 238 96, 246 106, 246 124 C 246 142, 238 152, 224 152 H 204"
          fill="none"
          stroke={GOLD}
          strokeWidth="9"
          strokeLinecap="round"
        />
        <path
          d="M 204 96 H 224 C 238 96, 246 106, 246 124 C 246 142, 238 152, 224 152 H 204"
          fill="none"
          stroke="#2B160B"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Mug Outer Body */}
        <path
          d="M 76 78 H 204 V 156 C 204 180, 184 196, 140 196 C 96 196, 76 180, 76 156 Z"
          fill="url(#mug-ceramic)"
          stroke={GOLD}
          strokeOpacity="0.45"
          strokeWidth="1.5"
        />

        {/* Cutaway Window Showing Liquid Texture Inside Mug */}
        <path
          d="M 88 94 H 192 V 152 C 192 170, 175 182, 140 182 C 105 182, 88 170, 88 152 Z"
          fill="#120904"
        />

        {/* Dynamic Liquid Fill */}
        <motion.path
          animate={{
            d: isMelti
              ? 'M 88 102 Q 114 96, 140 102 T 192 102 V 152 C 192 170, 175 182, 140 182 C 105 182, 88 170, 88 152 Z'
              : 'M 88 124 Q 114 123, 140 124 T 192 124 V 152 C 192 170, 175 182, 140 182 C 105 182, 88 170, 88 152 Z',
          }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          fill={isMelti ? 'url(#melti-velvet-liquid)' : 'url(#powder-watery-liquid)'}
        />

        {/* Glossy Crema Swirl (Melti) vs. Undissolved Powder Specks (Powder) */}
        {isMelti ? (
          <g>
            <path
              d="M 102 114 Q 124 109, 148 115 T 180 112"
              fill="none"
              stroke={GOLD_LIGHT}
              strokeOpacity="0.55"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <circle cx="116" cy="134" r="3.5" fill={GOLD} opacity="0.45" />
            <circle cx="158" cy="146" r="4.5" fill={GOLD} opacity="0.35" />
            <circle cx="134" cy="160" r="2.5" fill={GOLD_LIGHT} opacity="0.5" />
          </g>
        ) : (
          <g>
            {/* Floating white sugar/starch granules & bottom sludge */}
            <rect x="96" y="172" width="88" height="7" rx="3.5" fill="#4A3628" opacity="0.85" />
            <circle cx="108" cy="132" r="2" fill="#FFF8F0" opacity="0.6" />
            <circle cx="128" cy="144" r="1.8" fill="#FFF8F0" opacity="0.55" />
            <circle cx="154" cy="136" r="2.2" fill="#FFF8F0" opacity="0.6" />
            <circle cx="172" cy="152" r="1.6" fill="#FFF8F0" opacity="0.5" />
            <circle cx="140" cy="164" r="2" fill="#FFF8F0" opacity="0.55" />
          </g>
        )}

        {/* Mug Top Rim */}
        <ellipse
          cx="140"
          cy="78"
          rx="64"
          ry="10"
          fill="#241309"
          stroke={GOLD}
          strokeWidth="1.8"
        />
        <ellipse
          cx="140"
          cy="78"
          rx="56"
          ry="6.5"
          fill={isMelti ? '#5C2C14' : '#8A6C58'}
        />

        {/* Side Garnish: Shaved Chocolate Curls (Melti) vs. Powder Pile (Powder) */}
        {isMelti ? (
          <g>
            <path
              d="M 28 188 C 28 176, 46 174, 48 186 C 50 194, 34 196, 28 188 Z"
              fill="#4E2510"
              stroke={GOLD}
              strokeWidth="1.2"
            />
            <path
              d="M 46 192 C 48 180, 66 180, 66 192 C 66 198, 50 198, 46 192 Z"
              fill="#3B1A0A"
              stroke={GOLD_LIGHT}
              strokeWidth="1.2"
            />
          </g>
        ) : (
          <path
            d="M 26 196 Q 46 180, 66 196 Z"
            fill="#9E826E"
            stroke="rgba(255,248,240,0.25)"
            strokeWidth="1"
          />
        )}
      </svg>
    );
  }

  export default function WhyMelti() {
    const [mode, setMode] = useState<ComparisonMode>('melti');
    const active = COMPARISON_DATA[mode];

    return (
      <section id="why-melti" className="mwm-section">
        <style>{WHY_MELTI_CSS}</style>
        <div className="mwm-glow-orb" />

        <div className="mwm-container">
          {/* Section Header */}
          <div className="mwm-header">
            <div className="mwm-eyebrow">
              <Sparkles size={14} /> The Couverture Standard
            </div>
            <h2 className="mwm-title">
              Why Melti Hits <span className="mwm-title-accent">Different.</span>
            </h2>
            <p className="mwm-subtitle">
              Hot chocolate isn’t supposed to be sugary brown water. See what happens when you melt real single-origin couverture instead of instant powder.
            </p>
          </div>

          {/* Interactive Mug Comparison Stage */}
          <div className="mwm-lab-card">
            {/* Left Visual Stage */}
            <div className="mwm-visual-box">
              <div className="mwm-toggle-pill" role="tablist" aria-label="Compare Melti vs Regular Cocoa Powder">
                <button
                  role="tab"
                  aria-selected={mode === 'melti'}
                  onClick={() => setMode('melti')}
                  className={`mwm-toggle-btn ${mode === 'melti' ? 'active-melti' : ''}`}
                >
                  Mèlti Shavings
                </button>
                <button
                  role="tab"
                  aria-selected={mode === 'powder'}
                  onClick={() => setMode('powder')}
                  className={`mwm-toggle-btn ${mode === 'powder' ? 'active-powder' : ''}`}
                >
                  Regular Powder
                </button>
              </div>

              <PourComparisonIllustration mode={mode} />

              <div className="mwm-stat-pills">
                <span className="mwm-stat-chip">{active.cocoaButter}</span>
                <span className="mwm-stat-chip">{active.sugarShare}</span>
              </div>
            </div>

            {/* Right Comparison Breakdown */}
            <div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={mode}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <span
                    style={{
                      display: 'inline-block',
                      fontSize: '11px',
                      fontWeight: 800,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: mode === 'melti' ? GOLD_LIGHT : TERRACOTTA,
                      marginBottom: '8px',
                    }}
                  >
                    {active.badge}
                  </span>

                  <h3
                    style={{
                      fontSize: 'clamp(24px, 3vw, 32px)',
                      fontWeight: 900,
                      margin: 0,
                      lineHeight: 1.15,
                      color: CREAM,
                    }}
                  >
                    {active.headline}
                  </h3>

                  <p
                    style={{
                      marginTop: '12px',
                      fontSize: '14.5px',
                      lineHeight: 1.65,
                      color: 'rgba(255, 248, 240, 0.76)',
                    }}
                  >
                    {active.subtext}
                  </p>

                  {/* Pour Viscosity Meter */}
                  <div style={{ marginTop: '18px' }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '11px',
                        fontWeight: 800,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: GOLD_LIGHT,
                        marginBottom: '6px',
                      }}
                    >
                      <span>Cup Viscosity & Velvet Body</span>
                      <span>{active.viscosity}%</span>
                    </div>
                    <div
                      style={{
                        height: '7px',
                        borderRadius: '9999px',
                        background: 'rgba(255, 248, 240, 0.08)',
                        overflow: 'hidden',
                      }}
                    >
                      <motion.div
                        animate={{ width: `${active.viscosity}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        style={{
                          height: '100%',
                          borderRadius: '9999px',
                          background:
                            mode === 'melti'
                              ? `linear-gradient(90deg, ${GOLD}, ${GOLD_LIGHT})`
                              : 'rgba(255, 248, 240, 0.35)',
                        }}
                      />
                    </div>
                  </div>

                  {/* Comparison Checklist */}
                  <ul className="mwm-checklist">
                    {active.points.map((pt) => (
                      <li key={pt.text} className="mwm-check-item">
                        <span
                          className="mwm-check-icon"
                          style={{
                            background: pt.positive
                              ? 'rgba(212, 163, 115, 0.18)'
                              : 'rgba(200, 109, 81, 0.18)',
                            color: pt.positive ? GOLD_LIGHT : TERRACOTTA,
                            border: `1px solid ${
                              pt.positive ? 'rgba(212, 163, 115, 0.35)' : 'rgba(200, 109, 81, 0.35)'
                            }`,
                          }}
                        >
                          {pt.positive ? <Check size={14} strokeWidth={2.6} /> : <X size={14} strokeWidth={2.6} />}
                        </span>
                        <span>{pt.text}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* 4-Card Asymmetric Craft Bento Grid */}
          <div className="mwm-bento">
            {/* Card 1 (Wide): Shaved Couverture Blocks */}
            <motion.div
              whileHover={{ y: -5 }}
              transition={{ duration: 0.25 }}
              className="mwm-bento-card mwm-bento-wide"
            >
              <div className="mwm-bento-top">
                {/* Custom Chocolate Block & Shavings SVG */}
                <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                  <rect x="6" y="10" width="32" height="36" rx="6" fill="#3B1E0A" stroke={GOLD} strokeWidth="1.6" />
                  <rect x="11" y="15" width="9" height="11" rx="2" fill="#5C3012" stroke={GOLD_LIGHT} strokeWidth="1" />
                  <rect x="24" y="15" width="9" height="11" rx="2" fill="#5C3012" stroke={GOLD_LIGHT} strokeWidth="1" />
                  <rect x="11" y="30" width="9" height="11" rx="2" fill="#5C3012" stroke={GOLD_LIGHT} strokeWidth="1" />
                  <path d="M36 36 C42 32, 50 35, 48 42 C46 47, 38 46, 36 36 Z" fill={TERRACOTTA} stroke={GOLD_LIGHT} strokeWidth="1.2" />
                </svg>
                <span className="mwm-metric-tag">60% – 72% Pure Cocoa</span>
              </div>
              <div>
                <h3 className="mwm-card-heading">Shaved From Solid Couverture Slabs</h3>
                <p className="mwm-card-copy">
                  We temper solid single-origin chocolate blocks and shave them into micro-curls. That preserves the natural cocoa butter aroma that industrial spray-drying destroys.
                </p>
              </div>
            </motion.div>

            {/* Card 2 (Narrow): Zero Compound & Palm Oil */}
            <motion.div
              whileHover={{ y: -5 }}
              transition={{ duration: 0.25 }}
              className="mwm-bento-card mwm-bento-narrow"
            >
              <div className="mwm-bento-top">
                {/* Clean-Label Botanical Drop SVG */}
                <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                  <circle cx="28" cy="28" r="22" fill="#261409" stroke={GOLD} strokeWidth="1.5" strokeDasharray="3 3" />
                  <path
                    d="M28 14 C28 14, 18 25, 18 32 C18 37.5, 22.5 42, 28 42 C33.5 42, 38 37.5, 38 32 C38 25, 28 14, 28 14 Z"
                    fill="#4E2510"
                    stroke={GOLD_LIGHT}
                    strokeWidth="1.6"
                  />
                  <path d="M24 31 L27 34 L33 27" stroke={GOLD_LIGHT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="mwm-metric-tag">0% Palm Oil & Gums</span>
              </div>
              <div>
                <h3 className="mwm-card-heading">Clean Label, Zero Compound</h3>
                <p className="mwm-card-copy">
                  No hydrogenated vegetable fats, no artificial thickeners, and zero preservatives. Just four honest pantry ingredients you can actually pronounce.
                </p>
              </div>
            </motion.div>

            {/* Card 3 (Narrow): 72-Hour Stone Conching */}
            <motion.div
              whileHover={{ y: -5 }}
              transition={{ duration: 0.25 }}
              className="mwm-bento-card mwm-bento-narrow"
            >
              <div className="mwm-bento-top">
                {/* Concentric Stone-Ground Swirl SVG */}
                <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                  <circle cx="28" cy="28" r="22" fill="#261409" stroke={GOLD} strokeWidth="1.5" />
                  <path
                    d="M28 16 C35 16, 40 21, 40 28 C40 35, 35 40, 28 40 C22 40, 18 35, 18 29 C18 24, 22 20, 27 20 C31 20, 34 23, 34 27 C34 30, 31 33, 28 33"
                    stroke={GOLD_LIGHT}
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="mwm-metric-tag">72-Hr Stone Conched</span>
              </div>
              <div>
                <h3 className="mwm-card-heading">Micro-Milled Velvet Texture</h3>
                <p className="mwm-card-copy">
                  Slow granite stone-grinding refines cocoa particles under 20 microns—so every sip feels like liquid silk with zero chalky aftertaste.
                </p>
              </div>
            </motion.div>

            {/* Card 4 (Wide): Single-Origin Indian Estates */}
            <motion.div
              whileHover={{ y: -5 }}
              transition={{ duration: 0.25 }}
              className="mwm-bento-card mwm-bento-wide"
            >
              <div className="mwm-bento-top">
                {/* Cacao Pod & Origin Pin SVG */}
                <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                  <ellipse cx="26" cy="29" rx="13" ry="19" transform="rotate(-22 26 29)" fill="#4A210D" stroke={GOLD_LIGHT} strokeWidth="1.6" />
                  <path d="M18 16 Q26 28, 34 42" stroke={GOLD} strokeWidth="1.3" />
                  <path d="M14 23 Q25 31, 37 36" stroke={GOLD} strokeWidth="1.2" />
                  <circle cx="42" cy="16" r="5" fill={TERRACOTTA} stroke={CREAM} strokeWidth="1.2" />
                </svg>
                <span className="mwm-metric-tag">Idukki & Malabar Farms</span>
              </div>
              <div>
                <h3 className="mwm-card-heading">Direct-Trade Indian Single-Origin</h3>
                <p className="mwm-card-copy">
                  Sourced directly from shade-grown cacao farms in Kerala and Karnataka, fermented on-estate for 6 days to unlock natural fruity and nutty complexity.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    );
  }