// app/components/home/ProductShowcase.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  Sparkles,
  Eye,
  X,
  Plus,
  Minus,
  Check,
  Coffee,
  ArrowUpRight,
} from 'lucide-react';
import { MELTI_PRODUCTS } from '@/app/config/productsConfig';
import { useCart } from '@/app/context/CartContext';

const CREAM = '#FFF8F0';
const COCOA = '#1A120B';
const GOLD = '#D4A373';
const GOLD_LIGHT = '#EBC593';
const TERRACOTTA = '#C86D51';

const SHOWCASE_CSS = `
.mprod-section {
  position: relative;
  padding: 96px 24px;
  background: radial-gradient(circle at 50% 18%, #26140A 0%, #120B06 72%);
  color: ${CREAM};
}

.mprod-container {
  max-width: 1060px;
  margin: 0 auto;
}

.mprod-header {
  text-align: center;
  margin-bottom: 42px;
}

.mprod-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 6px 14px;
  border-radius: 9999px;
  background: rgba(212, 163, 115, 0.1);
  border: 1px solid rgba(212, 163, 115, 0.28);
  color: ${GOLD_LIGHT};
  font-size: 10.5px;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.mprod-title {
  margin: 14px 0 8px;
  font-size: clamp(28px, 4vw, 42px);
  font-weight: 900;
  letter-spacing: -0.02em;
  color: ${CREAM};
}

.mprod-subtitle {
  margin: 0 auto;
  max-width: 540px;
  font-size: 14.5px;
  line-height: 1.6;
  color: rgba(235, 197, 147, 0.74);
}

.mprod-card {
  display: grid;
  grid-template-columns: 0.92fr 1.08fr;
  gap: 34px;
  padding: 32px;
  border-radius: 30px;
  background: linear-gradient(155deg, #23140C 0%, #160D08 100%);
  border: 1px solid rgba(212, 163, 115, 0.24);
  box-shadow: 0 32px 72px rgba(0, 0, 0, 0.65);
}

.mprod-stage {
  position: relative;
  min-height: 410px;
  border-radius: 22px;
  padding: 22px;
  background: radial-gradient(circle at 50% 45%, #2D190E 0%, #140B06 85%);
  border: 1px solid rgba(212, 163, 115, 0.16);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
}

.mprod-stage-top {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  z-index: 2;
}

.mprod-badge-pill {
  padding: 6px 13px;
  border-radius: 9999px;
  background: rgba(18, 11, 6, 0.78);
  border: 1px solid rgba(212, 163, 115, 0.34);
  color: ${GOLD_LIGHT};
  font-size: 10.5px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.mprod-cocoa-pill {
  padding: 6px 11px;
  border-radius: 9999px;
  background: rgba(200, 109, 81, 0.18);
  border: 1px solid rgba(200, 109, 81, 0.42);
  color: #F6B8A6;
  font-size: 10.5px;
  font-weight: 800;
  letter-spacing: 0.08em;
}

.mprod-ritual-btn {
  align-self: flex-end;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 9px 15px;
  border-radius: 9999px;
  background: rgba(18, 11, 6, 0.85);
  border: 1px solid rgba(212, 163, 115, 0.32);
  color: ${CREAM};
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.11em;
  text-transform: uppercase;
  cursor: pointer;
  transition: border-color 0.2s ease, color 0.2s ease, background 0.2s ease;
  z-index: 2;
}

.mprod-ritual-btn:hover {
  border-color: ${GOLD_LIGHT};
  color: ${GOLD_LIGHT};
  background: rgba(40, 22, 12, 0.95);
}

.mprod-ritual-overlay {
  position: absolute;
  inset: 14px;
  z-index: 5;
  border-radius: 18px;
  padding: 22px;
  background: rgba(18, 11, 6, 0.95);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(212, 163, 115, 0.38);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.mprod-notes-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 18px 0 22px;
}

.mprod-note-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 13px;
  border-radius: 11px;
  background: rgba(255, 248, 240, 0.04);
  border: 1px solid rgba(212, 163, 115, 0.22);
  color: ${GOLD_LIGHT};
  font-size: 12px;
  font-weight: 700;
}

.mprod-sensory-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
  margin-bottom: 24px;
}

.mprod-pack-switcher {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 5px;
  border-radius: 14px;
  background: rgba(12, 7, 4, 0.72);
  border: 1px solid rgba(212, 163, 115, 0.22);
  margin-bottom: 24px;
}

.mprod-pack-tab {
  padding: 9px 15px;
  border-radius: 10px;
  border: none;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;
}

.mprod-buy-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
}

.mprod-qty-box {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 9999px;
  background: rgba(255, 248, 240, 0.05);
  border: 1px solid rgba(212, 163, 115, 0.28);
}

.mprod-qty-btn {
  width: 26px;
  height: 26px;
  border-radius: 9999px;
  border: none;
  background: rgba(212, 163, 115, 0.16);
  color: ${CREAM};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.mprod-qty-btn:hover {
  background: rgba(212, 163, 115, 0.32);
}

.mprod-add-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  padding: 14px 28px;
  border-radius: 9999px;
  border: none;
  cursor: pointer;
  font-size: 12.5px;
  font-weight: 900;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${COCOA};
  background: linear-gradient(135deg, ${GOLD_LIGHT} 0%, ${GOLD} 60%, #B9824F 100%);
  box-shadow: 0 10px 24px rgba(212, 163, 115, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.35);
  transition: filter 0.2s ease, transform 0.12s ease;
}

.mprod-add-btn:hover {
  filter: brightness(1.07);
}

.mprod-add-btn:active {
  transform: scale(0.97);
}

@media (max-width: 860px) {
  .mprod-section {
    padding: 72px 16px;
  }
  .mprod-card {
    grid-template-columns: 1fr;
    padding: 22px 18px;
    gap: 24px;
  }
  .mprod-stage {
    min-height: 330px;
  }
  .mprod-sensory-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}
`;

