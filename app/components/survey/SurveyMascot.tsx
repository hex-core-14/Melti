// app/components/survey/SurveyMascot.tsx
'use client';

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  motion,
  AnimatePresence,
  animate,
  useMotionValue,
  useReducedMotion,
} from 'framer-motion';
import { Sparkles, ArrowUpRight, X } from 'lucide-react';

interface SurveyMascotProps {
  surveyUrl: string;
  onDismiss: () => void;
}

type Phase = 'running-in' | 'asking' | 'farewell' | 'leaving';
type Gait = 'run' | 'walk' | 'idle';
type LeaveDir = 'left' | 'right';

const CHOCOLATE = '#582F0E';
const CHOCOLATE_DEEP = '#2B160B';
const CARAMEL = '#D4A373';
const GOLD_LIGHT = '#EBC593';
const CREAM = '#FFF8F0';
const TERRACOTTA = '#8C3002';

const MELTI_CSS = `
.melti-overlay {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100dvh;
  z-index: 10000;
  overflow: hidden;
  pointer-events: none;
  user-select: none;
}

.melti-actor-stage {
  position: absolute;
  left: 50%;
  top: 55%;
  width: 160px;
  height: 190px;
  margin-left: -80px;
  margin-top: -12px;
  flex-shrink: 0;
  z-index: 2;
}

.melti-svg {
  display: block;
  width: 160px;
  height: 190px;
  overflow: visible;
  flex-shrink: 0;
}

.melti-run {
  --cycle: .46s;
  --leg: 32deg;
  --lift: -9px;
  --arm-f: -58deg;
  --arm-b: 40deg;
  --lean: 8deg;
  --bob: -6px;
}

.melti-walk {
  --cycle: 1s;
  --leg: 20deg;
  --lift: -5px;
  --arm-f: -28deg;
  --arm-b: 24deg;
  --lean: 2deg;
  --bob: -3px;
}

.melti-run .m-leg,
.melti-walk .m-leg {
  animation: m-leg var(--cycle) linear infinite;
}

.melti-run .m-arm,
.melti-walk .m-arm {
  animation: m-arm var(--cycle) linear infinite;
}

.melti-run .m-body,
.melti-walk .m-body {
  animation: m-body var(--cycle) linear infinite;
}

.melti-run .m-shadow,
.melti-walk .m-shadow {
  animation: m-shadow var(--cycle) linear infinite;
}

.melti-run .m-leg-r,
.melti-walk .m-leg-r,
.melti-run .m-arm-l,
.melti-walk .m-arm-l {
  animation-delay: calc(var(--cycle) * -0.5);
}

.melti-run .m-speed-lines {
  animation: m-dash .46s ease-in-out infinite alternate;
}

@keyframes m-dash {
  from { opacity: 0.35; transform: translateX(0); }
  to { opacity: 0.85; transform: translateX(-6px); }
}

@keyframes m-leg {
  0% {
    transform: translateY(0) rotate(var(--leg));
    animation-timing-function: ease-in-out;
  }
  25% {
    transform: translateY(var(--lift)) rotate(0deg);
    animation-timing-function: ease-in-out;
  }
  50% {
    transform: translateY(0) rotate(calc(var(--leg) * -1));
    animation-timing-function: linear;
  }
  100% {
    transform: translateY(0) rotate(var(--leg));
  }
}

@keyframes m-arm {
  0% { transform: rotate(var(--arm-b)); }
  50% { transform: rotate(var(--arm-f)); }
  100% { transform: rotate(var(--arm-b)); }
}

@keyframes m-body {
  0% {
    transform: translateY(0) rotate(calc(var(--lean) + 1.5deg));
  }
  25% {
    transform: translateY(var(--bob)) rotate(var(--lean));
  }
  50% {
    transform: translateY(0) rotate(calc(var(--lean) - 1.5deg));
  }
  75% {
    transform: translateY(var(--bob)) rotate(var(--lean));
  }
  100% {
    transform: translateY(0) rotate(calc(var(--lean) + 1.5deg));
  }
}

@keyframes m-shadow {
  0%, 50%, 100% { transform: scaleX(1); }
  25%, 75% { transform: scaleX(.84); }
}

.melti-idle .m-body {
  animation:
    m-plant .45s ease-out,
    m-breathe 2.6s ease-in-out .45s infinite;
}

@keyframes m-plant {
  0% { transform: translateY(0) rotate(8deg); }
  35% { transform: translateY(4px) scaleY(.94) rotate(0deg); }
  100% { transform: translateY(0) rotate(0deg); }
}

@keyframes m-breathe {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-2.5px); }
}

.melti-idle .m-arm-r {
  animation: m-wave .65s ease-in-out infinite alternate;
}

@keyframes m-wave {
  from { transform: rotate(-138deg); }
  to { transform: rotate(-168deg); }
}

.m-eyes {
  transform-box: fill-box;
  transform-origin: center;
  animation: m-blink 4s infinite;
}

@keyframes m-blink {
  0%, 92%, 100% { transform: scaleY(1); }
  96% { transform: scaleY(.1); }
}

/* ===== Melti's Artisanal Thought Cloud ===== */
.melti-cloud-anchor {
  position: absolute;
  bottom: calc(100% + 12px);
  left: 50%;
  transform: translateX(-50%);
  pointer-events: auto;
  z-index: 10;
}

.melti-thought-cloud {
  position: relative;
  width: min(368px, calc(100vw - 32px));
  padding: 24px 24px 22px;
  background: linear-gradient(165deg, #FFFDF9 0%, #FFF5E4 62%, #F7E5C8 100%);
  border: 2.5px solid ${CARAMEL};
  border-radius: 34px;
  box-shadow:
    0 10px 0 rgba(43, 22, 11, 0.22),
    0 24px 48px rgba(0, 0, 0, 0.45),
    inset 0 2px 0 rgba(255, 255, 255, 0.9);
  color: ${CHOCOLATE_DEEP};
  text-align: center;
}

/* Thought bubbles leading down to Melti */
.melti-thought-cloud::before,
.melti-thought-cloud::after {
  content: "";
  position: absolute;
  background: #FFF6E7;
  border: 2.5px solid ${CARAMEL};
  border-radius: 50%;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
}

.melti-thought-cloud::before {
  width: 18px;
  height: 18px;
  bottom: -23px;
  left: 54%;
}

.melti-thought-cloud::after {
  width: 10px;
  height: 10px;
  bottom: -38px;
  left: 60%;
}

.melti-cloud-close {
  position: absolute;
  top: 14px;
  right: 14px;
  width: 28px;
  height: 28px;
  border-radius: 9999px;
  border: 1px solid rgba(88, 47, 14, 0.16);
  background: rgba(88, 47, 14, 0.06);
  color: ${CHOCOLATE};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.15s ease;
}

.melti-cloud-close:hover {
  background: rgba(88, 47, 14, 0.14);
  transform: scale(1.06);
}

.melti-cloud-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: 9999px;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${TERRACOTTA};
  background: rgba(212, 163, 115, 0.22);
  border: 1px solid rgba(212, 163, 115, 0.55);
  margin-bottom: 12px;
}

.melti-cloud-title {
  font-size: 18px;
  font-weight: 900;
  line-height: 1.25;
  letter-spacing: -0.01em;
  color: ${CHOCOLATE_DEEP};
  margin: 0;
}

.melti-cloud-body {
  margin: 8px 0 0;
  font-size: 13.5px;
  line-height: 1.55;
  font-weight: 600;
  color: #5C3A21;
}

.melti-cloud-actions {
  margin-top: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}

.melti-cloud-yes {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: linear-gradient(135deg, #6E3A15 0%, ${CHOCOLATE} 55%, #3B1C07 100%);
  color: ${CREAM};
  border: 1.5px solid ${CARAMEL};
  border-radius: 9999px;
  padding: 11px 20px;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  box-shadow: 0 5px 0 #2B1305, 0 10px 20px rgba(43, 19, 5, 0.28);
  cursor: pointer;
  transition: transform 0.18s ease, box-shadow 0.18s ease, filter 0.18s ease;
}

.melti-cloud-yes:hover {
  transform: translateY(-2px);
  box-shadow: 0 7px 0 #2B1305, 0 14px 24px rgba(43, 19, 5, 0.34);
  filter: brightness(1.06);
}

.melti-cloud-yes:active {
  transform: translateY(1px);
  box-shadow: 0 3px 0 #2B1305;
}

.melti-cloud-no {
  background: rgba(212, 163, 115, 0.22);
  color: ${CHOCOLATE};
  border: 1.5px solid rgba(88, 47, 14, 0.22);
  border-radius: 9999px;
  padding: 11px 18px;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 0.18s ease, transform 0.18s ease;
}

.melti-cloud-no:hover {
  background: rgba(212, 163, 115, 0.38);
  transform: translateY(-2px);
}

@media (prefers-reduced-motion: reduce) {
  .melti-svg *,
  .melti-cloud-yes,
  .melti-cloud-no {
    animation: none !important;
    transition: none !important;
  }
}
`;

