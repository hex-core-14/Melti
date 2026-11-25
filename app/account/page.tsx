// app/account/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  Package,
  Coffee,
  Sparkles,
  RotateCcw,
  ExternalLink,
  MapPin,
  Check,
  LogOut,
  ShoppingBag,
  Award,
} from 'lucide-react';
import Navbar from '@/app/components/navigation/Navbar';
import { MELTI_PRODUCTS, getProductBySlug } from '@/app/config/productsConfig';
import { useCart } from '@/app/context/CartContext';

interface OrderItemSummary {
  productId: string;
  slug?: string;
  shortName: string;
  packSize: string;
  cocoaPercent: string;
  unitPrice: number;
  quantity: number;
  imageUrl: string;
}

interface AccountOrder {
  orderId: string;
  items: OrderItemSummary[];
  totalAmount: number;
  paymentMethod: string;
  orderStatus: string;
  createdAt: string;
}

interface AccountProfile {
  name: string;
  email: string;
  tasteMood?: string;
  defaultAddress?: {
    phone: string;
    line1: string;
    city: string;
    state: string;
    pincode: string;
  };
}

const CREAM = '#FFF8F0';
const COCOA = '#1A120B';
const GOLD = '#D4A373';
const GOLD_LIGHT = '#EBC593';
const TERRACOTTA = '#C86D51';

const TASTE_MOODS = [
  'Midnight Study Fuel',
  'Cozy Rainy Evening',
  'Post-Dinner Velvet Treat',
  'Sharing with Family',
];

const ACCOUNT_CSS = `
.macc-page {
  min-height: 100dvh;
  background: radial-gradient(circle at 50% 10%, #28150B 0%, #120B06 70%);
  color: ${CREAM};
  padding: 128px 24px 88px;
}

.macc-wrap {
  max-width: 1060px;
  margin: 0 auto;
}

.macc-banner {
  border-radius: 28px;
  padding: 28px 32px;
  background: linear-gradient(155deg, #26150C 0%, #150C07 100%);
  border: 1px solid rgba(212, 163, 115, 0.28);
  box-shadow: 0 24px 56px rgba(0, 0, 0, 0.55);
  margin-bottom: 28px;
}

.macc-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  margin-top: 22px;
}

.macc-stat-card {
  padding: 16px 18px;
  border-radius: 18px;
  background: rgba(255, 248, 240, 0.03);
  border: 1px solid rgba(212, 163, 115, 0.18);
}

.macc-grid {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 28px;
  align-items: start;
}

.macc-card {
  border-radius: 26px;
  padding: 26px;
  background: linear-gradient(160deg, #23140C 0%, #150C07 100%);
  border: 1px solid rgba(212, 163, 115, 0.24);
  box-shadow: 0 24px 56px rgba(0, 0, 0, 0.55);
}

.macc-label {
  display: block;
  font-size: 10.5px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${GOLD_LIGHT};
  margin-bottom: 6px;
}

.macc-input {
  width: 100%;
  box-sizing: border-box;
  padding: 11px 13px;
  border-radius: 12px;
  background: rgba(255, 248, 240, 0.05);
  border: 1px solid rgba(212, 163, 115, 0.24);
  color: ${CREAM};
  font-size: 13.5px;
  outline: none;
}

.macc-input:focus {
  border-color: ${GOLD_LIGHT};
}

@media (max-width: 860px) {
  .macc-grid {
    grid-template-columns: 1fr;
  }
  .macc-stats {
    grid-template-columns: 1fr;
  }
  .macc-banner {
    padding: 22px 18px;
  }
}
`;

