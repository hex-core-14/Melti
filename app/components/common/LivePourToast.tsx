// app/components/common/LivePourToast.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Flame } from 'lucide-react';

interface PourStory {
  id: number;
  name: string;
  city: string;
  avatarEmoji: string;
  line: string;
  blendTag: string;
  timeAgo: string;
}

const POUR_STORIES: PourStory[] = [
  {
    id: 1,
    name: 'Aarav',
    city: 'Indiranagar, BLR',
    avatarEmoji: '🤎',
    line: 'just secured a 200g tin for late-night study pours.',
    blendTag: 'Midnight Velvet 72%',
    timeAgo: 'Just now',
  },
  {
    id: 2,
    name: 'Ananya',
    city: 'Bandra, BOM',
    avatarEmoji: '✨',
    line: 'ditched instant cocoa dust for 2 tins of roasted nut richness.',
    blendTag: 'Pistachio Hot Chocolate',
    timeAgo: '1m ago',
  },
  {
    id: 3,
    name: 'Kabir',
    city: 'Koramangala, BLR',
    avatarEmoji: '☕',
    line: 'unlocked free cold-pack shipping on a 3-tin weekend stash.',
    blendTag: 'Midnight Pour Bundle',
    timeAgo: '2m ago',
  },
  {
    id: 4,
    name: 'Meera',
    city: 'Hauz Khas, DEL',
    avatarEmoji: '🍫',
    line: 'grabbed a 400g refill pouch—cozy evening ritual sorted.',
    blendTag: 'Burnt Caramel & Sea Salt',
    timeAgo: 'Moments ago',
  },
  {
    id: 5,
    name: 'Rohan',
    city: 'Koregaon Park, PNQ',
    avatarEmoji: '🌿',
    line: 'snagged single-serve sachets for his 2 AM desk brew.',
    blendTag: 'Malabar Chai & Cacao',
    timeAgo: '3m ago',
  },
  {
    id: 6,
    name: 'Diya',
    city: 'Jubilee Hills, HYD',
    avatarEmoji: '🔥',
    line: 'redeemed MELTI150 on her first small-batch couverture order.',
    blendTag: 'Hazelnut Praline 62%',
    timeAgo: 'Just now',
  },
  {
    id: 7,
    name: 'Ishaan',
    city: 'Salt Lake, CCU',
    avatarEmoji: '🌙',
    line: 'just joined the Midnight Pour Club & grabbed his starter tin.',
    blendTag: 'Midnight Velvet 72%',
    timeAgo: '4m ago',
  },
  {
    id: 8,
    name: 'Tara',
    city: 'Alwarpet, MAA',
    avatarEmoji: '🥄',
    line: 'ordered a tasting trio to host a Sunday hot chocolate bar.',
    blendTag: 'Signature Tasting Trio',
    timeAgo: '1m ago',
  },
];

const TOAST_CSS = `
.mpour-toast-wrap {
  position: fixed;
  left: 22px;
  bottom: 22px;
  z-index: 990;
  max-width: 356px;
  width: calc(100vw - 44px);
  pointer-events: none;
}

.mpour-toast-card {
  pointer-events: auto;
  position: relative;
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 13px 15px;
  border-radius: 20px;
  background: linear-gradient(145deg, rgba(36, 20, 11, 0.94) 0%, rgba(18, 11, 6, 0.97) 100%);
  border: 1px solid rgba(212, 163, 115, 0.34);
  box-shadow:
    0 18px 42px rgba(0, 0, 0, 0.62),
    0 0 0 1px rgba(255, 248, 240, 0.04) inset;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  cursor: pointer;
  overflow: hidden;
  transition: border-color 0.25s ease, transform 0.2s ease;
}

.mpour-toast-card:hover {
  border-color: rgba(235, 197, 147, 0.65);
  transform: translateY(-2px);
}

.mpour-mug-badge {
  position: relative;
  width: 46px;
  height: 46px;
  border-radius: 15px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at 30% 30%, rgba(235, 197, 147, 0.24), rgba(200, 109, 81, 0.16));
  border: 1px solid rgba(212, 163, 115, 0.38);
  font-size: 20px;
}

.mpour-close-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 22px;
  height: 22px;
  border-radius: 9999px;
  border: none;
  background: rgba(255, 248, 240, 0.06);
  color: rgba(235, 197, 147, 0.72);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;
}

.mpour-close-btn:hover {
  background: rgba(212, 163, 115, 0.2);
  color: #FFF8F0;
}

@media (max-width: 640px) {
  .mpour-toast-wrap {
    left: 14px;
    bottom: 14px;
    max-width: 315px;
    width: calc(100vw - 28px);
  }
  .mpour-toast-card {
    padding: 11px 13px;
    border-radius: 18px;
  }
}
`;

