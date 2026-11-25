// app/components/loader/HotChocolateLoader.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { LOADER_TAGLINES } from '../../config/loaderConfig';

interface LoaderProps {
  /** Fires once the whole sequence (fill -> flood -> swoosh) has finished. Unmount the loader here. */
  onLoadingComplete: () => void;
  /** Optional. Fires when the swoosh starts lifting, so you can make sure the landing page is mounted underneath. */
  onReveal?: () => void;
  /** How long the pour/fill takes. The flood + swoosh play after this (~2s extra). */
  minimumLoadTimeMs?: number;
}

/**
 * Scene geometry (all px, relative to the 240x280 scene container).
 *
 * Pitcher: left 8 / top 15, 81x91 outer box, pivots around its bottom-right
 * corner and tilts clockwise by POUR_TILT. That puts the spout tip at
 * roughly (126, 45), which is where STREAM_PATH begins.
 *
 * Mug: left 50 / bottom 15, 138x118 outer box -> interior floor at y=261,
 * interior height 110, rim at y=147. The stream lands at x≈141 (87px inside
 * the mug's 130px interior width).
 */
const POUR_TILT = 24;
const MUG_INNER_BOTTOM = 261;
const MUG_INNER_HEIGHT = 110;
const LIQUID_FILL = 0.85;
const LIQUID_SURFACE_Y = MUG_INNER_BOTTOM - MUG_INNER_HEIGHT * LIQUID_FILL; // 167.5

const STREAM_PATH =
  'M 124.2 39.1 C 135.2 44.2, 144.6 80, 144.5 125 L 144.5 262 ' +
  'L 137.5 262 L 137.5 125 C 137.4 80, 131.7 52, 120.6 47.3 Z';

const STREAM_HIGHLIGHT_PATH =
  'M 123.0 41.5 C 133.2 46.8, 140.4 80, 140.3 125 L 140.3 262 ' +
  'L 138.8 262 L 138.8 125 C 138.7 80, 132.2 49, 121.8 44.2 Z';

const CHOCOLATE = '#582F0E';
const LIQUID_LIGHT = '#6E3A15';
const GOLD = '#D4A373';
const GOLD_LIGHT = '#EBC593';
const CREAM = '#FFF8F0';

// Curved trailing edge for the swoosh layers (slopes down to the left).
const SWOOSH_EDGE = 'M0 0 H1440 V30 C 1050 30 760 190 0 200 Z';
const SWOOSH_EASE: [number, number, number, number] = [0.76, 0, 0.24, 1];

type Phase = 'loading' | 'expanding' | 'swoosh';

const AMBIENT_MOTES = [
  { left: '22%', top: '34%', size: 4, delay: 0, duration: 3.6 },
  { left: '76%', top: '28%', size: 5, delay: 0.8, duration: 4.2 },
  { left: '30%', top: '64%', size: 3.5, delay: 1.4, duration: 3.8 },
  { left: '72%', top: '60%', size: 4.5, delay: 0.4, duration: 4.5 },
  { left: '48%', top: '20%', size: 3, delay: 1.9, duration: 3.4 },
];

function SwooshLayer({
  color,
  delay,
  onDone,
}: {
  color: string;
  delay: number;
  onDone?: () => void;
}) {
  return (
    <motion.div
      initial={{ y: '0%' }}
      animate={{ y: '-125%' }}
      transition={{ duration: 0.9, delay, ease: SWOOSH_EASE }}
      onAnimationComplete={onDone}
      style={{ position: 'absolute', inset: 0, background: color, willChange: 'transform' }}
    >
      <svg
        viewBox="0 0 1440 200"
        preserveAspectRatio="none"
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: 0,
          top: 'calc(100% - 1px)',
          width: '100%',
          height: '18vh',
          display: 'block',
        }}
      >
        <path d={SWOOSH_EDGE} fill={color} />
      </svg>
    </motion.div>
  );
}

