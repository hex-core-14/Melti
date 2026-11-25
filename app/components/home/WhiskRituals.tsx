// app/components/home/WhiskRituals.tsx
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Clock, Thermometer, Flame, Users, Check } from 'lucide-react';

const CREAM = '#FFF8F0';
const COCOA = '#1A120B';
const COCOA_DEEP = '#120B06';
const GOLD = '#D4A373';
const GOLD_LIGHT = '#EBC593';
const TERRACOTTA = '#C86D51';

interface RecipeItem {
  id: string;
  title: string;
  tag: string;
  blendUsed: string;
  prepTime: string;
  tempLabel: string;
  isIced: boolean;
  cupStyle: 'ceramic' | 'iced-glass' | 'espresso-cup';
  liquidTop: string;
  liquidBottom: string;
  toppingType: 'crema-marshmallows' | 'iced-espresso' | 'whipped-caramel' | 'spiced-foam';
  shavingsGrams: number;
  milkMl: number;
  extraIngredient: string;
  description: string;
  steps: string[];
  proTip: string;
}

const RECIPES: RecipeItem[] = [
  {
    id: 'paris-velvet',
    title: 'The 2 AM Thick Café Pour',
    tag: 'Classic Hot • Thick',
    blendUsed: 'Midnight Velvet 72%',
    prepTime: '3 Mins',
    tempLabel: '70°C Steam',
    isIced: false,
    cupStyle: 'ceramic',
    liquidTop: '#6E3518',
    liquidBottom: '#2B1206',
    toppingType: 'crema-marshmallows',
    shavingsGrams: 40,
    milkMl: 160,
    extraIngredient: 'Pinch of flaky sea salt',
    description:
      'European-style spoon-coating hot chocolate. High couverture ratio creates a glossy, mousse-like body without cornstarch.',
    steps: [
      'Warm milk gently over low heat until tiny micro-bubbles form around the rim—never boil.',
      'Whisk in Mèlti 72% couverture shavings off-heat in two batches for a silky emulsion.',
      'Pour into a pre-warmed mug, top with torched vanilla bean clouds, and finish with sea salt.',
    ],
    proTip: 'Let the mug rest 45 seconds before sipping—cocoa butter thickens as it cools slightly.',
  },
  {
    id: 'dirty-iced-cocoa',
    title: 'Dirty Iced Espresso Cocoa',
    tag: 'Cold Drop • Caffeinated',
    blendUsed: 'Hazelnut Praline Melt 62%',
    prepTime: '4 Mins',
    tempLabel: '4°C Over Ice',
    isIced: true,
    cupStyle: 'iced-glass',
    liquidTop: '#8A5230',
    liquidBottom: '#3D1D0D',
    toppingType: 'iced-espresso',
    shavingsGrams: 35,
    milkMl: 150,
    extraIngredient: '1 shot (30ml) double espresso',
    description:
      'A molten hazelnut ganache base poured over crystal ice, cold frothed milk, and a cascading double shot of espresso.',
    steps: [
      'Melt Mèlti Hazelnut Praline shavings with 30ml hot water into a thick, glossy ganache.',
      'Swirl ganache inside a tall glass, pack with clear ice cubes, and pour cold milk.',
      'Float a fresh double espresso shot slowly over the back of a spoon for a marbled gradient.',
    ],
    proTip: 'Use oat milk for extra natural sweetness that amplifies the roasted Piedmont hazelnuts.',
  },
  {
    id: 'salted-toffee-cloud',
    title: 'Burnt Caramel Cold-Foam',
    tag: 'Sweet & Salty • Viral',
    blendUsed: 'Burnt Caramel & Sea Salt 60%',
    prepTime: '4 Mins',
    tempLabel: '65°C Warm',
    isIced: false,
    cupStyle: 'ceramic',
    liquidTop: '#8C4B24',
    liquidBottom: '#3E1D0B',
    toppingType: 'whipped-caramel',
    shavingsGrams: 38,
    milkMl: 180,
    extraIngredient: '2 tbsp lightly whipped cream',
    description:
      'Velvety amber-caramel hot chocolate crowned with chilled salted cream so every sip contrasts hot and cold.',
    steps: [
      'Whisk Burnt Caramel shavings into warm milk until completely smooth and aromatic.',
      'Hand-froth cold heavy cream or barista oat cream with a pinch of sea salt for 15 seconds.',
      'Spoon the cold salted foam over the hot cocoa and dust with shaved chocolate curls.',
    ],
    proTip: 'Sip directly through the cold foam layer without stirring first.',
  },
  {
    id: 'malabar-nightcap',
    title: 'Malabar Cardamom Nightcap',
    tag: 'Spiced • Cozy',
    blendUsed: 'Malabar Chai & Cacao 68%',
    prepTime: '5 Mins',
    tempLabel: '72°C Infused',
    isIced: false,
    cupStyle: 'espresso-cup',
    liquidTop: '#693216',
    liquidBottom: '#291105',
    toppingType: 'spiced-foam',
    shavingsGrams: 36,
    milkMl: 170,
    extraIngredient: '2 crushed green cardamom pods',
    description:
      'Single-origin dark cacao steeped with freshly bruised Wayanad cardamom and Ceylon cinnamon bark.',
    steps: [
      'Steep bruised green cardamom pods in simmering milk for 2 minutes, then strain.',
      'Whisk in Malabar Chai & Cacao shavings until the spice oils bloom into the crema.',
      'Finish with a cinnamon quill stirrer and a whisper of freshly grated nutmeg.',
    ],
    proTip: 'Pairs effortlessly with buttery shortbread or late-night rain playlists.',
  },
];

