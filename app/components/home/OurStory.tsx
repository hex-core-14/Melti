// app/components/home/OurStory.tsx
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MapPin, Award, Compass } from 'lucide-react';

const CREAM = '#FFF8F0';
const COCOA = '#1A120B';
const COCOA_DEEP = '#120B06';
const GOLD = '#D4A373';
const GOLD_LIGHT = '#EBC593';
const TERRACOTTA = '#C86D51';

interface CraftStage {
  step: string;
  title: string;
  region: string;
  metric: string;
  summary: string;
  detail: string;
  visualType: 'pod' | 'ferment' | 'conche' | 'shave';
}

const CRAFT_STAGES: CraftStage[] = [
  {
    step: '01',
    title: 'Shade-Grown Western Ghats Harvest',
    region: 'Idukki & Malabar Hills, Kerala',
    metric: '1,100m Elevation',
    summary:
      'We partner directly with family-run agroforestry estates where cacao pods ripen slowly beneath pepper vines, cardamom, and wild jackfruit canopy.',
    detail:
      'Hand-harvested only at peak amber ripeness, our farmers receive 32% above commodity mandi rates for single-estate traceability.',
    visualType: 'pod',
  },
  {
    step: '02',
    title: '6-Day Banana-Leaf Fermentation',
    region: 'On-Estate Wooden Sweating Boxes',
    metric: '144 Hrs Micro-Flora',
    summary:
      'Fresh wet cacao beans are nestled in tiered cedar boxes lined with wild banana leaves, turning every 48 hours to build complex fruit and espresso notes.',
    detail:
      'Followed by 8 days of slow solar drying on raised bamboo tables until moisture drops to an exact 6.8%.',
    visualType: 'ferment',
  },
  {
    step: '03',
    title: '72-Hour Granite Stone Conching',
    region: 'Mèlti Small-Batch Roastery',
    metric: '< 18 Micron Silk',
    summary:
      'Instead of high-heat industrial alkalizing, we gently roast and stone-grind cacao nibs with pure cocoa butter and unrefined cane sugar for three full days.',
    detail:
      'Slow granite friction drives off natural bitterness while preserving delicate floral aromatics.',
    visualType: 'conche',
  },
  {
    step: '04',
    title: 'Tempered & Micro-Shaved Curls',
    region: 'Sealed in Nitrogen-Flushed Tins',
    metric: '100% Couverture',
    summary:
      'Every batch is tempered into solid couverture slabs and shaved into feather-light curls engineered to melt in 60 seconds of whisking.',
    detail:
      'No fillers, no gums, no palm oil—just pure melted chocolate bar in every spoonful.',
    visualType: 'shave',
  },
];

const STORY_CSS = `
.mos-section {
  position: relative;
  padding: 116px 24px;
  background: linear-gradient(180deg, #0C0603 0%, ${COCOA} 52%, ${COCOA_DEEP} 100%);
  color: ${CREAM};
  overflow: hidden;
  border-top: 1px solid rgba(212, 163, 115, 0.14);
}

.mos-container {
  max-width: 1220px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

.mos-header {
  text-align: center;
  max-width: 720px;
  margin: 0 auto 56px;
}

.mos-eyebrow {
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

.mos-title {
  font-size: clamp(34px, 5vw, 56px);
  font-weight: 900;
  line-height: 1.08;
  letter-spacing: -0.02em;
  margin: 0;
}

.mos-title-accent {
  background: linear-gradient(135deg, ${GOLD_LIGHT} 0%, ${GOLD} 55%, ${TERRACOTTA} 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.mos-subtitle {
  margin-top: 16px;
  font-size: 16px;
  line-height: 1.65;
  color: rgba(235, 197, 147, 0.76);
  font-weight: 500;
}

/* Interactive 4-Step Provenance Selector */
.mos-timeline-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  margin-bottom: 32px;
}

@media (max-width: 900px) {
  .mos-timeline-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 520px) {
  .mos-timeline-grid {
    grid-template-columns: 1fr;
  }
}

.mos-step-btn {
  text-align: left;
  padding: 18px 20px;
  border-radius: 22px;
  background: rgba(255, 248, 240, 0.03);
  border: 1px solid rgba(212, 163, 115, 0.18);
  color: ${CREAM};
  cursor: pointer;
  transition: all 0.25s ease;
}

.mos-step-btn:hover {
  border-color: rgba(212, 163, 115, 0.45);
  background: rgba(212, 163, 115, 0.08);
}

.mos-step-btn.active {
  background: linear-gradient(145deg, rgba(59, 30, 13, 0.92) 0%, rgba(26, 15, 8, 0.98) 100%);
  border-color: ${GOLD};
  box-shadow: 0 14px 32px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(235, 197, 147, 0.25);
}

/* Feature Story Spotlight Card */
.mos-spotlight {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 36px;
  align-items: center;
  padding: 36px;
  border-radius: 32px;
  background: linear-gradient(145deg, rgba(43, 22, 11, 0.82) 0%, rgba(18, 11, 6, 0.96) 100%);
  border: 1px solid rgba(212, 163, 115, 0.24);
  box-shadow: 0 28px 64px rgba(0, 0, 0, 0.55), inset 0 1px 0 rgba(255, 248, 240, 0.08);
}

@media (max-width: 900px) {
  .mos-spotlight {
    grid-template-columns: 1fr;
    padding: 24px;
  }
}

.mos-art-frame {
  border-radius: 24px;
  background: radial-gradient(circle at 50% 50%, rgba(212, 163, 115, 0.12) 0%, rgba(10, 5, 3, 0.9) 100%);
  border: 1px solid rgba(212, 163, 115, 0.18);
  padding: 28px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 270px;
}

/* Bottom Brand Manifesto Banner */
.mos-manifesto {
  margin-top: 32px;
  padding: 32px 36px;
  border-radius: 28px;
  background: rgba(18, 11, 6, 0.88);
  border: 1px solid rgba(212, 163, 115, 0.2);
  display: grid;
  grid-template-columns: 1.3fr 0.7fr;
  gap: 28px;
  align-items: center;
}

@media (max-width: 860px) {
  .mos-manifesto {
    grid-template-columns: 1fr;
    padding: 24px;
  }
}

.mos-kpi-row {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.mos-kpi-box {
  padding: 14px 12px;
  border-radius: 16px;
  background: rgba(255, 248, 240, 0.03);
  border: 1px solid rgba(212, 163, 115, 0.16);
  text-align: center;
}
`;