const pivot = (x: number, y: number): React.CSSProperties => ({
  transformOrigin: `${x}px ${y}px`,
  transformBox: 'view-box',
});

function Melti({
  gait,
  facing,
  happyEyes,
}: {
  gait: Gait;
  facing: 1 | -1;
  happyEyes: boolean;
}) {
  const mouthOpen = gait === 'run';

  return (
    <div
      style={{
        width: 160,
        minWidth: 160,
        height: 190,
        flexShrink: 0,
        transform: `scaleX(${facing})`,
        transformOrigin: 'center',
      }}
    >
      <svg
        viewBox="0 0 160 190"
        width="160"
        height="190"
        className={`melti-svg melti-${gait}`}
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Melti, the artisanal chocolate bar mascot"
      >
        <defs>
          <linearGradient id="melti-body-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#9A5626" />
            <stop offset="55%" stopColor="#6E3A17" />
            <stop offset="100%" stopColor="#4B240C" />
          </linearGradient>

          <linearGradient id="melti-foil-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#B9824F" />
            <stop offset="35%" stopColor={GOLD_LIGHT} />
            <stop offset="70%" stopColor={CARAMEL} />
            <stop offset="100%" stopColor="#9E6A38" />
          </linearGradient>
        </defs>

        {/* Running Speed Streaks (visible only while sprinting) */}
        {gait === 'run' && (
          <g className="m-speed-lines" stroke={GOLD_LIGHT} strokeLinecap="round">
            <line x1="8" y1="88" x2="30" y2="88" strokeWidth="2.5" />
            <line x1="2" y1="106" x2="26" y2="106" strokeWidth="2" />
            <line x1="12" y1="124" x2="32" y2="124" strokeWidth="2.5" />
          </g>
        )}

        {/* Ground shadow */}
        <ellipse
          className="m-shadow"
          cx="80"
          cy="178"
          rx="40"
          ry="6.5"
          fill="rgba(0,0,0,0.42)"
          style={pivot(80, 178)}
        />

        {/* Left Leg */}
        <g className="m-leg m-leg-l" style={pivot(64, 132)}>
          <path
            d="M64 132 V168"
            stroke={CHOCOLATE}
            strokeWidth="10"
            strokeLinecap="round"
          />
          <ellipse
            cx="70"
            cy="171"
            rx="12.5"
            ry="6.5"
            fill={CARAMEL}
            stroke={CHOCOLATE}
            strokeWidth="3"
          />
        </g>

        {/* Right Leg */}
        <g className="m-leg m-leg-r" style={pivot(96, 132)}>
          <path
            d="M96 132 V168"
            stroke={CHOCOLATE}
            strokeWidth="10"
            strokeLinecap="round"
          />
          <ellipse
            cx="102"
            cy="171"
            rx="12.5"
            ry="6.5"
            fill={CARAMEL}
            stroke={CHOCOLATE}
            strokeWidth="3"
          />
        </g>

        {/* Upper body */}
        <g className="m-body" style={pivot(80, 140)}>
          {/* Main Chocolate Slab Torso */}
          <rect
            x="44"
            y="56"
            width="72"
            height="84"
            rx="16"
            fill="url(#melti-body-grad)"
            stroke={CHOCOLATE}
            strokeWidth="4"
          />

          {/* Embossed Chocolate Bar Squares (subtle artisanal texture) */}
          <rect
            x="52"
            y="64"
            width="24"
            height="22"
            rx="5"
            fill="none"
            stroke="#FFF8F0"
            strokeOpacity="0.1"
            strokeWidth="1.5"
          />
          <rect
            x="84"
            y="64"
            width="24"
            height="22"
            rx="5"
            fill="none"
            stroke="#FFF8F0"
            strokeOpacity="0.1"
            strokeWidth="1.5"
          />

          {/* Glossy Specular Highlight */}
          <rect
            x="50"
            y="62"
            width="6.5"
            height="28"
            rx="3.25"
            fill="#FFF8F0"
            opacity="0.22"
          />

          {/* Metallic Gold Foil Liner peeking above Wrapper */}
          <path
            d="M44 118 l9 -6 l9 6 l9 -6 l9 6 l9 -6 l9 6 l9 -6 l9 6 V125 H44 Z"
            fill="url(#melti-foil-grad)"
            stroke={CHOCOLATE}
            strokeWidth="2"
            strokeLinejoin="round"
          />

          {/* Cream Parchment Wrapper */}
          <path
            d="M44 123 l9 -5 l9 5 l9 -5 l9 5 l9 -5 l9 5 l9 -5 l9 5 V124 a16 16 0 0 1 -16 16 H60 a16 16 0 0 1 -16 -16 Z"
            fill="#FFF5E6"
            stroke={CHOCOLATE}
            strokeWidth="3"
            strokeLinejoin="round"
          />

          <text
            x="80"
            y="135"
            textAnchor="middle"
            fontSize="8.5"
            fontWeight="900"
            letterSpacing="1.8"
            fill={TERRACOTTA}
          >
            MÈLTI.
          </text>

          {/* Chocolate Swirl Hair Tuft */}
          <path
            d="M68 58 C64 45 79 39 82 49 C90 41 99 51 91 58 Z"
            fill={CHOCOLATE}
          />
          <path
            d="M73 53 C73 48 79 46 80 50"
            fill="none"
            stroke={GOLD_LIGHT}
            strokeOpacity="0.4"
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          {/* Eyes: Happy Curved Arcs on Farewell, Expressive Blinking Eyes Otherwise */}
          {happyEyes ? (
            <g stroke="#FFF8F0" strokeWidth="3" strokeLinecap="round" fill="none">
              <path d="M61 83 Q67 76 73 83" />
              <path d="M87 83 Q93 76 99 83" />
            </g>
          ) : (
            <g className="m-eyes">
              <circle cx="67" cy="82" r="7.5" fill="#FFFDF9" />
              <circle cx="93" cy="82" r="7.5" fill="#FFFDF9" />

              <circle cx="69" cy="82.5" r="3.6" fill={CHOCOLATE_DEEP} />
              <circle cx="95" cy="82.5" r="3.6" fill={CHOCOLATE_DEEP} />

              <circle cx="70.2" cy="81" r="1.3" fill="#FFFDF9" />
              <circle cx="96.2" cy="81" r="1.3" fill="#FFFDF9" />
            </g>
          )}

          {/* Rosy Cocoa Blush */}
          <ellipse cx="55" cy="95" rx="5.2" ry="3" fill="#E8806A" opacity="0.6" />
          <ellipse cx="105" cy="95" rx="5.2" ry="3" fill="#E8806A" opacity="0.6" />

          {/* Mouth */}
          {mouthOpen ? (
            <>
              <path d="M69 96 Q80 116 91 96 Z" fill="#3F1F08" />
              <ellipse cx="80" cy="102.5" rx="5" ry="3" fill="#E8806A" />
            </>
          ) : (
            <path
              d="M68 97 Q80 109 92 97"
              fill="none"
              stroke="#FFF3E2"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          )}

          {/* Left Arm */}
          <g className="m-arm m-arm-l" style={pivot(42, 80)}>
            <path
              d="M42 80 V108"
              stroke={CHOCOLATE}
              strokeWidth="9"
              strokeLinecap="round"
            />
            <circle
              cx="42"
              cy="111"
              r="6.5"
              fill="#FFF3E2"
              stroke={CHOCOLATE}
              strokeWidth="3"
            />
          </g>

          {/* Right Arm (waves during idle/asking/farewell) */}
          <g className="m-arm m-arm-r" style={pivot(118, 80)}>
            <path
              d="M118 80 V108"
              stroke={CHOCOLATE}
              strokeWidth="9"
              strokeLinecap="round"
            />
            <circle
              cx="118"
              cy="111"
              r="6.5"
              fill="#FFF3E2"
              stroke={CHOCOLATE}
              strokeWidth="3"
            />
          </g>
        </g>
      </svg>
    </div>
  );
}

const useIsoLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export default function SurveyMascot({
  surveyUrl,
  onDismiss,
}: SurveyMascotProps) {
  const [phase, setPhase] = useState<Phase>('running-in');
  const [leaveDir, setLeaveDir] = useState<LeaveDir>('right');
  const [ready, setReady] = useState(false);

  const reduceMotion = useReducedMotion();
  const x = useMotionValue(0);

  const farewellTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onDismissRef = useRef(onDismiss);

  useEffect(() => {
    onDismissRef.current = onDismiss;
  }, [onDismiss]);

  useEffect(() => {
    return () => {
      if (farewellTimer.current) {
        clearTimeout(farewellTimer.current);
      }
    };
  }, []);

  useIsoLayoutEffect(() => {
    x.set(-(window.innerWidth / 2 + 120));
    setReady(true);
  }, [x]);

  // Run into the center.
  useEffect(() => {
    if (!ready || phase !== 'running-in') return;

    const controls = animate(x, 0, {
      duration: reduceMotion ? 0.01 : 1.85,
      ease: [0.3, 0.55, 0.4, 1],
      onComplete: () => setPhase('asking'),
    });

    return () => controls.stop();
  }, [ready, phase, x, reduceMotion]);

  // Exit animation.
  useEffect(() => {
    if (phase !== 'leaving') return;

    const offscreen = window.innerWidth / 2 + 220;
    const runningOff = leaveDir === 'right';

    const controls = animate(x, runningOff ? offscreen : -offscreen, {
      duration: reduceMotion ? 0.01 : runningOff ? 1.35 : 2.9,
      ease: runningOff ? 'easeIn' : 'linear',
      delay: reduceMotion || runningOff ? 0 : 0.2,
      onComplete: () => onDismissRef.current(),
    });

    return () => controls.stop();
  }, [phase, leaveDir, x, reduceMotion]);

  // Recalculate horizontal bounds & allow Escape key dismissal.
  useEffect(() => {
    const handleResize = () => {
      if (phase === 'running-in' || phase === 'asking') {
        x.set(0);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && phase === 'asking') {
        handleNo();
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, x]);

  const handleYes = () => {
    if (phase !== 'asking') return;
    window.open(surveyUrl, '_blank', 'noopener,noreferrer');
    setLeaveDir('right');
    setPhase('leaving');
  };

  const handleNo = () => {
    if (phase !== 'asking') return;
    setPhase('farewell');
    farewellTimer.current = setTimeout(() => {
      setLeaveDir('left');
      setPhase('leaving');
    }, 1500);
  };

  const gait: Gait =
    phase === 'running-in'
      ? 'run'
      : phase === 'leaving'
        ? leaveDir === 'right'
          ? 'run'
          : 'walk'
        : 'idle';

  const facing: 1 | -1 = phase === 'leaving' && leaveDir === 'left' ? -1 : 1;

  return (
    <div className="melti-overlay">
      <style>{MELTI_CSS}</style>

      {/* Smooth Backdrop Blur & Warm Vignette */}
      <motion.div
        initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
        animate={{
          opacity: phase === 'leaving' ? 0 : 1,
          backdropFilter: phase === 'leaving' ? 'blur(0px)' : 'blur(14px)',
        }}
        transition={{ duration: 0.75, ease: 'easeInOut' }}
        style={{
          position: 'fixed',
          inset: 0,
          background:
            'radial-gradient(circle at 50% 48%, rgba(43, 22, 11, 0.35) 0%, rgba(14, 7, 4, 0.72) 100%)',
          WebkitBackdropFilter: phase === 'leaving' ? 'blur(0px)' : 'blur(14px)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      {/* Melti + Thought Cloud Stage */}
      <motion.div style={{ x }} className="melti-actor-stage">
        <div className="melti-cloud-anchor">
          <AnimatePresence mode="wait">
            {phase === 'asking' && (
              <motion.div
                key="asking"
                role="dialog"
                aria-modal="true"
                aria-label="Melti quick cocoa survey"
                initial={{ opacity: 0, scale: 0.68, y: 18 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.72, y: 12 }}
                transition={{ type: 'spring', damping: 14, stiffness: 240 }}
                style={{ transformOrigin: '50% 100%' }}
                className="melti-thought-cloud"
              >
                <button
                  onClick={handleNo}
                  aria-label="Dismiss survey prompt"
                  className="melti-cloud-close"
                >
                  <X size={14} strokeWidth={2.5} />
                </button>

                {/* Floating Vector Four-Point Sparkles */}
                <motion.svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  animate={{ scale: [0.9, 1.2, 0.9], rotate: [0, 12, 0] }}
                  transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ position: 'absolute', top: '16px', left: '20px', pointerEvents: 'none' }}
                  aria-hidden="true"
                >
                  <path
                    d="M12 2 L14.4 9.6 L22 12 L14.4 14.4 L12 22 L9.6 14.4 L2 12 L9.6 9.6 Z"
                    fill={CARAMEL}
                  />
                </motion.svg>

                <div className="melti-cloud-pill">
                  <Sparkles size={12} /> 60-Sec Taste Check
                </div>

                <h3 className="melti-cloud-title">
                  Got a quick sec to shape our next batch?
                </h3>

                <p className="melti-cloud-body">
                  Tell us your dream cocoa mood—takes under a minute and unlocks{' '}
                  <strong style={{ color: TERRACOTTA }}>15% off</strong> your first tin.
                </p>

                <div className="melti-cloud-actions">
                  <button onClick={handleYes} className="melti-cloud-yes">
                    Let&apos;s Go <ArrowUpRight size={15} strokeWidth={2.5} />
                  </button>
                  <button onClick={handleNo} className="melti-cloud-no">
                    Maybe Later
                  </button>
                </div>
              </motion.div>
            )}

            {phase === 'farewell' && (
              <motion.div
                key="farewell"
                role="status"
                initial={{ opacity: 0, scale: 0.68, y: 18 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.72, y: 12 }}
                transition={{ type: 'spring', damping: 14, stiffness: 240 }}
                style={{ transformOrigin: '50% 100%' }}
                className="melti-thought-cloud"
              >
                {/* Custom Vector Cacao Heart Emblem */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
                  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
                    <circle cx="18" cy="18" r="17" fill="#F4DFC0" stroke={CARAMEL} strokeWidth="1.5" />
                    <path
                      d="M18 25.5 C18 25.5 10 20.2 10 14.8 C10 12.2 12 10.5 14.3 10.5 C15.9 10.5 17.3 11.4 18 12.6 C18.7 11.4 20.1 10.5 21.7 10.5 C24 10.5 26 12.2 26 14.8 C26 20.2 18 25.5 18 25.5 Z"
                      fill={TERRACOTTA}
                    />
                  </svg>
                </div>

                <h3 className="melti-cloud-title">No worries at all!</h3>
                <p className="melti-cloud-body">
                  Enjoy exploring the blends—I&apos;ll be around whenever you&apos;re craving a cup.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Melti
          gait={gait}
          facing={facing}
          happyEyes={phase === 'farewell' || (phase === 'leaving' && leaveDir === 'right')}
        />
      </motion.div>
    </div>
  );
}