const RITUALS_CSS = `
.mwr-section {
  position: relative;
  padding: 116px 24px;
  background: radial-gradient(circle at 80% 18%, #261309 0%, ${COCOA_DEEP} 56%, #0C0603 100%);
  color: ${CREAM};
  overflow: hidden;
  border-top: 1px solid rgba(212, 163, 115, 0.14);
}

.mwr-container {
  max-width: 1220px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

.mwr-header {
  text-align: center;
  max-width: 680px;
  margin: 0 auto 48px;
}

.mwr-eyebrow {
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

.mwr-title {
  font-size: clamp(34px, 5vw, 56px);
  font-weight: 900;
  line-height: 1.08;
  letter-spacing: -0.02em;
  margin: 0;
  color: ${CREAM};
}

.mwr-title-accent {
  background: linear-gradient(135deg, ${GOLD_LIGHT} 0%, ${GOLD} 55%, ${TERRACOTTA} 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.mwr-subtitle {
  margin-top: 16px;
  font-size: 16px;
  line-height: 1.65;
  color: rgba(235, 197, 147, 0.76);
  font-weight: 500;
}

/* Recipe Selector Tabs */
.mwr-tabs {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-bottom: 44px;
}

.mwr-tab {
  padding: 11px 20px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.06em;
  border: 1px solid rgba(212, 163, 115, 0.22);
  background: rgba(255, 248, 240, 0.03);
  color: rgba(255, 248, 240, 0.8);
  cursor: pointer;
  transition: all 0.22s ease;
}

.mwr-tab:hover {
  border-color: ${GOLD};
  color: ${GOLD_LIGHT};
  background: rgba(212, 163, 115, 0.1);
}

.mwr-tab.active {
  background: linear-gradient(135deg, ${GOLD_LIGHT} 0%, ${GOLD} 60%, #B9824F 100%);
  color: ${COCOA};
  border-color: transparent;
  font-weight: 800;
  box-shadow: 0 8px 24px rgba(212, 163, 115, 0.26);
}

/* Main Studio Card */
.mwr-studio {
  display: grid;
  grid-template-columns: 0.95fr 1.25fr;
  gap: 36px;
  padding: 36px;
  border-radius: 32px;
  background: linear-gradient(150deg, rgba(43, 22, 11, 0.84) 0%, rgba(18, 11, 6, 0.96) 100%);
  border: 1px solid rgba(212, 163, 115, 0.24);
  box-shadow: 0 28px 64px rgba(0, 0, 0, 0.55), inset 0 1px 0 rgba(255, 248, 240, 0.08);
}

@media (max-width: 940px) {
  .mwr-studio {
    grid-template-columns: 1fr;
    padding: 24px;
  }
}

.mwr-vessel-stage {
  position: relative;
  border-radius: 24px;
  background: radial-gradient(circle at 50% 45%, rgba(212, 163, 115, 0.12) 0%, rgba(10, 5, 3, 0.88) 100%);
  border: 1px solid rgba(212, 163, 115, 0.18);
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  min-height: 360px;
}

.mwr-meta-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  width: 100%;
}

.mwr-meta-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 9999px;
  font-size: 11px;
  font-weight: 700;
  background: rgba(255, 248, 240, 0.05);
  border: 1px solid rgba(212, 163, 115, 0.22);
  color: ${GOLD_LIGHT};
}

/* Controls & Ratio Box */
.mwr-controls-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 20px;
  padding: 14px 16px;
  border-radius: 18px;
  background: rgba(12, 7, 4, 0.78);
  border: 1px solid rgba(212, 163, 115, 0.18);
}

.mwr-pill-group {
  display: inline-flex;
  padding: 3px;
  border-radius: 10px;
  background: rgba(255, 248, 240, 0.04);
  border: 1px solid rgba(212, 163, 115, 0.16);
}

.mwr-mini-btn {
  padding: 6px 12px;
  border-radius: 7px;
  border: none;
  background: transparent;
  color: rgba(255, 248, 240, 0.68);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s ease;
}

.mwr-mini-btn.selected {
  background: rgba(212, 163, 115, 0.24);
  color: ${GOLD_LIGHT};
}

.mwr-ingredients-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  margin-top: 16px;
}

@media (max-width: 560px) {
  .mwr-ingredients-grid {
    grid-template-columns: 1fr;
  }
}

.mwr-ing-card {
  padding: 12px 14px;
  border-radius: 14px;
  background: rgba(255, 248, 240, 0.03);
  border: 1px solid rgba(212, 163, 115, 0.15);
}

.mwr-steps {
  list-style: none;
  padding: 0;
  margin: 20px 0 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.mwr-step {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  font-size: 14px;
  line-height: 1.55;
  color: rgba(255, 248, 240, 0.86);
}

.mwr-step-num {
  width: 24px;
  height: 24px;
  border-radius: 9999px;
  background: rgba(212, 163, 115, 0.16);
  border: 1px solid rgba(212, 163, 115, 0.4);
  color: ${GOLD_LIGHT};
  font-size: 11px;
  font-weight: 900;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 1px;
}
`;

