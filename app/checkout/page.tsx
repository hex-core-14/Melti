// app/checkout/page.tsx
'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Smartphone,
  CreditCard,
  Truck,
  Tag,
  CheckCircle2,
  Wand2,
} from 'lucide-react';
import Navbar from '@/app/components/navigation/Navbar';
import { useCart } from '@/app/context/CartContext';

const CREAM = '#FFF8F0';
const COCOA = '#1A120B';
const GOLD = '#D4A373';
const GOLD_LIGHT = '#EBC593';
const TERRACOTTA = '#C86D51';

const CHECKOUT_CSS = `
.mchk-page {
  min-height: 100dvh;
  background: radial-gradient(circle at 50% 10%, #28150B 0%, #120B06 70%);
  color: ${CREAM};
  padding: 128px 24px 88px;
}

.mchk-wrap {
  max-width: 1060px;
  margin: 0 auto;
}

.mchk-grid {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 30px;
  align-items: start;
}

.mchk-card {
  border-radius: 26px;
  padding: 28px;
  background: linear-gradient(160deg, #23140C 0%, #150C07 100%);
  border: 1px solid rgba(212, 163, 115, 0.24);
  box-shadow: 0 24px 56px rgba(0, 0, 0, 0.55);
}

.mchk-label {
  display: block;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${GOLD_LIGHT};
  margin-bottom: 6px;
}

.mchk-input {
  width: 100%;
  box-sizing: border-box;
  padding: 12px 14px;
  border-radius: 12px;
  background: rgba(255, 248, 240, 0.05);
  border: 1px solid rgba(212, 163, 115, 0.25);
  color: ${CREAM};
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s ease;
}

.mchk-input:focus {
  border-color: ${GOLD_LIGHT};
}

.mchk-pay-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 13px 15px;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.mchk-submit-btn {
  width: 100%;
  margin-top: 18px;
  padding: 15px 24px;
  border-radius: 9999px;
  border: none;
  cursor: pointer;
  font-size: 13px;
  font-weight: 900;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${COCOA};
  background: linear-gradient(135deg, ${GOLD_LIGHT} 0%, ${GOLD} 60%, #B9824F 100%);
  box-shadow: 0 10px 26px rgba(212, 163, 115, 0.3);
  transition: filter 0.2s ease, transform 0.12s ease;
}

.mchk-submit-btn:hover:not(:disabled) {
  filter: brightness(1.07);
}

.mchk-submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 860px) {
  .mchk-grid {
    grid-template-columns: 1fr;
  }
}
`;