export default function AccountPage() {
  const router = useRouter();
  const { addItem } = useCart();

  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [profile, setProfile] = useState<AccountProfile | null>(null);
  const [orders, setOrders] = useState<AccountOrder[]>([]);

  // Editable preferences state
  const [nameInput, setNameInput] = useState('');
  const [tasteMood, setTasteMood] = useState(TASTE_MOODS[0]);
  const [phone, setPhone] = useState('');
  const [line1, setLine1] = useState('');
  const [city, setCity] = useState('Bengaluru');
  const [stateName, setStateName] = useState('Karnataka');
  const [pincode, setPincode] = useState('');

  const [saving, setSaving] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);
  const [reorderedId, setReorderedId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    fetch('/api/account', { cache: 'no-store' })
      .then(async (res) => {
        if (!res.ok) return { authenticated: false };
        return res.json();
      })
      .then((data) => {
        if (!active) return;
        if (!data.authenticated || !data.profile) {
          setAuthenticated(false);
          setLoading(false);
          return;
        }

        setAuthenticated(true);
        setProfile(data.profile);
        setOrders(Array.isArray(data.orders) ? data.orders : []);

        setNameInput(data.profile.name || '');
        if (data.profile.tasteMood) setTasteMood(data.profile.tasteMood);
        if (data.profile.defaultAddress) {
          setPhone(data.profile.defaultAddress.phone || '');
          setLine1(data.profile.defaultAddress.line1 || '');
          setCity(data.profile.defaultAddress.city || 'Bengaluru');
          setStateName(data.profile.defaultAddress.state || 'Karnataka');
          setPincode(data.profile.defaultAddress.pincode || '');
        }
        setLoading(false);
      })
      .catch(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedNotice(false);

    try {
      const res = await fetch('/api/account', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: nameInput,
          tasteMood,
          defaultAddress: {
            phone,
            line1,
            city,
            state: stateName,
            pincode,
          },
        }),
      });

      const data = await res.json();
      if (res.ok && data.profile) {
        setProfile(data.profile);
        setSavedNotice(true);
        setTimeout(() => setSavedNotice(false), 2500);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleReorder = (order: AccountOrder) => {
    for (const item of order.items) {
      const matchedProduct =
        getProductBySlug(item.productId) ||
        (item.slug ? getProductBySlug(item.slug) : undefined) ||
        MELTI_PRODUCTS.find((p) => p.price === item.unitPrice) ||
        MELTI_PRODUCTS[0];

      addItem(matchedProduct, item.quantity);
    }
    setReorderedId(order.orderId);
    setTimeout(() => setReorderedId(null), 1600);
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
    router.refresh();
  };

  // Compute fun 32% cocoa ritual stats
  const totalOrders = orders.length;
  const totalSpent = orders.reduce((s, o) => s + o.totalAmount, 0);
  const totalMugsPoured = orders.reduce((sum, order) => {
    const orderMugs = order.items.reduce((itemSum, item) => {
      const mugsPerPack = item.productId.includes('200g') ? 10 : 1;
      return itemSum + mugsPerPack * item.quantity;
    }, 0);
    return sum + orderMugs;
  }, 0);

  const clubTier =
    totalMugsPoured >= 20
      ? 'Velvet Connoisseur'
      : totalMugsPoured >= 5
      ? 'Midnight Regular'
      : 'Founding Pour Member';

  if (loading) {
    return (
      <>
        <Navbar />
        <style>{ACCOUNT_CSS}</style>
        <main
          className="macc-page"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: GOLD_LIGHT,
          }}
        >
          Loading your Midnight Pour Club profile...
        </main>
      </>
    );
  }

  if (!authenticated || !profile) {
    return (
      <>
        <Navbar />
        <style>{ACCOUNT_CSS}</style>
        <main className="macc-page">
          <div
            className="macc-wrap"
            style={{ maxWidth: '480px', textAlign: 'center', paddingTop: '36px' }}
          >
            <div className="macc-card">
              <Sparkles
                size={28}
                style={{ color: GOLD_LIGHT, marginBottom: '12px' }}
              />
              <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 900 }}>
                Sign In to Your Pour Profile
              </h1>
              <p
                style={{
                  margin: '10px 0 22px',
                  fontSize: '14px',
                  lineHeight: 1.6,
                  color: 'rgba(235, 197, 147, 0.78)',
                }}
              >
                Log in with your email to view your 32% cocoa order history,
                receipts, and saved delivery preferences.
              </p>
              <Link
                href="/login"
                style={{
                  display: 'inline-block',
                  padding: '13px 28px',
                  borderRadius: '9999px',
                  background: 'linear-gradient(135deg, #EBC593, #D4A373)',
                  color: COCOA,
                  fontWeight: 900,
                  fontSize: '12px',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                }}
              >
                Login / Join Club
              </Link>
            </div>
          </div>
        </main>
      </>
    );
  }

  const initials = (profile.name || 'M')
    .trim()
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <>
      <Navbar />
      <style>{ACCOUNT_CSS}</style>

      <main className="macc-page">
        <div className="macc-wrap">
          {/* Member Header Banner */}
          <section className="macc-banner">
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '20px',
                    background:
                      'linear-gradient(135deg, rgba(235, 197, 147, 0.25), rgba(200, 109, 81, 0.22))',
                    border: '1.5px solid rgba(235, 197, 147, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    fontWeight: 900,
                    color: GOLD_LIGHT,
                  }}
                >
                  {initials}
                </div>

                <div>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '4px 11px',
                      borderRadius: '9999px',
                      background: 'rgba(212, 163, 115, 0.14)',
                      border: '1px solid rgba(212, 163, 115, 0.3)',
                      color: GOLD_LIGHT,
                      fontSize: '10px',
                      fontWeight: 800,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      marginBottom: '6px',
                    }}
                  >
                    <Award size={11} style={{ color: TERRACOTTA }} /> {clubTier}
                  </div>

                  <h1
                    style={{
                      margin: 0,
                      fontSize: 'clamp(22px, 3vw, 30px)',
                      fontWeight: 900,
                    }}
                  >
                    {profile.name}
                  </h1>
                  <div
                    style={{
                      fontSize: '13px',
                      color: 'rgba(235, 197, 147, 0.72)',
                      marginTop: '2px',
                    }}
                  >
                    {profile.email}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <Link
                  href="/products"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '7px',
                    padding: '11px 20px',
                    borderRadius: '9999px',
                    background: 'linear-gradient(135deg, #EBC593, #D4A373)',
                    color: COCOA,
                    fontSize: '11.5px',
                    fontWeight: 900,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                  }}
                >
                  <ShoppingBag size={14} /> Order Packs
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '11px 16px',
                    borderRadius: '9999px',
                    border: '1px solid rgba(200, 109, 81, 0.45)',
                    background: 'rgba(200, 109, 81, 0.12)',
                    color: '#F6B8A6',
                    fontSize: '11.5px',
                    fontWeight: 800,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                  }}
                >
                  <LogOut size={14} /> Logout
                </button>
              </div>
            </div>

            {/* 3 Ritual Stats */}
            <div className="macc-stats">
              <div className="macc-stat-card">
                <div style={{ fontSize: '11px', color: GOLD, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Orders Placed
                </div>
                <div style={{ fontSize: '26px', fontWeight: 900, marginTop: '4px' }}>
                  {totalOrders}
                </div>
              </div>

              <div className="macc-stat-card">
                <div style={{ fontSize: '11px', color: GOLD, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  32% Cocoa Mugs Poured
                </div>
                <div style={{ fontSize: '26px', fontWeight: 900, color: GOLD_LIGHT, marginTop: '4px' }}>
                  {totalMugsPoured} {totalMugsPoured === 1 ? 'Mug' : 'Mugs'}
                </div>
              </div>

              <div className="macc-stat-card">
                <div style={{ fontSize: '11px', color: GOLD, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Total Cocoa Stash
                </div>
                <div style={{ fontSize: '26px', fontWeight: 900, marginTop: '4px' }}>
                  ₹{totalSpent}
                </div>
              </div>
            </div>
          </section>

          {/* Main 2-Column Content */}
          <div className="macc-grid">
            {/* Left Column: Past Orders */}
            <section className="macc-card">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '18px',
                }}
              >
                <h2
                  style={{
                    margin: 0,
                    fontSize: '20px',
                    fontWeight: 900,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <Package size={19} style={{ color: GOLD }} /> Your Pour History
                </h2>
                <span style={{ fontSize: '12px', color: GOLD_LIGHT, fontWeight: 700 }}>
                  {totalOrders} {totalOrders === 1 ? 'Order' : 'Orders'}
                </span>
              </div>

              {orders.length === 0 ? (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '38px 16px',
                    borderRadius: '18px',
                    background: 'rgba(255, 248, 240, 0.02)',
                    border: '1px dashed rgba(212, 163, 115, 0.25)',
                  }}
                >
                  <Coffee
                    size={26}
                    style={{ color: GOLD_LIGHT, marginBottom: '10px' }}
                  />
                  <div style={{ fontSize: '16px', fontWeight: 800 }}>
                    No pours recorded yet
                  </div>
                  <p
                    style={{
                      fontSize: '13px',
                      color: 'rgba(235, 197, 147, 0.72)',
                      margin: '6px 0 18px',
                    }}
                  >
                    Place a demo order for a 20g Sachet (₹32) or 200g Family Pack
                    (₹256) to see it tracked here.
                  </p>
                  <Link
                    href="/products"
                    style={{
                      display: 'inline-block',
                      padding: '11px 22px',
                      borderRadius: '9999px',
                      background: GOLD_LIGHT,
                      color: COCOA,
                      fontWeight: 900,
                      fontSize: '11.5px',
                      textTransform: 'uppercase',
                      textDecoration: 'none',
                    }}
                  >
                    Explore Classic Packs
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {orders.map((order) => {
                    const formattedDate = new Date(
                      order.createdAt
                    ).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    });

                    return (
                      <div
                        key={order.orderId}
                        style={{
                          padding: '16px 18px',
                          borderRadius: '18px',
                          background: 'rgba(255, 248, 240, 0.03)',
                          border: '1px solid rgba(212, 163, 115, 0.2)',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '8px',
                            paddingBottom: '10px',
                            borderBottom: '1px solid rgba(212, 163, 115, 0.12)',
                          }}
                        >
                          <div>
                            <span
                              style={{
                                fontSize: '14px',
                                fontWeight: 900,
                                color: GOLD_LIGHT,
                              }}
                            >
                              {order.orderId}
                            </span>
                            <span
                              style={{
                                marginLeft: '10px',
                                fontSize: '11.5px',
                                color: 'rgba(255, 248, 240, 0.62)',
                              }}
                            >
                              {formattedDate}
                            </span>
                          </div>

                          <span
                            style={{
                              padding: '4px 10px',
                              borderRadius: '9999px',
                              background: 'rgba(200, 109, 81, 0.18)',
                              border: '1px solid rgba(200, 109, 81, 0.4)',
                              color: '#F6B8A6',
                              fontSize: '10px',
                              fontWeight: 800,
                              letterSpacing: '0.08em',
                              textTransform: 'uppercase',
                            }}
                          >
                            {order.orderStatus}
                          </span>
                        </div>

                        <div style={{ margin: '10px 0' }}>
                          {order.items.map((item, idx) => (
                            <div
                              key={`${order.orderId}-${idx}`}
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                fontSize: '13px',
                                padding: '3px 0',
                                color: 'rgba(255, 248, 240, 0.86)',
                              }}
                            >
                              <span>
                                {item.shortName} ({item.cocoaPercent}) ×{' '}
                                {item.quantity}
                              </span>
                              <span style={{ fontWeight: 800 }}>
                                ₹{item.unitPrice * item.quantity}
                              </span>
                            </div>
                          ))}
                        </div>

                        <div
                          style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '10px',
                            paddingTop: '10px',
                            borderTop: '1px solid rgba(212, 163, 115, 0.12)',
                          }}
                        >
                          <div style={{ fontSize: '14px', fontWeight: 900 }}>
                            Total:{' '}
                            <span style={{ color: GOLD_LIGHT }}>
                              ₹{order.totalAmount}
                            </span>
                          </div>

                          <div style={{ display: 'flex', gap: '8px' }}>
                            <Link
                              href={`/orders/${order.orderId}`}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px',
                                padding: '8px 13px',
                                borderRadius: '9999px',
                                border: '1px solid rgba(212, 163, 115, 0.34)',
                                background: 'rgba(255, 248, 240, 0.04)',
                                color: CREAM,
                                fontSize: '11px',
                                fontWeight: 800,
                                textDecoration: 'none',
                              }}
                            >
                              Receipt <ExternalLink size={12} />
                            </Link>

                            <button
                              type="button"
                              onClick={() => handleReorder(order)}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px',
                                padding: '8px 14px',
                                borderRadius: '9999px',
                                border: 'none',
                                background: GOLD_LIGHT,
                                color: COCOA,
                                fontSize: '11px',
                                fontWeight: 900,
                                cursor: 'pointer',
                              }}
                            >
                              {reorderedId === order.orderId ? (
                                <>
                                  <Check size={12} /> Added to Bag
                                </>
                              ) : (
                                <>
                                  <RotateCcw size={12} /> Reorder
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Right Column: Cocoa Mood & Saved Address */}
            <section className="macc-card">
              <h2
                style={{
                  margin: '0 0 16px',
                  fontSize: '20px',
                  fontWeight: 900,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <User size={19} style={{ color: GOLD }} /> Ritual Preferences
              </h2>

              <form onSubmit={handleSavePreferences}>
                <div style={{ marginBottom: '14px' }}>
                  <label className="macc-label">Display Name</label>
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="macc-input"
                  />
                </div>

                {/* Preferred Pour Mood */}
                <div style={{ marginBottom: '18px' }}>
                  <label className="macc-label">Favorite 32% Cocoa Mood</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
                    {TASTE_MOODS.map((mood) => {
                      const active = tasteMood === mood;
                      return (
                        <button
                          key={mood}
                          type="button"
                          onClick={() => setTasteMood(mood)}
                          style={{
                            padding: '7px 12px',
                            borderRadius: '9999px',
                            fontSize: '11.5px',
                            fontWeight: 800,
                            cursor: 'pointer',
                            background: active
                              ? 'rgba(212, 163, 115, 0.24)'
                              : 'rgba(255, 248, 240, 0.04)',
                            border: active
                              ? '1.5px solid #EBC593'
                              : '1px solid rgba(212, 163, 115, 0.22)',
                            color: active ? CREAM : 'rgba(235, 197, 147, 0.72)',
                          }}
                        >
                          {mood}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div
                  style={{
                    paddingTop: '14px',
                    borderTop: '1px solid rgba(212, 163, 115, 0.16)',
                    marginBottom: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '12px',
                    fontWeight: 800,
                    color: GOLD_LIGHT,
                  }}
                >
                  <MapPin size={14} style={{ color: TERRACOTTA }} /> Saved
                  Delivery Address
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label className="macc-label">Mobile Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="9876543210"
                      className="macc-input"
                    />
                  </div>

                  <div>
                    <label className="macc-label">Street / Flat / Area</label>
                    <input
                      type="text"
                      value={line1}
                      onChange={(e) => setLine1(e.target.value)}
                      placeholder="House no., street, landmark"
                      className="macc-input"
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label className="macc-label">City</label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="macc-input"
                      />
                    </div>
                    <div>
                      <label className="macc-label">PIN Code</label>
                      <input
                        type="text"
                        maxLength={6}
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        placeholder="560038"
                        className="macc-input"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    width: '100%',
                    marginTop: '18px',
                    padding: '13px 20px',
                    borderRadius: '9999px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: 900,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: COCOA,
                    background:
                      'linear-gradient(135deg, #EBC593 0%, #D4A373 60%, #B9824F 100%)',
                  }}
                >
                  {saving
                    ? 'Saving...'
                    : savedNotice
                    ? '✓ Preferences Saved'
                    : 'Save Profile & Address'}
                </button>
              </form>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}