export default function LivePourToast() {
  const [visible, setVisible] = useState(false);
  const [storyIndex, setStoryIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [mutedForSession, setMutedForSession] = useState(false);

  // Pick a random starting story on client mount so every visit feels fresh
  useEffect(() => {
    setStoryIndex(Math.floor(Math.random() * POUR_STORIES.length));

    const initialTimer = setTimeout(() => {
      setVisible(true);
    }, 4000);

    return () => clearTimeout(initialTimer);
  }, []);

  // Cycle visibility: show for 5.5s -> hide for 7.5s -> show next story
  useEffect(() => {
    if (mutedForSession || isPaused) return;

    const timer = setTimeout(
      () => {
        if (visible) {
          setVisible(false);
        } else {
          setStoryIndex((prev) => (prev + 1) % POUR_STORIES.length);
          setVisible(true);
        }
      },
      visible ? 5500 : 7500
    );

    return () => clearTimeout(timer);
  }, [visible, isPaused, mutedForSession]);

  const handleCardClick = () => {
    const productsEl = document.getElementById('products');
    if (productsEl) {
      productsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setVisible(false);
  };

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setVisible(false);
    setMutedForSession(true);
  };

  if (mutedForSession) return null;

  const current = POUR_STORIES[storyIndex];

  return (
    <>
      <style>{TOAST_CSS}</style>

      <div className="mpour-toast-wrap" aria-live="polite">
        <AnimatePresence mode="wait">
          {visible && (
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 28, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.94 }}
              transition={{ type: 'spring', stiffness: 320, damping: 24 }}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onClick={handleCardClick}
              className="mpour-toast-card"
              role="status"
            >
              {/* Cute Animated Mug Avatar with Floating Steam */}
              <div className="mpour-mug-badge">
                <motion.span
                  animate={{ y: [-1, -5, -1], opacity: [0.35, 0.9, 0.35] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                  style={{
                    position: 'absolute',
                    top: '3px',
                    fontSize: '9px',
                    color: '#EBC593',
                    letterSpacing: '1px',
                    pointerEvents: 'none',
                  }}
                >
                  ≈
                </motion.span>
                <motion.span
                  animate={{ rotate: [0, -7, 7, 0] }}
                  transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
                >
                  {current.avatarEmoji}
                </motion.span>
              </div>

              {/* Story Copy */}
              <div style={{ flex: 1, paddingRight: '16px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginBottom: '3px',
                  }}
                >
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '3px',
                      fontSize: '9.5px',
                      fontWeight: 800,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: '#EBC593',
                    }}
                  >
                    <Flame size={10} style={{ color: '#C86D51' }} /> Fresh Pour
                  </span>
                  <span style={{ fontSize: '10px', color: 'rgba(235, 197, 147, 0.5)' }}>
                    • {current.timeAgo}
                  </span>
                </div>

                <p
                  style={{
                    margin: 0,
                    fontSize: '12px',
                    lineHeight: '17px',
                    color: '#FFF8F0',
                    fontWeight: 500,
                  }}
                >
                  <strong style={{ color: '#EBC593', fontWeight: 800 }}>
                    {current.name}
                  </strong>{' '}
                  <span style={{ color: 'rgba(255, 248, 240, 0.65)', fontSize: '11px' }}>
                    ({current.city})
                  </span>{' '}
                  {current.line}
                </p>

                <div
                  style={{
                    marginTop: '6px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '2px 9px',
                    borderRadius: '9999px',
                    background: 'rgba(212, 163, 115, 0.14)',
                    border: '1px solid rgba(212, 163, 115, 0.28)',
                    fontSize: '10px',
                    fontWeight: 800,
                    letterSpacing: '0.04em',
                    color: '#EBC593',
                  }}
                >
                  <Sparkles size={10} style={{ color: '#D4A373' }} />
                  {current.blendTag}
                </div>
              </div>

              {/* Subtle Bottom Progress Bar */}
              {!isPaused && (
                <motion.div
                  initial={{ scaleX: 1 }}
                  animate={{ scaleX: 0 }}
                  transition={{ duration: 5.5, ease: 'linear' }}
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    height: '2px',
                    transformOrigin: 'left',
                    background: 'linear-gradient(90deg, #D4A373, #C86D51)',
                  }}
                />
              )}

              <button
                type="button"
                onClick={handleDismiss}
                aria-label="Dismiss notification"
                title="Hide notifications"
                className="mpour-close-btn"
              >
                <X size={12} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}