function StageIllustration({ type }: { type: CraftStage['visualType'] }) {
  return (
    <motion.svg
      key={type}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      width="210"
      height="190"
      viewBox="0 0 210 190"
      style={{ overflow: 'visible', display: 'block' }}
      aria-hidden="true"
    >
      <circle cx="105" cy="95" r="74" fill="rgba(212, 163, 115, 0.06)" stroke={GOLD} strokeOpacity="0.24" strokeDasharray="4 4" />

      {type === 'pod' && (
        <g>
          {/* Open Cacao Pod Cross-Section with Cream Cacao Beans */}
          <ellipse cx="105" cy="96" rx="44" ry="64" transform="rotate(-18 105 96)" fill="#582F0E" stroke={GOLD_LIGHT} strokeWidth="2" />
          <ellipse cx="105" cy="96" rx="28" ry="48" transform="rotate(-18 105 96)" fill="#2B1206" stroke={GOLD} strokeWidth="1.2" />
          {[
            { cx: 98, cy: 70 },
            { cx: 112, cy: 76 },
            { cx: 96, cy: 92 },
            { cx: 113, cy: 98 },
            { cx: 102, cy: 116 },
            { cx: 116, cy: 120 },
          ].map((b, idx) => (
            <ellipse
              key={idx}
              cx={b.cx}
              cy={b.cy}
              rx="8"
              ry="5.5"
              transform={`rotate(-18 ${b.cx} ${b.cy})`}
              fill="#F5E0BD"
              stroke={TERRACOTTA}
              strokeWidth="1.2"
            />
          ))}
        </g>
      )}

      {type === 'ferment' && (
        <g>
          {/* Cedar Fermentation Box & Botanical Leaf */}
          <rect x="48" y="64" width="114" height="72" rx="10" fill="#3B1E0A" stroke={GOLD} strokeWidth="1.8" />
          <line x1="48" y1="88" x2="162" y2="88" stroke={GOLD} strokeOpacity="0.45" strokeWidth="1.4" />
          <line x1="48" y1="112" x2="162" y2="112" stroke={GOLD} strokeOpacity="0.45" strokeWidth="1.4" />
          <path
            d="M 62 64 C 76 34, 134 34, 148 64 Z"
            fill="#4F6D3A"
            stroke={GOLD_LIGHT}
            strokeWidth="1.5"
          />
          <path d="M 105 42 V 64" stroke={CREAM} strokeOpacity="0.5" strokeWidth="1.2" />
        </g>
      )}

      {type === 'conche' && (
        <g>
          {/* Twin Granite Melanger Wheels */}
          <circle cx="105" cy="98" r="56" fill="#241309" stroke={GOLD} strokeWidth="1.8" />
          <motion.g
            animate={{ rotate: 360 }}
            transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
            style={{ transformOrigin: '105px 98px' }}
          >
            <rect x="64" y="76" width="32" height="44" rx="6" fill="#4A3B32" stroke={GOLD_LIGHT} strokeWidth="1.5" />
            <rect x="114" y="76" width="32" height="44" rx="6" fill="#4A3B32" stroke={GOLD_LIGHT} strokeWidth="1.5" />
            <line x1="96" y1="98" x2="114" y2="98" stroke={GOLD} strokeWidth="4" />
          </motion.g>
        </g>
      )}

      {type === 'shave' && (
        <g>
          {/* Shaved Couverture Curls */}
          <path
            d="M 56 116 C 56 84, 102 80, 108 110 C 112 130, 72 134, 56 116 Z"
            fill="#4E2510"
            stroke={GOLD_LIGHT}
            strokeWidth="1.6"
          />
          <path
            d="M 96 122 C 98 88, 152 88, 154 120 C 154 138, 108 140, 96 122 Z"
            fill="#3B1A0A"
            stroke={GOLD}
            strokeWidth="1.6"
          />
          <path
            d="M 80 86 C 84 62, 126 62, 128 84 C 128 98, 90 98, 80 86 Z"
            fill="#6E3518"
            stroke={GOLD_LIGHT}
            strokeWidth="1.6"
          />
        </g>
      )}
    </motion.svg>
  );
}