function DrinkVesselIllustration({ recipe }: { recipe: RecipeItem }) {
  return (
    <motion.svg
      key={recipe.id}
      initial={{ opacity: 0, scale: 0.92, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      width="240"
      height="230"
      viewBox="0 0 240 230"
      style={{ overflow: 'visible', display: 'block' }}
      role="img"
      aria-label={recipe.title}
    >
      <defs>
        <linearGradient id={`drink-grad-${recipe.id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={recipe.liquidTop} />
          <stop offset="100%" stopColor={recipe.liquidBottom} />
        </linearGradient>
      </defs>

      {/* Tabletop Shadow */}
      <ellipse cx="120" cy="212" rx="68" ry="8" fill="rgba(0,0,0,0.62)" />

      {/* Warm Steam Wisps for Hot Drinks */}
      {!recipe.isIced && (
        <g stroke={GOLD_LIGHT} strokeWidth="2" strokeLinecap="round" fill="none">
          <motion.path
            d="M 96 58 Q 88 42, 98 26 T 96 6"
            animate={{ opacity: [0.2, 0.65, 0.2], y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.path
            d="M 122 52 Q 130 36, 120 20 T 124 2"
            animate={{ opacity: [0.25, 0.72, 0.25], y: [0, -8, 0] }}
            transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          />
          <motion.path
            d="M 146 60 Q 138 44, 148 28 T 144 8"
            animate={{ opacity: [0.2, 0.6, 0.2], y: [0, -5, 0] }}
            transition={{ duration: 3.3, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          />
        </g>
      )}

      {recipe.cupStyle === 'iced-glass' ? (
        /* Tall Ribbed Café Glass for Iced Espresso Cocoa */
        <g>
          {/* Glass Straw */}
          <rect
            x="148"
            y="16"
            width="7"
            height="176"
            rx="3.5"
            transform="rotate(11 148 16)"
            fill="rgba(255, 248, 240, 0.24)"
            stroke={GOLD_LIGHT}
            strokeWidth="1"
          />

          {/* Glass Body */}
          <path
            d="M 76 58 H 164 L 154 198 C 153 204, 148 208, 140 208 H 100 C 92 208, 87 204, 86 198 Z"
            fill="rgba(255, 248, 240, 0.06)"
            stroke={GOLD_LIGHT}
            strokeOpacity="0.6"
            strokeWidth="1.8"
          />

          {/* Bottom Hazelnut Ganache Swirl */}
          <path
            d="M 85 154 Q 120 144, 155 154 L 152 196 C 151 201, 147 204, 140 204 H 100 C 93 204, 89 201, 88 196 Z"
            fill="#2B1206"
          />

          {/* Creamy Milk + Espresso Marbled Layer */}
          <path
            d="M 80 86 Q 120 82, 160 86 L 155 154 Q 120 144, 85 154 Z"
            fill={`url(#drink-grad-${recipe.id})`}
            opacity="0.92"
          />

          {/* Translucent Ice Cubes */}
          <rect
            x="92"
            y="94"
            width="24"
            height="24"
            rx="5"
            transform="rotate(-10 92 94)"
            fill="rgba(255, 248, 240, 0.2)"
            stroke="rgba(255, 248, 240, 0.45)"
            strokeWidth="1.2"
          />
          <rect
            x="124"
            y="102"
            width="25"
            height="25"
            rx="5"
            transform="rotate(14 124 102)"
            fill="rgba(255, 248, 240, 0.18)"
            stroke="rgba(255, 248, 240, 0.42)"
            strokeWidth="1.2"
          />
          <rect
            x="104"
            y="128"
            width="22"
            height="22"
            rx="5"
            transform="rotate(6 104 128)"
            fill="rgba(255, 248, 240, 0.16)"
            stroke="rgba(255, 248, 240, 0.35)"
            strokeWidth="1.2"
          />

          {/* Top Espresso Crema Float */}
          <ellipse cx="120" cy="86" rx="40" ry="6" fill="#4A210D" stroke={GOLD} strokeWidth="1" />
        </g>
      ) : (
        /* Artisanal Ceramic Mug */
        <g>
          {/* Mug Handle */}
          <path
            d="M 178 96 H 196 C 209 96, 217 106, 217 124 C 217 142, 209 152, 196 152 H 178"
            fill="none"
            stroke={GOLD}
            strokeWidth="9"
            strokeLinecap="round"
          />
          <path
            d="M 178 96 H 196 C 209 96, 217 106, 217 124 C 217 142, 209 152, 196 152 H 178"
            fill="none"
            stroke="#241309"
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* Mug Outer Ceramic Shell */}
          <path
            d="M 62 78 H 178 V 162 C 178 186, 158 202, 120 202 C 82 202, 62 186, 62 162 Z"
            fill="#26150B"
            stroke={GOLD}
            strokeOpacity="0.55"
            strokeWidth="1.8"
          />

          {/* Cutaway Molten Chocolate Interior */}
          <path
            d="M 74 96 Q 98 90, 120 96 T 166 96 V 158 C 166 176, 150 188, 120 188 C 90 188, 74 176, 74 158 Z"
            fill={`url(#drink-grad-${recipe.id})`}
          />

          {/* Toppings Based on Recipe */}
          {recipe.toppingType === 'crema-marshmallows' && (
            <g>
              {/* Torched Vanilla Bean Clouds */}
              <rect x="86" y="72" width="22" height="15" rx="5" fill="#FFF8F0" stroke={GOLD} strokeWidth="1" />
              <path d="M 88 74 Q 97 71, 106 74" stroke="#B87333" strokeWidth="2.5" strokeLinecap="round" />
              <rect x="114" y="70" width="24" height="16" rx="5" fill="#FFF4E4" stroke={GOLD} strokeWidth="1" />
              <path d="M 116 72 Q 126 69, 136 72" stroke="#9E5822" strokeWidth="2.5" strokeLinecap="round" />
            </g>
          )}

          {recipe.toppingType === 'whipped-caramel' && (
            <g>
              {/* Cold Salted Cream Dome + Caramel Drizzle */}
              <path
                d="M 72 80 C 76 58, 164 58, 168 80 Z"
                fill="#FFF8F0"
                stroke={GOLD}
                strokeWidth="1.2"
              />
              <path
                d="M 88 72 Q 106 64, 120 73 T 150 70"
                fill="none"
                stroke="#C86D51"
                strokeWidth="2.6"
                strokeLinecap="round"
              />
            </g>
          )}

          {recipe.toppingType === 'spiced-foam' && (
            <g>
              {/* Cinnamon Quill Stick & Cardamom Pod */}
              <rect
                x="136"
                y="46"
                width="8"
                height="54"
                rx="4"
                transform="rotate(24 136 46)"
                fill="#8C4A27"
                stroke={GOLD_LIGHT}
                strokeWidth="1"
              />
              <ellipse
                cx="104"
                cy="76"
                rx="8"
                ry="4.5"
                transform="rotate(-14 104 76)"
                fill="#7D8C52"
                stroke={CREAM}
                strokeWidth="0.9"
              />
            </g>
          )}

          {/* Mug Rim */}
          <ellipse cx="120" cy="78" rx="58" ry="9" fill="#1A0E07" stroke={GOLD} strokeWidth="1.6" />
        </g>
      )}
    </motion.svg>
  );
}

export default function WhiskRituals() {
  const [activeId, setActiveId] = useState<string>(RECIPES[0].id);
  const [servings, setServings] = useState<1 | 2>(1);
  const [milkType, setMilkType] = useState<'Whole Milk' | 'Barista Oat'>('Whole Milk');

  const recipe = RECIPES.find((r) => r.id === activeId) || RECIPES[0];

  return (
    <section id="recipes" className="mwr-section">
      <style>{RITUALS_CSS}</style>

      <div className="mwr-container">
        {/* Header */}
        <div className="mwr-header">
          <div className="mwr-eyebrow">
            <Sparkles size={14} /> Café-Grade Home Barista Lab
          </div>
          <h2 className="mwr-title">
            Master The <span className="mwr-title-accent">Whisk Ritual.</span>
          </h2>
          <p className="mwr-subtitle">
            Because Mèlti is shaved from solid couverture slabs, you can whip up thick Parisian pours or dirty iced cocoas in under four minutes.
          </p>
        </div>

        {/* Recipe Selector Tabs */}
        <div className="mwr-tabs" role="tablist" aria-label="Select hot chocolate recipe">
          {RECIPES.map((item) => (
            <button
              key={item.id}
              role="tab"
              aria-selected={item.id === activeId}
              onClick={() => setActiveId(item.id)}
              className={`mwr-tab ${item.id === activeId ? 'active' : ''}`}
            >
              {item.title}
            </button>
          ))}
        </div>

        {/* Interactive Recipe Studio Card */}
        <div className="mwr-studio">
          {/* Left Vessel Stage */}
          <div className="mwr-vessel-stage">
            <div className="mwr-meta-row">
              <span className="mwr-meta-pill">
                <Clock size={13} /> {recipe.prepTime}
              </span>
              <span className="mwr-meta-pill">
                <Thermometer size={13} /> {recipe.tempLabel}
              </span>
              <span className="mwr-meta-pill">
                <Flame size={13} /> {recipe.tag}
              </span>
            </div>

            <div style={{ margin: '14px 0' }}>
              <DrinkVesselIllustration recipe={recipe} />
            </div>

            <div
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '16px',
                background: 'rgba(212, 163, 115, 0.08)',
                border: '1px solid rgba(212, 163, 115, 0.22)',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: GOLD }}>
                Recommended Tin
              </div>
              <div style={{ fontSize: '14px', fontWeight: 900, color: CREAM, marginTop: '2px' }}>
                {recipe.blendUsed}
              </div>
            </div>
          </div>

          {/* Right Recipe Instructions & Ratio Calculator */}
          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={recipe.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: GOLD_LIGHT }}>
                  {recipe.tag}
                </div>
                <h3 style={{ fontSize: 'clamp(24px, 3.2vw, 34px)', fontWeight: 900, margin: '6px 0 10px', lineHeight: 1.12 }}>
                  {recipe.title}
                </h3>
                <p style={{ fontSize: '14.5px', lineHeight: 1.65, color: 'rgba(255, 248, 240, 0.76)', margin: 0 }}>
                  {recipe.description}
                </p>

                {/* Serving & Milk Base Customizer */}
                <div className="mwr-controls-bar">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 800, color: GOLD_LIGHT }}>
                    <Users size={15} /> Scale Pour:
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    <div className="mwr-pill-group" role="group" aria-label="Number of mugs">
                      <button
                        onClick={() => setServings(1)}
                        className={`mwr-mini-btn ${servings === 1 ? 'selected' : ''}`}
                      >
                        1 Mug
                      </button>
                      <button
                        onClick={() => setServings(2)}
                        className={`mwr-mini-btn ${servings === 2 ? 'selected' : ''}`}
                      >
                        2 Mugs
                      </button>
                    </div>

                    <div className="mwr-pill-group" role="group" aria-label="Milk base">
                      <button
                        onClick={() => setMilkType('Whole Milk')}
                        className={`mwr-mini-btn ${milkType === 'Whole Milk' ? 'selected' : ''}`}
                      >
                        Whole Milk
                      </button>
                      <button
                        onClick={() => setMilkType('Barista Oat')}
                        className={`mwr-mini-btn ${milkType === 'Barista Oat' ? 'selected' : ''}`}
                      >
                        Barista Oat
                      </button>
                    </div>
                  </div>
                </div>

                {/* Scaled Ingredient Ratios */}
                <div className="mwr-ingredients-grid">
                  <div className="mwr-ing-card">
                    <div style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: GOLD }}>
                      Couverture
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: 900, color: CREAM, marginTop: '3px' }}>
                      {recipe.shavingsGrams * servings}g
                    </div>
                    <div style={{ fontSize: '11px', color: 'rgba(235, 197, 147, 0.68)' }}>
                      ~{3 * servings} heaped tbsp
                    </div>
                  </div>

                  <div className="mwr-ing-card">
                    <div style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: GOLD }}>
                      {milkType}
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: 900, color: CREAM, marginTop: '3px' }}>
                      {recipe.milkMl * servings}ml
                    </div>
                    <div style={{ fontSize: '11px', color: 'rgba(235, 197, 147, 0.68)' }}>
                      {recipe.isIced ? 'Chilled' : 'Steamed'}
                    </div>
                  </div>

                  <div className="mwr-ing-card">
                    <div style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: GOLD }}>
                      Finish
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: CREAM, marginTop: '5px', lineHeight: 1.3 }}>
                      {recipe.extraIngredient}
                    </div>
                  </div>
                </div>

                {/* Numbered Whisk Steps */}
                <ol className="mwr-steps">
                  {recipe.steps.map((step, i) => (
                    <li key={i} className="mwr-step">
                      <span className="mwr-step-num">{i + 1}</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>

                {/* Barista Note */}
                <div
                  style={{
                    marginTop: '20px',
                    padding: '12px 16px',
                    borderRadius: '14px',
                    background: 'rgba(200, 109, 81, 0.12)',
                    border: '1px solid rgba(200, 109, 81, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '12.5px',
                    color: GOLD_LIGHT,
                  }}
                >
                  <Check size={16} style={{ color: TERRACOTTA, flexShrink: 0 }} />
                  <span>
                    <strong>Barista Secret:</strong> {recipe.proTip}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}