function CheckoutContent() {
  const router = useRouter();
  const {
    items,
    subtotal,
    discount,
    shippingFee,
    totalAmount,
    couponCode,
    couponError,
    applyCoupon,
    removeCoupon,
    clearCart,
  } = useCart();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [line1, setLine1] = useState('');
  const [city, setCity] = useState('Bengaluru');
  const [stateName, setStateName] = useState('Karnataka');
  const [pincode, setPincode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<
    'demo_upi' | 'demo_card' | 'demo_cod'
  >('demo_upi');

  const [promoInput, setPromoInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Pre-fill user details if logged in
  useEffect(() => {
    let active = true;
    fetch('/api/auth/me', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : { user: null }))
      .then((data) => {
        if (!active || !data?.user) return;
        setIsLoggedIn(true);
        if (data.user.name) setFullName(data.user.name);
        if (data.user.email) setEmail(data.user.email);
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  const handleAutofillDemo = () => {
    if (!fullName) setFullName('Aniket Gupta');
    if (!email) setEmail('aniket.demo@melti.in');
    setPhone('9876543210');
    setLine1('42, 12th Main Road, HAL 2nd Stage, Indiranagar');
    setCity('Bengaluru');
    setStateName('Karnataka');
    setPincode('560038');
  };

  const handlePromoApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (applyCoupon(promoInput)) {
      setPromoInput('');
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          couponCode,
          paymentMethod,
          shippingAddress: {
            fullName,
            email,
            phone,
            line1,
            city,
            state: stateName,
            pincode,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Could not complete demo order.');
        setSubmitting(false);
        return;
      }

      clearCart();
      router.push(`/orders/${data.order.orderId}`);
    } catch {
      setErrorMsg('Network error placing order. Please try again.');
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <main className="mchk-page">
        <div
          className="mchk-wrap"
          style={{ maxWidth: '520px', textAlign: 'center', paddingTop: '40px' }}
        >
          <div className="mchk-card">
            <Sparkles size={28} style={{ color: GOLD_LIGHT, marginBottom: '12px' }} />
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 900 }}>
              Your Pour Bag is Empty
            </h1>
            <p style={{ color: 'rgba(235, 197, 147, 0.78)', fontSize: '14px', marginTop: '8px' }}>
              Add a 20g Single Sachet (₹32) or a 200g Family Pack (₹256) to test the
              demo checkout.
            </p>
            <Link
              href="/products"
              className="mchk-submit-btn"
              style={{ display: 'inline-block', textDecoration: 'none', width: 'auto', padding: '13px 28px' }}
            >
              Browse Classic Packs
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mchk-page">
      <div className="mchk-wrap">
        {/* Top Bar */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            marginBottom: '26px',
          }}
        >
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
            <ArrowLeft size={15} /> Continue Shopping
          </Link>

          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 13px',
              borderRadius: '9999px',
              background: 'rgba(200, 109, 81, 0.18)',
              border: '1px solid rgba(200, 109, 81, 0.42)',
              color: '#F6B8A6',
              fontSize: '11px',
              fontWeight: 800,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            <ShieldCheck size={14} /> Interactive Demo Checkout • ₹0 Real Charge
          </span>
        </div>

        <form onSubmit={handlePlaceOrder} className="mchk-grid">
          {/* Left: Shipping & Simulated Payment */}
          <div className="mchk-card">
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '10px',
                marginBottom: '20px',
              }}
            >
              <div>
                <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 900 }}>
                  Delivery Details
                </h1>
                <p style={{ margin: '4px 0 0', fontSize: '12.5px', color: 'rgba(235, 197, 147, 0.72)' }}>
                  {isLoggedIn
                    ? 'Order will be saved to your Midnight Pour Club profile.'
                    : 'Tip: Log in first to view this order inside your Profile page.'}
                </p>
              </div>

              <button
                type="button"
                onClick={handleAutofillDemo}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: '9999px',
                  border: '1px solid rgba(212, 163, 115, 0.4)',
                  background: 'rgba(212, 163, 115, 0.14)',
                  color: GOLD_LIGHT,
                  fontSize: '11px',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                <Wand2 size={13} /> Fill Demo Address
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label className="mchk-label">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Aarav Sharma"
                  className="mchk-input"
                />
              </div>

              <div>
                <label className="mchk-label">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="mchk-input"
                />
              </div>

              <div>
                <label className="mchk-label">Mobile Number</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9876543210"
                  className="mchk-input"
                />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label className="mchk-label">Street / Flat / Landmark</label>
                <input
                  type="text"
                  required
                  value={line1}
                  onChange={(e) => setLine1(e.target.value)}
                  placeholder="House no., street name, area"
                  className="mchk-input"
                />
              </div>

              <div>
                <label className="mchk-label">City</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="mchk-input"
                />
              </div>

              <div>
                <label className="mchk-label">PIN Code</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="560038"
                  className="mchk-input"
                />
              </div>
            </div>

            {/* Simulated Payment Selector */}
            <div style={{ marginTop: '28px' }}>
              <h2 style={{ margin: '0 0 12px', fontSize: '18px', fontWeight: 900 }}>
                Payment Mode (Simulated)
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  {
                    id: 'demo_upi',
                    title: 'Instant Demo UPI (GPay / PhonePe)',
                    sub: 'Simulates instant UPI confirmation',
                    icon: <Smartphone size={17} style={{ color: GOLD_LIGHT }} />,
                  },
                  {
                    id: 'demo_card',
                    title: 'Demo Credit / Debit Card',
                    sub: 'Simulates 1-click card authorization',
                    icon: <CreditCard size={17} style={{ color: GOLD_LIGHT }} />,
                  },
                  {
                    id: 'demo_cod',
                    title: 'Cash on Delivery (Demo)',
                    sub: 'Pay at your doorstep when your cocoa arrives',
                    icon: <Truck size={17} style={{ color: GOLD_LIGHT }} />,
                  },
                ].map((opt) => {
                  const selected = paymentMethod === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() =>
                        setPaymentMethod(
                          opt.id as 'demo_upi' | 'demo_card' | 'demo_cod'
                        )
                      }
                      className="mchk-pay-option"
                      style={{
                        background: selected
                          ? 'rgba(212, 163, 115, 0.16)'
                          : 'rgba(255, 248, 240, 0.03)',
                        border: selected
                          ? '1.5px solid #EBC593'
                          : '1px solid rgba(212, 163, 115, 0.2)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {opt.icon}
                        <div>
                          <div style={{ fontSize: '13.5px', fontWeight: 800, color: CREAM }}>
                            {opt.title}
                          </div>
                          <div style={{ fontSize: '11.5px', color: 'rgba(235, 197, 147, 0.68)' }}>
                            {opt.sub}
                          </div>
                        </div>
                      </div>
                      {selected && (
                        <CheckCircle2 size={18} style={{ color: GOLD_LIGHT }} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="mchk-card">
            <h2 style={{ margin: '0 0 18px', fontSize: '20px', fontWeight: 900 }}>
              Order Summary
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '18px' }}>
              {items.map((item) => (
                <div
                  key={item.productId}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    paddingBottom: '12px',
                    borderBottom: '1px solid rgba(212, 163, 115, 0.14)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      style={{
                        width: '44px',
                        height: '52px',
                        objectFit: 'contain',
                      }}
                    />
                    <div>
                      <div style={{ fontSize: '13.5px', fontWeight: 800 }}>
                        {item.shortName}
                      </div>
                      <div style={{ fontSize: '11.5px', color: 'rgba(235, 197, 147, 0.72)' }}>
                        {item.cocoaPercent} Cocoa • Qty {item.quantity} × ₹{item.unitPrice}
                      </div>
                    </div>
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 900, color: GOLD_LIGHT }}>
                    ₹{item.unitPrice * item.quantity}
                  </div>
                </div>
              ))}
            </div>

            {/* Promo Code Box */}
            {couponCode ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '9px 12px',
                  borderRadius: '10px',
                  background: 'rgba(200, 109, 81, 0.16)',
                  border: '1px dashed #C86D51',
                  marginBottom: '14px',
                  fontSize: '12px',
                  color: GOLD_LIGHT,
                }}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 800 }}>
                  <Tag size={13} /> {couponCode} (-₹{discount})
                </span>
                <button
                  type="button"
                  onClick={removeCoupon}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: CREAM,
                    cursor: 'pointer',
                    fontSize: '11px',
                    textDecoration: 'underline',
                  }}
                >
                  Remove
                </button>
              </div>
            ) : (
              <div style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="FIRSTPOUR15 or MELTI150"
                    className="mchk-input"
                    style={{ padding: '10px 12px', fontSize: '12.5px' }}
                  />
                  <button
                    type="button"
                    onClick={handlePromoApply}
                    style={{
                      padding: '0 16px',
                      borderRadius: '12px',
                      border: '1px solid rgba(212, 163, 115, 0.4)',
                      background: 'rgba(212, 163, 115, 0.16)',
                      color: GOLD_LIGHT,
                      fontSize: '11px',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                    }}
                  >
                    Apply
                  </button>
                </div>
                {couponError && (
                  <div style={{ fontSize: '11px', color: '#F6B8A6', marginTop: '6px' }}>
                    {couponError}
                  </div>
                )}
              </div>
            )}

            {/* Totals */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13.5px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(255, 248, 240, 0.75)' }}>
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              {discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#E89A6C' }}>
                  <span>Promo Discount</span>
                  <span>-₹{discount}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(255, 248, 240, 0.75)' }}>
                <span>Cold-Pack Insulated Shipping</span>
                <span>{shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '18px',
                  fontWeight: 900,
                  paddingTop: '10px',
                  marginTop: '4px',
                  borderTop: '1px solid rgba(212, 163, 115, 0.2)',
                }}
              >
                <span>Total Payable</span>
                <span style={{ color: GOLD_LIGHT }}>₹{totalAmount}</span>
              </div>
            </div>

            {errorMsg && (
              <div
                style={{
                  marginTop: '12px',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  background: 'rgba(200, 109, 81, 0.2)',
                  border: '1px solid #C86D51',
                  fontSize: '12px',
                  color: '#F6B8A6',
                }}
              >
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="mchk-submit-btn"
            >
              {submitting
                ? 'Confirming Your Pour...'
                : `Complete Demo Order • ₹${totalAmount}`}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <>
      <Navbar />
      <style>{CHECKOUT_CSS}</style>
      <Suspense
        fallback={
          <main
            className="mchk-page"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: GOLD_LIGHT,
            }}
          >
            Loading checkout...
          </main>
        }
      >
        <CheckoutContent />
      </Suspense>
    </>
  );
}