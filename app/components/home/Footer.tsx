// app/components/home/Footer.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowUp, Check, Sparkles, MapPin, Mail } from 'lucide-react';




const CREAM = '#FFF8F0';
const COCOA = '#1A120B';
const COCOA_DEEP = '#120B06';
const GOLD = '#D4A373';
const GOLD_LIGHT = '#EBC593';
const TERRACOTTA = '#C86D51';

const FOOTER_CSS = `
.mft-wrapper {
  position: relative;
  background: radial-gradient(circle at 50% 0%, #231208 0%, ${COCOA_DEEP} 52%, #0A0503 100%);
  color: ${CREAM};
  overflow: hidden;
  border-top: 1px solid rgba(212, 163, 115, 0.16);
}

.mft-glow {
  position: absolute;
  width: 620px;
  height: 360px;
  border-radius: 9999px;
  background: radial-gradient(circle, rgba(212, 163, 115, 0.08) 0%, transparent 70%);
  top: -80px;
  left: 50%;
  transform: translateX(-50%);
  pointer-events: none;
}

.mft-container {
  max-width: 1220px;
  margin: 0 auto;
  padding: 72px 24px 36px;
  position: relative;
  z-index: 2;
}

/* ===== Top VIP Club Banner ===== */
.mft-vip-card {
  display: grid;
  grid-template-columns: 1.15fr 1fr;
  gap: 32px;
  align-items: center;
  padding: 36px 40px;
  border-radius: 28px;
  background: linear-gradient(135deg, rgba(43, 22, 11, 0.88) 0%, rgba(20, 12, 6, 0.96) 100%);
  border: 1px solid rgba(212, 163, 115, 0.28);
  box-shadow: 0 24px 54px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 248, 240, 0.08);
  margin-bottom: 64px;
}

@media (max-width: 900px) {
  .mft-vip-card {
    grid-template-columns: 1fr;
    padding: 28px 24px;
  }
}

.mft-vip-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: ${GOLD_LIGHT};
  margin-bottom: 10px;
}

.mft-vip-title {
  font-size: clamp(24px, 3.4vw, 34px);
  font-weight: 900;
  line-height: 1.12;
  margin: 0;
  color: ${CREAM};
  letter-spacing: -0.01em;
}

.mft-vip-accent {
  background: linear-gradient(135deg, ${GOLD_LIGHT} 0%, ${GOLD} 60%, ${TERRACOTTA} 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.mft-vip-sub {
  margin-top: 10px;
  font-size: 14px;
  line-height: 1.6;
  color: rgba(235, 197, 147, 0.76);
  max-width: 480px;
}

.mft-form {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px;
  border-radius: 9999px;
  background: rgba(10, 5, 3, 0.85);
  border: 1px solid rgba(212, 163, 115, 0.3);
  transition: border-color 0.25s ease, box-shadow 0.25s ease;
}

.mft-form:focus-within {
  border-color: ${GOLD_LIGHT};
  box-shadow: 0 0 0 3px rgba(212, 163, 115, 0.14);
}

.mft-input {
  flex: 1;
  min-width: 0;
  background: transparent;
  border: none;
  outline: none;
  padding: 10px 16px;
  font-size: 13.5px;
  color: ${CREAM};
}

.mft-input::placeholder {
  color: rgba(235, 197, 147, 0.45);
}

.mft-submit-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 12px 22px;
  border-radius: 9999px;
  border: none;
  cursor: pointer;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${COCOA};
  background: linear-gradient(135deg, ${GOLD_LIGHT} 0%, ${GOLD} 60%, #B9824F 100%);
  box-shadow: 0 6px 18px rgba(212, 163, 115, 0.25);
  transition: filter 0.2s ease, transform 0.12s ease;
  white-space: nowrap;
}

.mft-submit-btn:hover {
  filter: brightness(1.08);
}

.mft-submit-btn:active {
  transform: scale(0.97);
}

/* ===== 4-Column Main Grid ===== */
.mft-grid {
  display: grid;
  grid-template-columns: 1.4fr 0.9fr 1fr 1.1fr;
  gap: 40px;
  padding-bottom: 52px;
  border-bottom: 1px solid rgba(212, 163, 115, 0.14);
}

@media (max-width: 960px) {
  .mft-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 36px;
  }
}

@media (max-width: 580px) {
  .mft-grid {
    grid-template-columns: 1fr;
    gap: 32px;
  }
}

.mft-logo {
  display: inline-block;
  font-size: 28px;
  font-weight: 900;
  letter-spacing: 0.12em;
  color: ${CREAM};
  text-decoration: none;
}

.mft-brand-desc {
  margin-top: 14px;
  font-size: 13.5px;
  line-height: 1.65;
  color: rgba(235, 197, 147, 0.72);
  max-width: 300px;
}

.mft-col-title {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: ${GOLD};
  margin: 0 0 18px;
}

.mft-link-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.mft-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13.5px;
  font-weight: 600;
  color: rgba(255, 248, 240, 0.78);
  text-decoration: none;
  transition: color 0.2s ease, transform 0.2s ease;
}

.mft-link:hover {
  color: ${GOLD_LIGHT};
  transform: translateX(3px);
}

.mft-contact-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 13px;
  line-height: 1.55;
  color: rgba(255, 248, 240, 0.76);
  margin-bottom: 12px;
}

/* ===== Bottom Bar & Oversized Watermark ===== */
.mft-bottom {
  padding-top: 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 18px;
  font-size: 12px;
  color: rgba(235, 197, 147, 0.6);
}

.mft-socials {
  display: flex;
  align-items: center;
  gap: 10px;
}

.mft-social-btn {
  width: 38px;
  height: 38px;
  border-radius: 9999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${CREAM};
  background: rgba(255, 248, 240, 0.04);
  border: 1px solid rgba(212, 163, 115, 0.2);
  transition: all 0.22s ease;
}

.mft-social-btn:hover {
  background: ${GOLD};
  color: ${COCOA};
  border-color: ${GOLD};
  transform: translateY(-2px);
}

.mft-top-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 9999px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${GOLD_LIGHT};
  background: rgba(212, 163, 115, 0.08);
  border: 1px solid rgba(212, 163, 115, 0.24);
  cursor: pointer;
  transition: all 0.22s ease;
}

.mft-top-btn:hover {
  background: rgba(212, 163, 115, 0.18);
  border-color: ${GOLD};
}

.mft-watermark {
  margin-top: 32px;
  text-align: center;
  font-size: clamp(54px, 14vw, 168px);
  font-weight: 900;
  letter-spacing: 0.14em;
  line-height: 0.85;
  color: transparent;
  -webkit-text-stroke: 1px rgba(212, 163, 115, 0.11);
  user-select: none;
  pointer-events: none;
}
`;

