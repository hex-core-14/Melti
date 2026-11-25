// app/products/[slug]/page.tsx
'use client';

import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ShoppingBag,
  Zap,
  Plus,
  Minus,
  Check,
  Sparkles,
  Coffee,
  Leaf,
  Award,
} from 'lucide-react';
import Navbar from '@/app/components/navigation/Navbar';
import { MELTI_PRODUCTS, getProductBySlug } from '@/app/config/productsConfig';
import { useCart } from '@/app/context/CartContext';

const CREAM = '#FFF8F0';
const COCOA = '#1A120B';
const GOLD = '#D4A373';
const GOLD_LIGHT = '#EBC593';
const TERRACOTTA = '#C86D51';

const PDP_CSS = `
.mpdp-page {
  min-height: 100dvh;
  background: radial-gradient(circle at 50% 12%, #28150B 0%, #120B06 70%);
  color: ${CREAM};
  padding: 128px 24px 88px;
}

.mpdp-wrap {
  max-width: 1060px;
  margin: 0 auto;
}

.mpdp-grid {
  display: grid;
  grid-template-columns: 0.95fr 1.05fr;
  gap: 38px;
  align-items: start;
}

.mpdp-visual {
  position: relative;
  border-radius: 30px;
  padding: 36px 28px;
  min-height: 440px;
  background: radial-gradient(circle at 50% 45%, #301B10 0%, #150C07 85%);
  border: 1px solid rgba(212, 163, 115, 0.25);
  box-shadow: 0 28px 64px rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}

.mpdp-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 34px;
  border-bottom: 1px solid rgba(212, 163, 115, 0.18);
  padding-bottom: 12px;
}

.mpdp-tab-btn {
  padding: 9px 16px;
  border-radius: 10px;
  border: none;
  font-size: 11.5px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
}

.mpdp-panel {
  margin-top: 16px;
  padding: 20px;
  border-radius: 18px;
  background: rgba(255, 248, 240, 0.03);
  border: 1px solid rgba(212, 163, 115, 0.18);
  font-size: 13.5px;
  line-height: 1.65;
  color: rgba(255, 248, 240, 0.84);
}

@media (max-width: 860px) {
  .mpdp-grid {
    grid-template-columns: 1fr;
    gap: 26px;
  }
  .mpdp-visual {
    min-height: 340px;
  }
}
`;

