// app/orders/[orderId]/page.tsx
'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  CheckCircle2,
  Package,
  Truck,
  Coffee,
  MapPin,
  ArrowRight,
  User,
} from 'lucide-react';
import Navbar from '@/app/components/navigation/Navbar';
import PourAccomplishmentHero from '@/app/components/orders/PourAccomplishmentHero'; 

interface OrderData {
  orderId: string;
  customerEmail: string;
  items: Array<{
    productId: string;
    shortName: string;
    packSize: string;
    cocoaPercent: string;
    unitPrice: number;
    quantity: number;
    imageUrl: string;
  }>;
  subtotal: number;
  discount: number;
  shippingFee: number;
  totalAmount: number;
  couponCode: string | null;
  paymentMethod: string;
  shippingAddress: {
    fullName: string;
    phone: string;
    line1: string;
    city: string;
    state: string;
    pincode: string;
  };
  createdAt: string;
}

const CREAM = '#FFF8F0';
const COCOA = '#1A120B';
const GOLD = '#D4A373';
const GOLD_LIGHT = '#EBC593';
const TERRACOTTA = '#C86D51';

const RECEIPT_CSS = `
.mord-page {
  min-height: 100dvh;
  background: radial-gradient(circle at 50% 10%, #28150B 0%, #120B06 70%);
  color: ${CREAM};
  padding: 128px 24px 88px;
}

.mord-wrap {
  max-width: 780px;
  margin: 0 auto;
}

.mord-card {
  border-radius: 28px;
  padding: 32px;
  background: linear-gradient(160deg, #24140C 0%, #150C07 100%);
  border: 1px solid rgba(212, 163, 115, 0.28);
  box-shadow: 0 28px 64px rgba(0, 0, 0, 0.6);
}

.mord-steps {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin: 26px 0;
}

.mord-step {
  padding: 12px 10px;
  border-radius: 14px;
  text-align: center;
  font-size: 11px;
  font-weight: 800;
}

@media (max-width: 640px) {
  .mord-card {
    padding: 22px 18px;
  }
  .mord-steps {
    grid-template-columns: repeat(2, 1fr);
  }
}
`;