export default function ProductShowcase() {
  const { addItem } = useCart();
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [ritualOpen, setRitualOpen] = useState<boolean>(false);
  const [justAdded, setJustAdded] = useState<boolean>(false);

  const selectedProduct = MELTI_PRODUCTS[selectedIndex] || MELTI_PRODUCTS[0];

  const handleSelectPack = (idx: number) => {
    setSelectedIndex(idx);
    setQuantity(1);
    setRitualOpen(false);
  };

  const handleAddToBag = () => {
    addItem(selectedProduct, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
  };

  return (
    <section id="products" className="mprod-section">
      <style>{SHOWCASE_CSS}</style>

      <div className="mprod-container">
        {/* Section Heading */}
        <div className="mprod-header">
          <span className="mprod-eyebrow">
            <Sparkles size={12} /> 32% Real Couverture Cocoa
          </span>
          <h2 className="mprod-title">Choose Your Pour Size</h2>
          <p className="mprod-subtitle">
            One signature 32% cocoa recipe—available in a single-mug 20g sachet or our
            10-mug 200g family stash.
          </p>
        </div>

        {/* Main Showcase Card */}
        <div className="mprod-card">
          {/* Left Visual Stage */}
          <div className="mprod-stage">
            <div className="mprod-stage-top">
              <span className="mprod-badge-pill">{selectedProduct.badge}</span>
              <span className="mprod-cocoa-pill">
                {selectedProduct.cocoaPercent} COCOA
              </span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={selectedProduct.id}
                initial={{ opacity: 0, y: 12, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.96 }}
                transition={{ duration: 0.25 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '16px 0',
                }}
              >
                <img
                  src={selectedProduct.imageUrl}
                  alt={selectedProduct.name}
                  style={{
                    width: '100%',
                    maxWidth: selectedProduct.category === 'family' ? '235px' : '200px',
                    height: 'auto',
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 24px 36px rgba(0, 0, 0, 0.78))',
                  }}
                />
              </motion.div>
            </AnimatePresence>

            <button
              type="button"
              onClick={() => setRitualOpen(true)}
              className="mprod-ritual-btn"
            >
              <Eye size={14} style={{ color: GOLD_LIGHT }} /> Whisk Ritual
            </button>

            {/* Whisk Ritual Glass Overlay */}
            <AnimatePresence>
              {ritualOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="mprod-ritual-overlay"
                >
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '12px',
                      }}
                    >
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '11px',
                          fontWeight: 800,
                          letterSpacing: '0.14em',
                          textTransform: 'uppercase',
                          color: GOLD_LIGHT,
                        }}
                      >
                        <Coffee size={14} /> 30-Second Whisk Ritual
                      </span>
                      <button
                        type="button"
                        onClick={() => setRitualOpen(false)}
                        aria-label="Close ritual guide"
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '9999px',
                          border: '1px solid rgba(212, 163, 115, 0.3)',
                          background: 'transparent',
                          color: CREAM,
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                        }}
                      >
                        <X size={14} />
                      </button>
                    </div>

                    <p
                      style={{
                        margin: 0,
                        fontSize: '13.5px',
                        lineHeight: 1.65,
                        color: CREAM,
                      }}
                    >
                      {selectedProduct.ritualTip}
                    </p>
                  </div>

                  <div
                    style={{
                      paddingTop: '12px',
                      borderTop: '1px solid rgba(212, 163, 115, 0.18)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '11.5px',
                      color: GOLD_LIGHT,
                      fontWeight: 700,
                    }}
                  >
                    <span>Yield: {selectedProduct.servings}</span>
                    <span>{selectedProduct.origin}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Product Details & Add-to-Cart Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div
              style={{
                fontSize: '11px',
                fontWeight: 800,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: GOLD,
                marginBottom: '8px',
              }}
            >
              {selectedProduct.tagline}
            </div>

            <h3
              style={{
                margin: 0,
                fontSize: 'clamp(24px, 3vw, 32px)',
                fontWeight: 900,
                lineHeight: 1.2,
                color: CREAM,
              }}
            >
              {selectedProduct.name}
            </h3>

            <p
              style={{
                margin: '14px 0 0',
                fontSize: '14px',
                lineHeight: 1.65,
                color: 'rgba(255, 248, 240, 0.78)',
              }}
            >
              {selectedProduct.description}
            </p>

            {/* Tasting Notes */}
            <div className="mprod-notes-row">
              {selectedProduct.tastingNotes.map((note) => (
                <span key={note} className="mprod-note-pill">
                  <Sparkles size={11} style={{ color: TERRACOTTA }} /> {note}
                </span>
              ))}
            </div>

            {/* Sensory Bars */}
            <div className="mprod-sensory-grid">
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '10.5px',
                    fontWeight: 800,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: GOLD_LIGHT,
                    marginBottom: '6px',
                  }}
                >
                  <span>Velvet Richness</span>
                  <span>{selectedProduct.sensory.richness}%</span>
                </div>
                <div
                  style={{
                    height: '6px',
                    borderRadius: '9999px',
                    background: 'rgba(255, 248, 240, 0.08)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${selectedProduct.sensory.richness}%`,
                      height: '100%',
                      borderRadius: '9999px',
                      background: `linear-gradient(90deg, ${GOLD}, ${GOLD_LIGHT})`,
                      transition: 'width 0.35s ease',
                    }}
                  />
                </div>
              </div>

              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '10.5px',
                    fontWeight: 800,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: GOLD_LIGHT,
                    marginBottom: '6px',
                  }}
                >
                  <span>Sweetness</span>
                  <span>{selectedProduct.sensory.sweetness}%</span>
                </div>
                <div
                  style={{
                    height: '6px',
                    borderRadius: '9999px',
                    background: 'rgba(255, 248, 240, 0.08)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${selectedProduct.sensory.sweetness}%`,
                      height: '100%',
                      borderRadius: '9999px',
                      background: `linear-gradient(90deg, ${TERRACOTTA}, ${GOLD_LIGHT})`,
                      transition: 'width 0.35s ease',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* 20g Sachet vs 200g Family Pack Toggle */}
            <div>
              <div className="mprod-pack-switcher">
                {MELTI_PRODUCTS.map((pack, idx) => {
                  const active = idx === selectedIndex;
                  return (
                    <button
                      key={pack.id}
                      type="button"
                      onClick={() => handleSelectPack(idx)}
                      className="mprod-pack-tab"
                      style={{
                        background: active
                          ? 'rgba(212, 163, 115, 0.22)'
                          : 'transparent',
                        color: active ? CREAM : 'rgba(255, 248, 240, 0.62)',
                        border: active
                          ? '1px solid rgba(212, 163, 115, 0.45)'
                          : '1px solid transparent',
                      }}
                    >
                      {pack.packSize} • ₹{pack.price}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price, Quantity & Add to Pour Bag CTA */}
            <div className="mprod-buy-row">
              <div style={{ fontSize: '32px', fontWeight: 900, color: CREAM, minWidth: '82px' }}>
                ₹{selectedProduct.price * quantity}
              </div>

              <div className="mprod-qty-box">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="mprod-qty-btn"
                >
                  <Minus size={13} />
                </button>
                <span style={{ fontSize: '14px', fontWeight: 800, minWidth: '18px', textAlign: 'center' }}>
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Increase quantity"
                  className="mprod-qty-btn"
                >
                  <Plus size={13} />
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToBag}
                className="mprod-add-btn"
              >
                {justAdded ? (
                  <>
                    <Check size={16} /> Added to Bag
                  </>
                ) : (
                  <>
                    <ShoppingBag size={16} /> Add to Bag
                  </>
                )}
              </button>
            </div>

            {/* Link to Full Product Detail Page */}
            <div style={{ marginTop: '18px' }}>
              <Link
                href={`/products/${selectedProduct.slug}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: GOLD_LIGHT,
                  textDecoration: 'none',
                  opacity: 0.85,
                }}
              >
                View ingredients, nutrition & full pack details <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}