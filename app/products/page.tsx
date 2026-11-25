// app/products/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ShoppingBag,
  ArrowRight,
  Check,
  Coffee,
  ShieldCheck,
} from 'lucide-react';
import Navbar from '@/app/components/navigation/Navbar';
import {
  MELTI_PRODUCTS,
  FLAVOR_FILTERS,
  FlavorCategory,
  ProductItem,
} from '@/app/config/productsConfig';
import { useCart } from '@/app/context/CartContext';

const CREAM = '#FFF8F0';
const COCOA = '#1A120B';
const GOLD = '#D4A373';
const GOLD_LIGHT = '#EBC593';
const TERRACOTTA = '#C86D51';

const CATALOG_CSS = `
.mcat-page {
  min-height: 100dvh;
  background: radial-gradient(circle at 50% 10%, #28150B 0%, #120B06 68%);
  color: ${CREAM};
  padding: 132px 24px 88px;
}

.mcat-wrap {
  max-width: 1060px;
  margin: 0 auto;
}

.mcat-hero {
  text-align: center;
  margin-bottom: 36px;
}

.mcat-pill {
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

.mcat-filters {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-bottom: 38px;
}

.mcat-filter-btn {
  padding: 10px 18px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: all 0.2s ease;
}

.mcat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 28px;
  margin-bottom: 52px;
}

.mcat-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 28px;
  padding: 26px;
  background: linear-gradient(160deg, #24140C 0%, #150C07 100%);
  border: 1px solid rgba(212, 163, 115, 0.24);
  box-shadow: 0 24px 56px rgba(0, 0, 0, 0.55);
  transition: transform 0.22s ease, border-color 0.22s ease;
}

.mcat-card:hover {
  transform: translateY(-4px);
  border-color: rgba(235, 197, 147, 0.52);
}

.mcat-img-box {
  position: relative;
  height: 250px;
  border-radius: 20px;
  background: radial-gradient(circle at 50% 45%, #2E190E 0%, #130A06 85%);
  border: 1px solid rgba(212, 163, 115, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  margin-bottom: 22px;
  text-decoration: none;
}

.mcat-add-btn {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 13px 20px;
  border-radius: 9999px;
  border: none;
  cursor: pointer;
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${COCOA};
  background: linear-gradient(135deg, ${GOLD_LIGHT} 0%, ${GOLD} 60%, #B9824F 100%);
  box-shadow: 0 8px 20px rgba(212, 163, 115, 0.26);
  transition: filter 0.2s ease, transform 0.12s ease;
}

.mcat-add-btn:hover {
  filter: brightness(1.07);
}

.mcat-detail-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 13px 18px;
  border-radius: 9999px;
  border: 1px solid rgba(212, 163, 115, 0.35);
  background: rgba(255, 248, 240, 0.04);
  color: ${GOLD_LIGHT};
  text-decoration: none;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  transition: background 0.2s ease, border-color 0.2s ease;
}

.mcat-detail-btn:hover {
  background: rgba(212, 163, 115, 0.14);
  border-color: ${GOLD_LIGHT};
}

.mcat-compare {
  border-radius: 24px;
  padding: 28px;
  background: rgba(255, 248, 240, 0.03);
  border: 1px solid rgba(212, 163, 115, 0.2);
  overflow-x: auto;
}

.mcat-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 520px;
  font-size: 13.5px;
}

.mcat-table th,
.mcat-table td {
  padding: 14px 16px;
  text-align: left;
  border-bottom: 1px solid rgba(212, 163, 115, 0.12);
}

.mcat-table th {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${GOLD_LIGHT};
}
`;