function ArtisanalCraftSeal() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '20px' }}>
      <motion.svg
        width="54"
        height="54"
        viewBox="0 0 64 64"
        animate={{ rotate: 360 }}
        transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
        aria-hidden="true"
      >
        <defs>
          <path
            id="mft-seal-circle"
            d="M 32, 32 m -23, 0 a 23,23 0 1,1 46,0 a 23,23 0 1,1 -46,0"
          />
        </defs>
        <circle cx="32" cy="32" r="30" fill="#1D0F07" stroke={GOLD} strokeOpacity="0.45" strokeWidth="1.2" />
        <circle cx="32" cy="32" r="16" fill="none" stroke={GOLD} strokeOpacity="0.3" strokeWidth="1" strokeDasharray="2 2" />
        <text fontSize="5.4" fontWeight="800" letterSpacing="1.6" fill={GOLD_LIGHT}>
          <textPath href="#mft-seal-circle">
            SMALL-BATCH COUVERTURE • 100% REAL CACAO •
          </textPath>
        </text>
      </motion.svg>

      <div>
        <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: GOLD_LIGHT }}>
          100% Couverture Promise
        </div>
        <div style={{ fontSize: '12px', color: 'rgba(255, 248, 240, 0.65)', marginTop: '2px' }}>
          Zero compound powders. Crafted in India.
        </div>
      </div>
    </div>
  );
}