function ProductDetailContent() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();

  const slug =
    typeof params?.slug === 'string'
      ? params.slug
      : Array.isArray(params?.slug)
      ? params.slug[0]
      : '';

  const product = getProductBySlug(slug);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'ritual' | 'ingredients' | 'nutrition'>('ritual');
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <main
        style={{
          minHeight: '100dvh',
          background: '#120B06',
          color: CREAM,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          textAlign: 'center',
        }}
      >
        <h1 style={{ fontSize: '26px', fontWeight: 900 }}>Pack Not Found</h1>
        <p style={{ color: GOLD_LIGHT, marginTop: '8px' }}>
          Explore our 32% cocoa 20g sachet and 200g family pack in the store.
        </p>
        <Link
          href="/products"
          style={{
            marginTop: '18px',
            padding: '12px 24px',
            borderRadius: '9999px',
            background: GOLD_LIGHT,
            color: COCOA,
            fontWeight: 900,
            textDecoration: 'none',
            fontSize: '12px',
            textTransform: 'uppercase',
          }}
        >
          View All Packs
        </Link>
      </main>
    );
  }

  const handleAdd = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleBuyNow = () => {
    addItem(product, quantity);
    router.push('/checkout');
  };

  return (
    <main className="mpdp-page">
      <div className="mpdp-wrap">
        {/* Breadcrumb */}
        <div style={{ marginBottom: '24px' }}>
          <Link
            href="/products"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
              color: GOLD_LIGHT,
              textDecoration: 'none',
              fontSize: '12px',
              fontWeight: 800,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            <ArrowLeft size={15} /> Back to All Packs
          </Link>
        </div>

        <div className="mpdp-grid">
          {/* Left Product Stage */}
          <div className="mpdp-visual">
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span
                style={{
                  padding: '6px 13px',
                  borderRadius: '9999px',
                  background: 'rgba(18, 11, 6, 0.82)',
                  border: '1px solid rgba(212, 163, 115, 0.34)',
                  fontSize: '10.5px',
                  fontWeight: 800,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: GOLD_LIGHT,
                }}
              >
                {product.badge}
              </span>

              <span
                style={{
                  padding: '6px 12px',
                  borderRadius: '9999px',
                  background: 'rgba(200, 109, 81, 0.2)',
                  border: '1px solid rgba(200, 109, 81, 0.45)',
                  fontSize: '11px',
                  fontWeight: 800,
                  color: '#F6B8A6',
                }}
              >
                {product.cocoaPercent} REAL COCOA
              </span>
            </div>

            <img
              src={product.imageUrl}
              alt={product.name}
              style={{
                maxWidth: product.category === 'family' ? '260px' : '215px',
                width: '100%',
                height: 'auto',
                objectFit: 'contain',
                margin: '20px 0',
                filter: 'drop-shadow(0 28px 40px rgba(0, 0, 0, 0.8))',
              }}
            />

            <div
              style={{
                display: 'flex',
                gap: '18px',
                fontSize: '11.5px',
                color: GOLD_LIGHT,
                fontWeight: 700,
              }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                <Leaf size={13} style={{ color: TERRACOTTA }} /> 100% Vegetarian
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                <Award size={13} style={{ color: GOLD }} /> Zero Compound Powder
              </span>
            </div>
          </div>

          {/* Right Details & Purchase Controls */}
          <div>
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
              {product.tagline}
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: 'clamp(26px, 3.6vw, 38px)',
                fontWeight: 900,
                lineHeight: 1.18,
              }}
            >
              {product.name}
            </h1>

            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '12px',
                marginTop: '14px',
              }}
            >
              <span style={{ fontSize: '34px', fontWeight: 900, color: GOLD_LIGHT }}>
                ₹{product.price * quantity}
              </span>
              <span style={{ fontSize: '13px', color: 'rgba(255, 248, 240, 0.65)' }}>
                ({product.servings} • ₹{product.price} / pack)
              </span>
            </div>

            <p
              style={{
                margin: '16px 0 20px',
                fontSize: '14.5px',
                lineHeight: 1.65,
                color: 'rgba(255, 248, 240, 0.8)',
              }}
            >
              {product.description}
            </p>

            {/* Tasting Notes */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
              {product.tastingNotes.map((note) => (
                <span
                  key={note}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '6px 12px',
                    borderRadius: '10px',
                    background: 'rgba(255, 248, 240, 0.04)',
                    border: '1px solid rgba(212, 163, 115, 0.22)',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: GOLD_LIGHT,
                  }}
                >
                  <Sparkles size={11} style={{ color: TERRACOTTA }} /> {note}
                </span>
              ))}
            </div>

            {/* Switch Pack Size Links */}
            <div style={{ marginBottom: '24px' }}>
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: GOLD,
                  marginBottom: '8px',
                }}
              >
                Select Pack Size
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {MELTI_PRODUCTS.map((p) => {
                  const current = p.id === product.id;
                  return (
                    <Link
                      key={p.id}
                      href={`/products/${p.slug}`}
                      style={{
                        padding: '11px 16px',
                        borderRadius: '14px',
                        textDecoration: 'none',
                        background: current
                          ? 'rgba(212, 163, 115, 0.22)'
                          : 'rgba(255, 248, 240, 0.04)',
                        border: current
                          ? '1.5px solid #EBC593'
                          : '1px solid rgba(212, 163, 115, 0.22)',
                        color: current ? CREAM : 'rgba(255, 248, 240, 0.72)',
                        fontSize: '12.5px',
                        fontWeight: 800,
                      }}
                    >
                      {p.packSize} — ₹{p.price}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Quantity + Add to Bag + Buy Now */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: '9999px',
                  background: 'rgba(255, 248, 240, 0.05)',
                  border: '1px solid rgba(212, 163, 115, 0.28)',
                }}
              >
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '9999px',
                    border: 'none',
                    background: 'rgba(212, 163, 115, 0.18)',
                    color: CREAM,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Minus size={13} />
                </button>
                <span style={{ fontSize: '14px', fontWeight: 900, minWidth: '18px', textAlign: 'center' }}>
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Increase quantity"
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '9999px',
                    border: 'none',
                    background: 'rgba(212, 163, 115, 0.18)',
                    color: CREAM,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Plus size={13} />
                </button>
              </div>

              <button
                type="button"
                onClick={handleAdd}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '14px 26px',
                  borderRadius: '9999px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 900,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: COCOA,
                  background: 'linear-gradient(135deg, #EBC593 0%, #D4A373 60%, #B9824F 100%)',
                }}
              >
                {added ? (
                  <>
                    <Check size={15} /> Added to Bag
                  </>
                ) : (
                  <>
                    <ShoppingBag size={15} /> Add to Pour Bag
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '7px',
                  padding: '14px 22px',
                  borderRadius: '9999px',
                  border: '1px solid rgba(212, 163, 115, 0.45)',
                  background: 'rgba(212, 163, 115, 0.12)',
                  color: GOLD_LIGHT,
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 900,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                <Zap size={14} /> Instant Demo Checkout
              </button>
            </div>

            {/* Tabbed Details: Ritual / Ingredients / Nutrition */}
            <div className="mpdp-tabs">
              {(
                [
                  { id: 'ritual', label: 'Whisk Ritual' },
                  { id: 'ingredients', label: '32% Cocoa Ingredients' },
                  { id: 'nutrition', label: 'Nutrition & Storage' },
                ] as const
              ).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveTab(t.id)}
                  className="mpdp-tab-btn"
                  style={{
                    background:
                      activeTab === t.id
                        ? 'rgba(212, 163, 115, 0.22)'
                        : 'transparent',
                    color:
                      activeTab === t.id
                        ? GOLD_LIGHT
                        : 'rgba(255, 248, 240, 0.65)',
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {activeTab === 'ritual' && (
              <div className="mpdp-panel">
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '7px',
                    fontWeight: 800,
                    color: GOLD_LIGHT,
                    marginBottom: '8px',
                  }}
                >
                  <Coffee size={15} /> How to Pour ({product.servings})
                </div>
                <p style={{ margin: 0 }}>{product.ritualTip}</p>
              </div>
            )}

            {activeTab === 'ingredients' && (
              <div className="mpdp-panel">
                <p style={{ margin: '0 0 8px' }}>
                  <strong style={{ color: GOLD_LIGHT }}>Ingredients:</strong>{' '}
                  Real Couverture Chocolate Shavings (32% Cocoa Solids, Pure Cocoa
                  Butter), Unrefined Cane Sugar, Natural Bourbon Vanilla Bean
                  Extract, Pinch of Sea Salt.
                </p>
                <p style={{ margin: 0, fontSize: '12px', color: GOLD_LIGHT }}>
                  Allergen Info: Processed in a facility that handles milk and tree
                  nuts. Contains zero hydrogenated vegetable fats or artificial
                  thickeners.
                </p>
              </div>
            )}

            {activeTab === 'nutrition' && (
              <div className="mpdp-panel">
                <div style={{ fontWeight: 800, color: GOLD_LIGHT, marginBottom: '6px' }}>
                  Per 20g Single-Mug Serving (Mix Only)
                </div>
                <div>Energy: 96 kcal • Protein: 1.8g • Total Fat: 4.6g • Carbohydrates: 12.1g</div>
                <div style={{ marginTop: '8px', fontSize: '12px', color: 'rgba(255,248,240,0.68)' }}>
                  Net Weight: {product.weightGrams}g • Shelf Life: 9 Months from
                  packaging. Store in a cool, dry place below 25°C.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default function ProductDetailPage() {
  return (
    <>
      <Navbar />
      <style>{PDP_CSS}</style>
      <Suspense
        fallback={
          <main
            className="mpdp-page"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: GOLD_LIGHT,
              fontSize: '14px',
              fontWeight: 700,
            }}
          >
            Preparing pack details...
          </main>
        }
      >
        <ProductDetailContent />
      </Suspense>
    </>
  );
}