function OrderReceiptContent() {
  const params = useParams();
  const orderId =
    typeof params?.orderId === 'string'
      ? params.orderId
      : Array.isArray(params?.orderId)
      ? params.orderId[0]
      : '';

  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;
    let active = true;

    fetch(`/api/orders/${encodeURIComponent(orderId)}`, { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : { order: null }))
      .then((data) => {
        if (active) {
          setOrder(data.order || null);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [orderId]);

  if (loading) {
    return (
      <main
        className="mord-page"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: GOLD_LIGHT,
        }}
      >
        Brewing your order receipt...
      </main>
    );
  }

  if (!order) {
    return (
      <main className="mord-page">
        <div className="mord-wrap" style={{ textAlign: 'center' }}>
          <div className="mord-card">
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 900 }}>
              Order Not Found
            </h1>
            <p style={{ color: GOLD_LIGHT, marginTop: '8px' }}>
              We couldn&apos;t locate order #{orderId}.
            </p>
            <Link
              href="/products"
              style={{
                display: 'inline-block',
                marginTop: '16px',
                padding: '12px 24px',
                borderRadius: '9999px',
                background: GOLD_LIGHT,
                color: COCOA,
                fontWeight: 900,
                textDecoration: 'none',
                fontSize: '12px',
              }}
            >
              Back to Store
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mord-page">
      <div className="mord-wrap">
        <div className="mord-card">
          {/* Sad-to-Happy Accomplishment Animation */}
          <PourAccomplishmentHero
            orderId={order.orderId}
            customerName={order.shippingAddress.fullName}
          />

          {/* 4-Step Visual Dispatch Tracker */}
          <div className="mord-steps">
            <div
              className="mord-step"
              style={{
                background: 'rgba(212, 163, 115, 0.2)',
                border: '1px solid #EBC593',
                color: CREAM,
              }}
            >
              <CheckCircle2
                size={16}
                style={{ color: GOLD_LIGHT, marginBottom: '4px' }}
              />
              <div>Order Confirmed</div>
            </div>
            <div
              className="mord-step"
              style={{
                background: 'rgba(255, 248, 240, 0.04)',
                border: '1px solid rgba(212, 163, 115, 0.2)',
                color: 'rgba(255, 248, 240, 0.65)',
              }}
            >
              <Package size={16} style={{ color: GOLD, marginBottom: '4px' }} />
              <div>Fresh Batch Packing</div>
            </div>
            <div
              className="mord-step"
              style={{
                background: 'rgba(255, 248, 240, 0.04)',
                border: '1px solid rgba(212, 163, 115, 0.2)',
                color: 'rgba(255, 248, 240, 0.65)',
              }}
            >
              <Truck size={16} style={{ color: GOLD, marginBottom: '4px' }} />
              <div>Insulated Dispatch</div>
            </div>
            <div
              className="mord-step"
              style={{
                background: 'rgba(255, 248, 240, 0.04)',
                border: '1px solid rgba(212, 163, 115, 0.2)',
                color: 'rgba(255, 248, 240, 0.65)',
              }}
            >
              <Coffee
                size={16}
                style={{ color: TERRACOTTA, marginBottom: '4px' }}
              />
              <div>Ready to Whisk</div>
            </div>
          </div>

          {/* Items Ordered */}
          <div
            style={{
              padding: '18px',
              borderRadius: '18px',
              background: 'rgba(255, 248, 240, 0.03)',
              border: '1px solid rgba(212, 163, 115, 0.18)',
              marginBottom: '18px',
            }}
          >
            <div
              style={{
                fontSize: '11px',
                fontWeight: 800,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: GOLD,
                marginBottom: '12px',
              }}
            >
              Items in Your Box
            </div>

            {order.items.map((item) => (
              <div
                key={item.productId}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 0',
                  borderBottom: '1px solid rgba(212, 163, 115, 0.1)',
                }}
              >
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.shortName}
                    style={{
                      width: '40px',
                      height: '48px',
                      objectFit: 'contain',
                    }}
                  />
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 800 }}>
                      {item.shortName} × {item.quantity}
                    </div>
                    <div style={{ fontSize: '11.5px', color: GOLD_LIGHT }}>
                      {item.cocoaPercent} Real Cocoa
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    fontSize: '14.5px',
                    fontWeight: 900,
                    color: GOLD_LIGHT,
                  }}
                >
                  ₹{item.unitPrice * item.quantity}
                </div>
              </div>
            ))}

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '14px',
                fontSize: '16px',
                fontWeight: 900,
              }}
            >
              <span>Total Paid (Demo)</span>
              <span style={{ color: GOLD_LIGHT }}>₹{order.totalAmount}</span>
            </div>
          </div>

          {/* Delivery Address */}
          <div
            style={{
              padding: '16px 18px',
              borderRadius: '18px',
              background: 'rgba(255, 248, 240, 0.03)',
              border: '1px solid rgba(212, 163, 115, 0.18)',
              fontSize: '13px',
              lineHeight: 1.6,
              color: 'rgba(255, 248, 240, 0.82)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '11px',
                fontWeight: 800,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: GOLD,
                marginBottom: '6px',
              }}
            >
              <MapPin size={13} /> Shipping To
            </div>
            <div style={{ fontWeight: 800, color: CREAM }}>
              {order.shippingAddress.fullName} • {order.shippingAddress.phone}
            </div>
            <div>
              {order.shippingAddress.line1}, {order.shippingAddress.city},{' '}
              {order.shippingAddress.state} — {order.shippingAddress.pincode}
            </div>
          </div>

          {/* Next Actions */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
              marginTop: '24px',
            }}
          >
            <Link
              href="/account"
              style={{
                flex: 1,
                minWidth: '200px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '14px 22px',
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
              <User size={15} /> View in My Profile
            </Link>

            <Link
              href="/products"
              style={{
                flex: 1,
                minWidth: '200px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '14px 22px',
                borderRadius: '9999px',
                border: '1px solid rgba(212, 163, 115, 0.4)',
                background: 'rgba(255, 248, 240, 0.04)',
                color: GOLD_LIGHT,
                fontWeight: 800,
                fontSize: '12px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                textDecoration: 'none',
              }}
            >
              Order More Packs <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function OrderReceiptPage() {
  return (
    <>
      <Navbar />
      <style>{RECEIPT_CSS}</style>
      <Suspense
        fallback={
          <main
            className="mord-page"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: GOLD_LIGHT,
            }}
          >
            Loading receipt...
          </main>
        }
      >
        <OrderReceiptContent />
      </Suspense>
    </>
  );
}