export default function Footer() {
  const [currentYear, setCurrentYear] = useState(2026);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail('');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="mft-wrapper">
      <style>{FOOTER_CSS}</style>
      <div className="mft-glow" />

      <div className="mft-container">
        {/* Top Inner Circle VIP Drop Card */}
        <div className="mft-vip-card">
          <div>
            <div className="mft-vip-eyebrow">
              <Sparkles size={14} /> The Midnight Pour Club
            </div>
            <h3 className="mft-vip-title">
              First dibs on <span className="mft-vip-accent">limited drops</span> &amp; secret recipes.
            </h3>
            <p className="mft-vip-sub">
              Join 12,000+ cocoa purists. Get early access to small-batch seasonal tins and 15% off your first order.
            </p>
          </div>

          <div>
            <AnimatePresence mode="wait">
              {!subscribed ? (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubscribe}
                  className="mft-form"
                >
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@domain.com"
                    aria-label="Email address for Melti Club"
                    className="mft-input"
                  />
                  <button type="submit" className="mft-submit-btn">
                    Join Club <ArrowRight size={14} />
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="confirmed"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    padding: '16px 20px',
                    borderRadius: '20px',
                    background: 'rgba(212, 163, 115, 0.12)',
                    border: '1px solid rgba(212, 163, 115, 0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    flexWrap: 'wrap',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '9999px',
                        background: GOLD,
                        color: COCOA,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Check size={16} strokeWidth={2.8} />
                    </span>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 800, color: CREAM }}>
                        You&apos;re in! Use code <span style={{ color: GOLD_LIGHT }}>FIRSTPOUR15</span>
                      </div>
                      <div style={{ fontSize: '11.5px', color: 'rgba(235, 197, 147, 0.75)' }}>
                        15% off your first tin at checkout.
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* 4-Column Footer Grid */}
        <div className="mft-grid">
          {/* Column 1: Brand & Seal */}
          <div>
            <Link href="/" className="mft-logo">
              MÈLTI<span style={{ color: GOLD }}>.</span>
            </Link>
            <p className="mft-brand-desc">
              Pouring velvet happiness, one small-batch artisanal cup at a time. Shaved from single-origin Indian couverture slabs.
            </p>
            <ArtisanalCraftSeal />
          </div>

          {/* Column 2: Explore */}
          <div>
            <h4 className="mft-col-title">The Pour Bar</h4>
            <ul className="mft-link-list">
              <li><Link href="#products" className="mft-link">Signature Blends</Link></li>
              <li><Link href="#why-melti" className="mft-link">Why Couverture</Link></li>
              <li><Link href="#recipes" className="mft-link">Whisk Rituals</Link></li>
              <li><Link href="#story" className="mft-link">Estate Provenance</Link></li>
              <li><Link href="#gifting" className="mft-link">Festive Gift Boxes</Link></li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div>
            <h4 className="mft-col-title">Care &amp; Policies</h4>
            <ul className="mft-link-list">
              <li><Link href="#shipping" className="mft-link">Insulated Shipping</Link></li>
              <li><Link href="#track" className="mft-link">Track Your Tin</Link></li>
              <li><Link href="#returns" className="mft-link">Freshness Guarantee</Link></li>
              <li><Link href="#privacy" className="mft-link">Privacy Policy</Link></li>
              <li><Link href="#terms" className="mft-link">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Column 4: Studio & Concierge */}
          <div>
            <h4 className="mft-col-title">Cocoa Concierge</h4>
            <div className="mft-contact-item">
              <MapPin size={16} style={{ color: GOLD, flexShrink: 0, marginTop: '2px' }} />
              <span>
                Small-Batch Roastery &amp; Studio,<br />
                Indiranagar, Bengaluru 560038
              </span>
            </div>
            <div className="mft-contact-item">
              <Mail size={16} style={{ color: GOLD, flexShrink: 0, marginTop: '2px' }} />
              <span>hello@meltichocolate.in</span>
            </div>
            <div
              style={{
                marginTop: '14px',
                padding: '10px 14px',
                borderRadius: '12px',
                background: 'rgba(255, 248, 240, 0.03)',
                border: '1px solid rgba(212, 163, 115, 0.16)',
                fontSize: '11.5px',
                color: 'rgba(235, 197, 147, 0.8)',
              }}
            >
              <strong>Dispatch Window:</strong> Mon – Sat, 10 AM – 7 PM IST
            </div>
          </div>
        </div>

        {/* Bottom Copyright, Socials & Back to Top */}
        <div className="mft-bottom">
          <div>
            © {currentYear} Mèlti Artisanal Foods Pvt. Ltd. • FSSAI Lic. 1122600000XXXX
          </div>

          <div className="mft-socials">
            {/* Instagram */}
            <Link href="#instagram" className="mft-social-btn" aria-label="Melti on Instagram">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </Link>

            {/* X / Twitter */}
            <Link href="#twitter" className="mft-social-btn" aria-label="Melti on X">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </Link>

            {/* YouTube */}
            <Link href="#youtube" className="mft-social-btn" aria-label="Melti on YouTube">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </Link>
          </div>

          <button onClick={scrollToTop} className="mft-top-btn" aria-label="Scroll back to top">
            Back to Top <ArrowUp size={13} />
          </button>
        </div>

        {/* Subtle Outlined Brand Watermark */}
        <div className="mft-watermark" aria-hidden="true">
          MÈLTI.
        </div>
      </div>
    </footer>
  );
}