export default function OurStory() {
  const [activeIndex, setActiveIndex] = useState(0);
  const stage = CRAFT_STAGES[activeIndex];

  return (
    <section id="story" className="mos-section">
      <style>{STORY_CSS}</style>

      <div className="mos-container">
        {/* Header */}
        <div className="mos-header">
          <div className="mos-eyebrow">
            <Compass size={14} /> Bean-To-Tin Provenance
          </div>
          <h2 className="mos-title">
            Born In The <span className="mos-title-accent">Western Ghats.</span>
          </h2>
          <p className="mos-subtitle">
            We started Mèlti with one obsession: replacing chalky instant cocoa mixes with real, single-estate Indian couverture chocolate you can whisk at home.
          </p>
        </div>

        {/* 4-Step Interactive Craft Timeline */}
        <div className="mos-timeline-grid" role="tablist" aria-label="Bean to tin craft stages">
          {CRAFT_STAGES.map((item, idx) => (
            <button
              key={item.step}
              role="tab"
              aria-selected={idx === activeIndex}
              onClick={() => setActiveIndex(idx)}
              className={`mos-step-btn ${idx === activeIndex ? 'active' : ''}`}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 900, letterSpacing: '0.14em', color: GOLD_LIGHT }}>
                  STAGE {item.step}
                </span>
                <span style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(235, 197, 147, 0.7)' }}>
                  {item.metric}
                </span>
              </div>
              <div style={{ fontSize: '15px', fontWeight: 800, lineHeight: 1.3, color: CREAM }}>
                {item.title}
              </div>
            </button>
          ))}
        </div>

        {/* Active Stage Spotlight */}
        <div className="mos-spotlight">
          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={stage.step}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', fontSize: '11px', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: GOLD_LIGHT }}>
                  <MapPin size={13} /> {stage.region}
                </div>
                <h3 style={{ fontSize: 'clamp(24px, 3vw, 34px)', fontWeight: 900, margin: '8px 0 12px', lineHeight: 1.15 }}>
                  {stage.title}
                </h3>
                <p style={{ fontSize: '15px', lineHeight: 1.68, color: 'rgba(255, 248, 240, 0.84)', margin: 0 }}>
                  {stage.summary}
                </p>
                <p style={{ fontSize: '13.5px', lineHeight: 1.6, color: 'rgba(235, 197, 147, 0.74)', marginTop: '12px' }}>
                  {stage.detail}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mos-art-frame">
            <StageIllustration type={stage.visualType} />
            <div style={{ marginTop: '8px', fontSize: '11px', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: GOLD }}>
              {stage.metric}
            </div>
          </div>
        </div>

        {/* Small-Batch Manifesto + Key Metrics */}
        <div className="mos-manifesto">
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', fontSize: '11px', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: GOLD }}>
              <Award size={14} /> Small-Batch Roastery Promise
            </div>
            <p style={{ marginTop: '10px', fontSize: '16px', fontWeight: 700, lineHeight: 1.55, color: CREAM }}>
              &ldquo;Real hot chocolate isn&apos;t made in a spray-dryer—it&apos;s shaved from tempered couverture slabs and whisked fresh when the mood hits.&rdquo;
            </p>
            <div style={{ marginTop: '8px', fontSize: '12.5px', color: GOLD_LIGHT, fontWeight: 700 }}>
              — The Mèlti Craft Collective, Bengaluru &amp; Idukki
            </div>
          </div>

          <div className="mos-kpi-row">
            <div className="mos-kpi-box">
              <div style={{ fontSize: '22px', fontWeight: 900, color: GOLD_LIGHT }}>100%</div>
              <div style={{ fontSize: '10.5px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,248,240,0.7)', marginTop: '4px' }}>
                Indian Cacao
              </div>
            </div>
            <div className="mos-kpi-box">
              <div style={{ fontSize: '22px', fontWeight: 900, color: GOLD_LIGHT }}>72h</div>
              <div style={{ fontSize: '10.5px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,248,240,0.7)', marginTop: '4px' }}>
                Stone Conched
              </div>
            </div>
            <div className="mos-kpi-box">
              <div style={{ fontSize: '22px', fontWeight: 900, color: GOLD_LIGHT }}>0%</div>
              <div style={{ fontSize: '10.5px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,248,240,0.7)', marginTop: '4px' }}>
                Palm Oil / Gums
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}