export default function HotChocolateLoader({
  onLoadingComplete,
  onReveal,
  minimumLoadTimeMs = 4000,
}: LoaderProps) {
  const [taglineIndex, setTaglineIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<Phase>('loading');
  const [burst, setBurst] = useState({ cx: 0, cy: 0, radius: 0 });

  const sceneRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const onCompleteRef = useRef(onLoadingComplete);
  const onRevealRef = useRef(onReveal);
  const reduceRef = useRef(reduceMotion);
  useEffect(() => {
    onCompleteRef.current = onLoadingComplete;
    onRevealRef.current = onReveal;
    reduceRef.current = reduceMotion;
  });

  useEffect(() => {
    const startTime = performance.now();

    const taglineInterval = setInterval(() => {
      setTaglineIndex((prev) => (prev + 1) % LOADER_TAGLINES.length);
    }, 1250);

    const progressInterval = setInterval(() => {
      const elapsed = performance.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / minimumLoadTimeMs) * 100));
      setProgress(pct);
    }, 40);

    const timer = setTimeout(() => {
      setProgress(100);
      if (reduceRef.current) {
        onRevealRef.current?.();
        onCompleteRef.current();
        return;
      }
      const rect = sceneRef.current?.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const cx = rect ? rect.left + 119 : vw / 2;
      const cy = rect ? rect.top + 215 : vh / 2;
      const radius = Math.hypot(Math.max(cx, vw - cx), Math.max(cy, vh - cy)) + 4;
      setBurst({ cx, cy, radius });
      setPhase('expanding');
    }, minimumLoadTimeMs);

    return () => {
      clearInterval(taglineInterval);
      clearInterval(progressInterval);
      clearTimeout(timer);
    };
  }, [minimumLoadTimeMs]);

  useEffect(() => {
    if (phase === 'swoosh') onRevealRef.current?.();
  }, [phase]);

  const totalSec = minimumLoadTimeMs / 1000;
  const pourDelay = Math.min(0.5, totalSec * 0.12);
  const riseDuration = (totalSec - pourDelay) * 0.85;

  const riseTransition = {
    duration: riseDuration,
    delay: pourDelay,
    ease: 'easeInOut' as const,
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100dvh',
        zIndex: 9999,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background:
          phase === 'swoosh'
            ? 'transparent'
            : 'radial-gradient(circle at 50% 44%, #2E170B 0%, #170D07 48%, #0E0704 85%)',
        color: CREAM,
        userSelect: 'none',
      }}
    >
      {phase !== 'swoosh' && (
        <>
          {/* Warm Studio Halo Behind Scene */}
          <motion.div
            animate={{ scale: [1, 1.08, 1], opacity: [0.45, 0.7, 0.45] }}
            transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              width: '340px',
              height: '340px',
              borderRadius: '9999px',
              background: 'radial-gradient(circle, rgba(212, 163, 115, 0.16) 0%, transparent 70%)',
              filter: 'blur(24px)',
              pointerEvents: 'none',
            }}
          />

          {/* Floating Golden Cocoa Motes */}
          {AMBIENT_MOTES.map((mote, i) => (
            <motion.span
              key={i}
              animate={{
                y: [0, -24, 0],
                opacity: [0.15, 0.65, 0.15],
                scale: [0.9, 1.2, 0.9],
              }}
              transition={{
                duration: mote.duration,
                delay: mote.delay,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{
                position: 'absolute',
                left: mote.left,
                top: mote.top,
                width: `${mote.size}px`,
                height: `${mote.size}px`,
                borderRadius: '9999px',
                background: GOLD_LIGHT,
                boxShadow: `0 0 10px ${GOLD}`,
                pointerEvents: 'none',
              }}
            />
          ))}

          {/* Top Editorial Brand Mark */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{
              marginBottom: '12px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span
              style={{
                fontSize: '20px',
                fontWeight: 900,
                letterSpacing: '0.2em',
                color: CREAM,
              }}
            >
              MÈLTI<span style={{ color: GOLD }}>.</span>
            </span>
            <span
              style={{
                fontSize: '9.5px',
                fontWeight: 800,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'rgba(235, 197, 147, 0.65)',
              }}
            >
              Small-Batch Couverture
            </span>
          </motion.div>

          {/* Scene Container (Exact Geometry Preserved) */}
          <div
            ref={sceneRef}
            style={{
              position: 'relative',
              width: '240px',
              height: '280px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {/* Studio Tabletop Shadow Under Mug */}
            <div
              style={{
                position: 'absolute',
                bottom: '7px',
                left: '36px',
                width: '168px',
                height: '18px',
                borderRadius: '9999px',
                background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.75) 0%, transparent 72%)',
                pointerEvents: 'none',
                zIndex: 10,
              }}
            />

            {/* 1. Pitcher */}
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: POUR_TILT }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              style={{
                boxSizing: 'content-box',
                position: 'absolute',
                top: '15px',
                left: '8px',
                width: '75px',
                height: '85px',
                background: `linear-gradient(135deg, ${GOLD_LIGHT} 0%, ${GOLD} 50%, #B9824F 100%)`,
                borderRadius: '10px 10px 24px 24px',
                border: `3px solid ${CHOCOLATE}`,
                transformOrigin: 'bottom right',
                boxShadow:
                  '0 14px 24px rgba(0,0,0,0.55), inset -8px -10px 16px rgba(88,47,14,0.32), inset 5px 5px 10px rgba(255,255,255,0.28)',
                zIndex: 30,
              }}
            >
              {/* Dotted cream band */}
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: '30px',
                  height: '12px',
                  borderTop: `2px solid ${CHOCOLATE}`,
                  borderBottom: `2px solid ${CHOCOLATE}`,
                  background:
                    'radial-gradient(circle, #8C3002 1.6px, transparent 1.8px) 0 0 / 10px 12px, #FFF3E2',
                  opacity: 0.95,
                }}
              />

              {/* Glossy highlights */}
              <div
                style={{
                  position: 'absolute',
                  left: '9px',
                  top: '10px',
                  width: '8px',
                  height: '16px',
                  borderRadius: '9999px',
                  background: 'linear-gradient(rgba(255,255,255,0.68), rgba(255,255,255,0))',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: '9px',
                  top: '50px',
                  width: '8px',
                  height: '18px',
                  borderRadius: '9999px',
                  background: 'linear-gradient(rgba(255,255,255,0.42), rgba(255,255,255,0))',
                }}
              />

              {/* Open spout */}
              <div
                style={{
                  position: 'absolute',
                  top: '8px',
                  right: '-12px',
                  width: '12px',
                  height: '18px',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: 0,
                    height: '4.5px',
                    boxSizing: 'border-box',
                    background: GOLD,
                    borderTop: `2px solid ${CHOCOLATE}`,
                    borderRight: `2px solid ${CHOCOLATE}`,
                    borderTopRightRadius: '3px',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: '4.5px',
                    height: '9px',
                    background: `linear-gradient(to right, ${CHOCOLATE}, ${LIQUID_LIGHT})`,
                    boxShadow: 'inset 0 1.5px 0 rgba(230,197,148,0.45)',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: '13.5px',
                    height: '4.5px',
                    boxSizing: 'border-box',
                    background: '#C48F5C',
                    borderBottom: `2px solid ${CHOCOLATE}`,
                    borderRight: `2px solid ${CHOCOLATE}`,
                    borderBottomRightRadius: '3px',
                  }}
                />
              </div>

              {/* Handle */}
              <div
                style={{
                  boxSizing: 'content-box',
                  position: 'absolute',
                  left: '-18px',
                  top: '20px',
                  width: '15px',
                  height: '42px',
                  border: `3px solid ${CHOCOLATE}`,
                  borderRight: 'none',
                  borderTopLeftRadius: '12px',
                  borderBottomLeftRadius: '12px',
                }}
              />
            </motion.div>

            {/* 2. Pour Stream */}
            <motion.div
              initial={{ height: MUG_INNER_BOTTOM }}
              animate={{ height: LIQUID_SURFACE_Y + 2 }}
              transition={riseTransition}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '240px',
                overflow: 'hidden',
                pointerEvents: 'none',
                zIndex: 25,
              }}
            >
              <motion.div
                initial={{ clipPath: 'inset(0 0 100% 0)' }}
                animate={{ clipPath: 'inset(0 0 0% 0)' }}
                transition={{ duration: 0.45, delay: pourDelay, ease: 'easeIn' }}
                style={{ width: '240px', height: '280px' }}
              >
                <svg
                  width="240"
                  height="280"
                  viewBox="0 0 240 280"
                  style={{ display: 'block' }}
                  aria-hidden="true"
                >
                  <defs>
                    <linearGradient
                      id="hc-stream-gradient"
                      gradientUnits="userSpaceOnUse"
                      x1="137.5"
                      y1="0"
                      x2="144.5"
                      y2="0"
                    >
                      <stop offset="0" stopColor={LIQUID_LIGHT} />
                      <stop offset="0.5" stopColor={CHOCOLATE} />
                      <stop offset="1" stopColor="#46230A" />
                    </linearGradient>
                  </defs>
                  <path d={STREAM_PATH} fill="url(#hc-stream-gradient)" />
                  {/* Glossy specular sheen along the falling cocoa */}
                  <path d={STREAM_HIGHLIGHT_PATH} fill={GOLD_LIGHT} opacity="0.28" />
                </svg>
              </motion.div>
            </motion.div>

            {/* Steam Wisps */}
            {[
              { left: 158, offset: 0 },
              { left: 170, offset: 0.9 },
              { left: 182, offset: 1.7 },
            ].map((w) => (
              <motion.div
                key={w.left}
                initial={{ opacity: 0, y: 0, scaleX: 1 }}
                animate={{ opacity: [0, 0.48, 0], y: [0, -48], scaleX: [1, 1.75] }}
                transition={{
                  duration: 2.8,
                  delay: pourDelay + 0.8 + w.offset,
                  repeat: Infinity,
                  ease: 'easeOut',
                }}
                style={{
                  position: 'absolute',
                  left: `${w.left}px`,
                  top: '100px',
                  width: '8px',
                  height: '34px',
                  borderRadius: '9999px',
                  background: 'rgba(255, 248, 240, 0.36)',
                  filter: 'blur(5px)',
                  pointerEvents: 'none',
                  zIndex: 22,
                }}
              />
            ))}

            {/* 3. Mug */}
            <div
              style={{
                boxSizing: 'content-box',
                position: 'absolute',
                bottom: '15px',
                left: '50px',
                width: '130px',
                height: '110px',
                background: 'linear-gradient(100deg, #FFFDF9 0%, #FFF4E6 55%, #ECD2B2 100%)',
                borderBottomLeftRadius: '28px',
                borderBottomRightRadius: '28px',
                border: `4px solid ${CHOCOLATE}`,
                boxShadow:
                  '0 25px 35px rgba(0, 0, 0, 0.72), 0 0 44px rgba(212, 163, 115, 0.14), inset -10px 0 16px rgba(88, 47, 14, 0.12)',
                zIndex: 20,
              }}
            >
              {/* Handle */}
              <div
                style={{
                  boxSizing: 'content-box',
                  position: 'absolute',
                  right: '-26px',
                  top: '22px',
                  width: '22px',
                  height: '54px',
                  border: `4px solid ${CHOCOLATE}`,
                  borderLeft: 'none',
                  borderTopRightRadius: '16px',
                  borderBottomRightRadius: '16px',
                  backgroundColor: 'transparent',
                }}
              />

              {/* Interior clip */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  overflow: 'hidden',
                  borderBottomLeftRadius: '24px',
                  borderBottomRightRadius: '24px',
                }}
              >
                {/* Rising Hot Chocolate Fill */}
                <motion.div
                  initial={{ height: '0%' }}
                  animate={{ height: `${LIQUID_FILL * 100}%` }}
                  transition={riseTransition}
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    width: '100%',
                    background: 'linear-gradient(to bottom, #723E19 0%, #582F0E 42%, #3B1C07 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  {/* Crema / Froth Surface Line */}
                  <div
                    style={{
                      width: '100%',
                      height: '6px',
                      background: 'linear-gradient(#F5E0BD, #C9A06A)',
                      opacity: 0.9,
                    }}
                  />

                  {/* Animated Splash Crown & Ripples at Stream Impact (x = 87px) */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.4 }}
                    animate={{ opacity: [0, 1, 0.85, 1], scale: [0.6, 1.15, 0.9, 1.1] }}
                    transition={{
                      delay: pourDelay + 0.35,
                      duration: 0.65,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    style={{
                      position: 'absolute',
                      top: '-7px',
                      left: '73px',
                      width: '28px',
                      height: '12px',
                      pointerEvents: 'none',
                    }}
                  >
                    <svg width="28" height="12" viewBox="0 0 28 12" style={{ overflow: 'visible' }}>
                      {/* Left & right splash droplets */}
                      <circle cx="4" cy="4" r="2" fill="#F5E0BD" />
                      <circle cx="24" cy="3" r="1.8" fill="#F5E0BD" />
                      <ellipse
                        cx="14"
                        cy="8"
                        rx="11"
                        ry="2.5"
                        fill="none"
                        stroke="#F5E0BD"
                        strokeWidth="1.3"
                        opacity="0.85"
                      />
                    </svg>
                  </motion.div>

                  {/* Rising Micro-Bubbles Inside Cocoa */}
                  {[
                    { left: '26%', size: 4, delay: 0.4 },
                    { left: '66%', size: 5, delay: 0.9 },
                    { left: '48%', size: 3.5, delay: 1.3 },
                  ].map((b, idx) => (
                    <motion.span
                      key={idx}
                      animate={{ y: [28, -4], opacity: [0, 0.55, 0] }}
                      transition={{
                        duration: 1.4,
                        delay: pourDelay + b.delay,
                        repeat: Infinity,
                        ease: 'easeOut',
                      }}
                      style={{
                        position: 'absolute',
                        top: '12px',
                        left: b.left,
                        width: `${b.size}px`,
                        height: `${b.size}px`,
                        borderRadius: '9999px',
                        border: '1px solid rgba(245, 224, 189, 0.65)',
                        pointerEvents: 'none',
                      }}
                    />
                  ))}
                </motion.div>

                {/* Embossed Mèlti Crest on Mug Front */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    pointerEvents: 'none',
                    zIndex: 4,
                  }}
                >
                  <div
                    style={{
                      padding: '4px 10px',
                      borderRadius: '9999px',
                      background: 'rgba(255, 248, 240, 0.86)',
                      border: `1.5px solid ${GOLD}`,
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.22)',
                      fontSize: '10px',
                      fontWeight: 900,
                      letterSpacing: '0.16em',
                      color: CHOCOLATE,
                    }}
                  >
                    MÈLTI.
                  </div>
                </div>

                {/* Glass shine across the mug interior */}
                <div
                  style={{
                    position: 'absolute',
                    left: '10px',
                    top: '12px',
                    width: '9px',
                    height: '70px',
                    borderRadius: '9999px',
                    background: 'linear-gradient(rgba(255,255,255,0.58), rgba(255,255,255,0))',
                    zIndex: 5,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Dynamic Tagline with AnimatePresence */}
          <div
            style={{
              height: '36px',
              marginTop: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AnimatePresence mode="wait">
              <motion.p
                key={taglineIndex}
                initial={{ opacity: 0, y: 7 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -7 }}
                transition={{ duration: 0.26 }}
                style={{
                  fontSize: '1.15rem',
                  fontWeight: 600,
                  letterSpacing: '0.03em',
                  color: GOLD_LIGHT,
                  margin: 0,
                }}
              >
                {LOADER_TAGLINES[taglineIndex]}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Sleek Gold Progress Bar + Percentage Readout */}
          <div
            style={{
              marginTop: '14px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <div
              style={{
                width: '200px',
                height: '5px',
                backgroundColor: 'rgba(255, 248, 240, 0.08)',
                border: '1px solid rgba(212, 163, 115, 0.2)',
                borderRadius: '9999px',
                overflow: 'hidden',
              }}
            >
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: minimumLoadTimeMs / 1000, ease: 'linear' }}
                style={{
                  height: '100%',
                  borderRadius: '9999px',
                  background: `linear-gradient(90deg, ${GOLD}, ${GOLD_LIGHT}, #C86D51)`,
                }}
              />
            </div>

            <span
              style={{
                fontSize: '10.5px',
                fontWeight: 800,
                letterSpacing: '0.16em',
                fontVariantNumeric: 'tabular-nums',
                color: 'rgba(235, 197, 147, 0.7)',
              }}
            >
              POURING {progress}%
            </span>
          </div>
        </>
      )}

      {/* Flood: cocoa expands from the mug until it covers the whole page */}
      {phase === 'expanding' && (
        <motion.div
          initial={{ clipPath: `circle(0px at ${burst.cx}px ${burst.cy}px)` }}
          animate={{ clipPath: `circle(${burst.radius}px at ${burst.cx}px ${burst.cy}px)` }}
          transition={{ duration: 0.85, ease: [0.7, 0, 0.3, 1] }}
          onAnimationComplete={() => setPhase('swoosh')}
          style={{
            position: 'absolute',
            inset: 0,
            background: CHOCOLATE,
            zIndex: 50,
          }}
        />
      )}

      {/* Swoosh: three layers sweep upward, leading with cocoa, revealing the page */}
      {phase === 'swoosh' && (
        <>
          <SwooshLayer color="#FFF3E2" delay={0.24} onDone={() => onCompleteRef.current()} />
          <SwooshLayer color={GOLD} delay={0.12} />
          <SwooshLayer color={CHOCOLATE} delay={0} />
        </>
      )}
    </div>
  );
}