export default function ProductsPage() {
  const { addItem } = useCart();
  const [activeFilter, setActiveFilter] = useState<FlavorCategory>('all');
  const [addedId, setAddedId] = useState<string | null>(null);

  const visibleProducts = MELTI_PRODUCTS.filter((p) =>
    activeFilter === 'all' ? true : p.category === activeFilter
  );

  const handleQuickAdd = (product: ProductItem) => {
    addItem(product, 1);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <>
      <Navbar />
      <style>{CATALOG_CSS}</style>

      <main className="mcat-page">
        <div className="mcat-wrap">
          {/* Header */}
          <div className="mcat-hero">
            <span className="mcat-pill">
              <Sparkles size={12} /> 32% Real Couverture Cocoa • Zero Instant Dust
            </span>
            <h1
              style={{
                margin: '16px 0 10px',
                fontSize: 'clamp(30px, 4.5vw, 46px)',
                fontWeight: 900,
                letterSpacing: '-0.02em',
              }}
            >
              MÈLTI Classic Hot Chocolate
            </h1>
            <p
              style={{
                margin: '0 auto',
                maxWidth: '560px',
                fontSize: '15px',
                lineHeight: 1.6,
                color: 'rgba(235, 197, 147, 0.78)',
              }}
            >
              Crafted with 32% real South Indian estate cocoa. Grab a single-mug 20g
              sachet for ₹32 or stock up with our 200g family pack for ₹256.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="mcat-filters">
            {FLAVOR_FILTERS.map((f) => {
              const isSelected = activeFilter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setActiveFilter(f.id)}
                  className="mcat-filter-btn"
                  style={{
                    background: isSelected
                      ? 'linear-gradient(135deg, #EBC593, #D4A373)'
                      : 'rgba(255, 248, 240, 0.04)',
                    color: isSelected ? COCOA : GOLD_LIGHT,
                    border: isSelected
                      ? '1px solid transparent'
                      : '1px solid rgba(212, 163, 115, 0.26)',
                  }}
                >
                  {f.label}
                </button>
              );
            })}
          </div>

          {/* Product Cards */}
          <div className="mcat-grid">
            {visibleProducts.map((product) => {
              const perCup =
                product.category === 'family' ? '₹25.6 / mug' : '₹32 / mug';

              return (
                <article key={product.id} className="mcat-card">
                  <div>
                    <Link
                      href={`/products/${product.slug}`}
                      className="mcat-img-box"
                    >
                      <span
                        style={{
                          position: 'absolute',
                          top: '14px',
                          left: '14px',
                          padding: '5px 12px',
                          borderRadius: '9999px',
                          background: 'rgba(18, 11, 6, 0.82)',
                          border: '1px solid rgba(212, 163, 115, 0.32)',
                          fontSize: '10px',
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
                          position: 'absolute',
                          top: '14px',
                          right: '14px',
                          padding: '5px 10px',
                          borderRadius: '9999px',
                          background: 'rgba(200, 109, 81, 0.2)',
                          border: '1px solid rgba(200, 109, 81, 0.42)',
                          fontSize: '10px',
                          fontWeight: 800,
                          color: '#F6B8A6',
                        }}
                      >
                        {product.cocoaPercent} COCOA
                      </span>

                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        style={{
                          maxHeight:
                            product.category === 'family' ? '185px' : '160px',
                          width: 'auto',
                          objectFit: 'contain',
                          filter: 'drop-shadow(0 20px 30px rgba(0, 0, 0, 0.75))',
                        }}
                      />
                    </Link>

                    <div
                      style={{
                        fontSize: '11px',
                        fontWeight: 800,
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: GOLD,
                        marginBottom: '6px',
                      }}
                    >
                      {product.servings} • {perCup}
                    </div>

                    <Link
                      href={`/products/${product.slug}`}
                      style={{ textDecoration: 'none', color: CREAM }}
                    >
                      <h2
                        style={{
                          margin: '0 0 10px',
                          fontSize: '22px',
                          fontWeight: 900,
                          lineHeight: 1.25,
                        }}
                      >
                        {product.name}
                      </h2>
                    </Link>

                    <p
                      style={{
                        margin: '0 0 16px',
                        fontSize: '13.5px',
                        lineHeight: 1.6,
                        color: 'rgba(255, 248, 240, 0.74)',
                      }}
                    >
                      {product.description}
                    </p>

                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '6px',
                        marginBottom: '22px',
                      }}
                    >
                      {product.tastingNotes.map((note) => (
                        <span
                          key={note}
                          style={{
                            padding: '5px 11px',
                            borderRadius: '9999px',
                            background: 'rgba(255, 248, 240, 0.04)',
                            border: '1px solid rgba(212, 163, 115, 0.2)',
                            fontSize: '11px',
                            fontWeight: 700,
                            color: GOLD_LIGHT,
                          }}
                        >
                          {note}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'baseline',
                        justifyContent: 'space-between',
                        paddingTop: '16px',
                        borderTop: '1px solid rgba(212, 163, 115, 0.15)',
                        marginBottom: '16px',
                      }}
                    >
                      <div>
                        <span style={{ fontSize: '28px', fontWeight: 900, color: CREAM }}>
                          ₹{product.price}
                        </span>
                        <span
                          style={{
                            marginLeft: '8px',
                            fontSize: '12px',
                            color: 'rgba(235, 197, 147, 0.65)',
                          }}
                        >
                          Incl. all taxes
                        </span>
                      </div>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          fontSize: '11.5px',
                          fontWeight: 700,
                          color: GOLD_LIGHT,
                        }}
                      >
                        <ShieldCheck size={14} style={{ color: TERRACOTTA }} /> Fresh Batch
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        type="button"
                        onClick={() => handleQuickAdd(product)}
                        className="mcat-add-btn"
                      >
                        {addedId === product.id ? (
                          <>
                            <Check size={15} /> Added
                          </>
                        ) : (
                          <>
                            <ShoppingBag size={15} /> Add to Bag
                          </>
                        )}
                      </button>

                      <Link
                        href={`/products/${product.slug}`}
                        className="mcat-detail-btn"
                      >
                        Details <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Quick Comparison Strip */}
          <div className="mcat-compare">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '14px',
                fontSize: '15px',
                fontWeight: 900,
                color: CREAM,
              }}
            >
              <Coffee size={17} style={{ color: GOLD }} /> Compare Pack Sizes
            </div>
            <table className="mcat-table">
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>20g Single Sachet</th>
                  <th>200g Family Pack</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ color: 'rgba(255,248,240,0.72)' }}>Price</td>
                  <td style={{ fontWeight: 800 }}>₹32</td>
                  <td style={{ fontWeight: 800, color: GOLD_LIGHT }}>₹256 (Save ₹64)</td>
                </tr>
                <tr>
                  <td style={{ color: 'rgba(255,248,240,0.72)' }}>Cocoa Percentage</td>
                  <td>32% Real Couverture Cocoa</td>
                  <td>32% Real Couverture Cocoa</td>
                </tr>
                <tr>
                  <td style={{ color: 'rgba(255,248,240,0.72)' }}>Total Mugs (180ml)</td>
                  <td>1 Pre-Measured Pour</td>
                  <td>10 Full Mugs (₹25.6 / mug)</td>
                </tr>
                <tr>
                  <td style={{ color: 'rgba(255,248,240,0.72)' }}>Best For</td>
                  <td>First-time tasting, travel & hostel desk pours</td>
                  <td>Daily rituals, family evenings & gifting</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}