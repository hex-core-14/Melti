// app/components/navigation/Navbar.tsx
'use client';

import React, { Suspense, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  Search,
  User,
  LogOut,
  Menu,
  X,
  Sparkles,
  ArrowRight,
  Plus,
  Minus,
  Trash2,
  Tag,
} from 'lucide-react';
import { MELTI_PRODUCTS } from '@/app/config/productsConfig';
import { useCart } from '@/app/context/CartContext';

interface NavbarProps {
  cartCount?: number;
  onOpenCart?: () => void;
}

interface SessionUser {
  userId?: string;
  name: string;
  email: string;
}

const CREAM = '#FFF8F0';
const COCOA = '#1A120B';
const COCOA_DEEP = '#120B06';
const GOLD = '#D4A373';
const GOLD_LIGHT = '#EBC593';
const TERRACOTTA = '#C86D51';

const LINKS = [
  { href: '#products', id: 'products', label: 'Products' },
  { href: '#why-melti', id: 'why-melti', label: 'Why Melti' },
  { href: '#recipes', id: 'recipes', label: 'Recipes' },
  { href: '#story', id: 'story', label: 'Our Story' },
];

const NAVBAR_CSS = `
.mnav-shell {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
  transition:
    background-color 0.4s cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow 0.4s ease,
    border-color 0.4s ease;
}

.mnav-ribbon {
  overflow: hidden;
  background: linear-gradient(90deg, #1E0F07 0%, #2E170B 50%, #1E0F07 100%);
  border-bottom: 1px solid rgba(212, 163, 115, 0.16);
  color: ${GOLD_LIGHT};
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  text-align: center;
  transition: max-height 0.35s ease, opacity 0.25s ease, padding 0.35s ease;
}

.mnav-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  transition: padding 0.35s ease;
}

.mnav-brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  position: relative;
}

.mnav-brand-text {
  font-size: 26px;
  font-weight: 900;
  letter-spacing: 0.12em;
  color: ${CREAM};
  transition: color 0.25s ease;
}

.mnav-brand:hover .mnav-brand-text {
  color: ${GOLD_LIGHT};
}

.mnav-link {
  position: relative;
  color: rgba(255, 248, 240, 0.84);
  text-decoration: none;
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  padding: 6px 2px;
  transition: color 0.2s ease;
  white-space: nowrap;
  cursor: pointer;
}

.mnav-link::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 0%;
  height: 1.5px;
  background: linear-gradient(90deg, ${GOLD_LIGHT}, ${GOLD});
  transition: width 0.25s ease;
}

.mnav-link:hover,
.mnav-link.active {
  color: ${GOLD_LIGHT};
}

.mnav-link:hover::after,
.mnav-link.active::after {
  width: 100%;
}

.mnav-icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 9999px;
  color: rgba(255, 248, 240, 0.88);
  background: rgba(255, 248, 240, 0.03);
  border: 1px solid rgba(212, 163, 115, 0.14);
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease, transform 0.15s ease;
}

.mnav-icon-btn:hover {
  background: rgba(212, 163, 115, 0.14);
  border-color: rgba(212, 163, 115, 0.42);
  color: ${GOLD_LIGHT};
}

.mnav-icon-btn:active {
  transform: scale(0.95);
}

.mnav-user-pill {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  height: 38px;
  padding: 0 13px;
  border-radius: 9999px;
  background: rgba(212, 163, 115, 0.12);
  border: 1px solid rgba(212, 163, 115, 0.34);
  color: ${GOLD_LIGHT};
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  white-space: nowrap;
  text-decoration: none;
}

.mnav-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 11px 24px;
  border-radius: 9999px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${COCOA};
  background: linear-gradient(135deg, ${GOLD_LIGHT} 0%, ${GOLD} 55%, #B9824F 100%);
  text-decoration: none;
  border: none;
  cursor: pointer;
  box-shadow: 0 6px 18px rgba(212, 163, 115, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.35);
  transition: filter 0.2s ease, transform 0.12s ease;
  white-space: nowrap;
}

.mnav-cta:hover {
  filter: brightness(1.08);
}

.mnav-cta:active {
  transform: scale(0.96);
}

.mnav-burger {
  display: none;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 9999px;
  border: 1px solid rgba(212, 163, 115, 0.24);
  background: rgba(255, 248, 240, 0.05);
  color: ${CREAM};
  cursor: pointer;
}

.mnav-desktop {
  display: flex;
}

.mnav-mobile-panel {
  display: none;
}

@media (max-width: 960px) {
  .mnav-desktop {
    display: none;
  }
  .mnav-burger {
    display: inline-flex;
  }
  .mnav-mobile-panel {
    display: block;
  }
}

.mnav-mobile-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${CREAM};
  text-decoration: none;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 6px 0;
}

.mnav-mobile-link:hover,
.mnav-mobile-link.active {
  color: ${GOLD_LIGHT};
}

/* ===== Search Overlay ===== */
.mnav-search-backdrop {
  position: fixed;
  inset: 0;
  z-index: 10002;
  background: rgba(10, 5, 3, 0.78);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 96px 20px 24px;
}

.mnav-search-box {
  width: 100%;
  max-width: 580px;
  border-radius: 26px;
  background: linear-gradient(160deg, #28150A 0%, #140B06 100%);
  border: 1.5px solid rgba(212, 163, 115, 0.38);
  box-shadow: 0 32px 80px rgba(0, 0, 0, 0.75);
  overflow: hidden;
  color: ${CREAM};
}

.mnav-search-input-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 18px 22px;
  border-bottom: 1px solid rgba(212, 163, 115, 0.16);
}

.mnav-search-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: ${CREAM};
  font-size: 15px;
  font-weight: 600;
}

.mnav-search-input::placeholder {
  color: rgba(235, 197, 147, 0.45);
}

.mnav-search-result {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 13px 22px;
  text-decoration: none;
  color: ${CREAM};
  border-bottom: 1px solid rgba(212, 163, 115, 0.08);
  transition: background 0.18s ease;
}

.mnav-search-result:hover {
  background: rgba(212, 163, 115, 0.1);
}

/* ===== Slide-Over Bag Drawer ===== */
.mnav-drawer-backdrop {
  position: fixed;
  inset: 0;
  z-index: 10002;
  background: rgba(10, 5, 3, 0.72);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  display: flex;
  justify-content: flex-end;
}

.mnav-drawer {
  width: 100%;
  max-width: 420px;
  height: 100%;
  background: linear-gradient(180deg, #231208 0%, #120B06 100%);
  border-left: 1px solid rgba(212, 163, 115, 0.25);
  padding: 24px 22px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: ${CREAM};
  box-shadow: -24px 0 60px rgba(0, 0, 0, 0.65);
}
`;

function NavbarContent({ onOpenCart }: NavbarProps) {
  const pathname = usePathname();
  const {
    items,
    totalItems,
    subtotal,
    discount,
    shippingFee,
    totalAmount,
    freeShippingThreshold,
    amountToFreeShipping,
    couponCode,
    couponError,
    isBagOpen,
    openBag,
    closeBag,
    addItem,
    updateQuantity,
    removeItem,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [promoInput, setPromoInput] = useState('');
  const [currentUser, setCurrentUser] = useState<SessionUser | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let active = true;
    fetch('/api/auth/me', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : { user: null }))
      .then((data) => {
        if (active) setCurrentUser(data.user || null);
      })
      .catch(() => {
        if (active) setCurrentUser(null);
      });

    return () => {
      active = false;
    };
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setIsScrolled(y > 30);

      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? Math.min(100, (y / docHeight) * 100) : 0);

      let current = '';
      for (const link of LINKS) {
        const el = document.getElementById(link.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 180 && rect.bottom >= 180) {
            current = link.id;
            break;
          }
        }
      }
      setActiveSection(current);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 960) setMobileMenuOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
        closeBag();
        setMobileMenuOpen(false);
      } else if (e.key === 'Escape') {
        setSearchOpen(false);
        closeBag();
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [closeBag]);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 60);
    } else {
      setQuery('');
    }
  }, [searchOpen]);

  const handleAnchorClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (!href.startsWith('#')) return;
    const target = document.getElementById(href.slice(1));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.pushState(null, '', href);
      setMobileMenuOpen(false);
      setSearchOpen(false);
      closeBag();
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      setCurrentUser(null);
      setMobileMenuOpen(false);
    }
  };

  const matchingProducts = (MELTI_PRODUCTS || []).filter((p) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      p.name?.toLowerCase().includes(q) ||
      p.packSize?.toLowerCase().includes(q) ||
      p.tagline?.toLowerCase().includes(q) ||
      p.cocoaPercent?.toLowerCase().includes(q) ||
      (Array.isArray(p.tastingNotes) &&
        p.tastingNotes.some((n) => n.toLowerCase().includes(q)))
    );
  });

  const handleBagClick = () => {
    if (onOpenCart) {
      onOpenCart();
    } else {
      openBag();
    }
  };

  const handlePromoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (applyCoupon(promoInput)) {
      setPromoInput('');
    }
  };

  const firstName = currentUser?.name?.trim().split(' ')[0] || 'Member';
  const shippingPercent = Math.min(
    100,
    Math.round(((subtotal - discount) / freeShippingThreshold) * 100)
  );

  return (
    <>
      <nav
        className="mnav-shell"
        style={{
          backgroundColor: isScrolled
            ? 'rgba(18, 11, 6, 0.82)'
            : 'rgba(18, 11, 6, 0.18)',
          backdropFilter: isScrolled ? 'blur(20px) saturate(150%)' : 'blur(6px)',
          WebkitBackdropFilter: isScrolled
            ? 'blur(20px) saturate(150%)'
            : 'blur(6px)',
          borderBottom: isScrolled
            ? '1px solid rgba(212, 163, 115, 0.18)'
            : '1px solid rgba(255, 248, 240, 0.06)',
          boxShadow: isScrolled ? '0 10px 34px rgba(0, 0, 0, 0.35)' : 'none',
        }}
      >
        <style>{NAVBAR_CSS}</style>

        {/* Collapsible Top D2C Announcement Strip */}
        <div
          className="mnav-ribbon"
          style={{
            maxHeight: isScrolled ? '0px' : '34px',
            opacity: isScrolled ? 0 : 1,
            padding: isScrolled ? '0 16px' : '8px 16px',
            borderBottomWidth: isScrolled ? '0px' : '1px',
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={11} /> 32% Real Cocoa • 20g Sachet at ₹32 | 200g Family Pack at ₹256 • Code{' '}
            <strong style={{ color: CREAM }}>FIRSTPOUR15</strong>
          </span>
        </div>

        {/* Main Bar */}
        <div
          className="mnav-inner"
          style={{ padding: isScrolled ? '13px 24px' : '17px 24px' }}
        >
          <Link href="/" className="mnav-brand" aria-label="Mèlti Home">
            <span className="mnav-brand-text">
              MÈLTI
              <span
                style={{
                  color: GOLD,
                  textShadow: '0 0 16px rgba(212, 163, 115, 0.45)',
                }}
              >
                .
              </span>
            </span>
          </Link>

          <div className="mnav-desktop" style={{ alignItems: 'center', gap: '34px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
              {LINKS.map((l) => (
                <a
                  key={l.href}
                  href={pathname === '/' ? l.href : `/${l.href}`}
                  onClick={(e) => handleAnchorClick(e, l.href)}
                  className={`mnav-link ${activeSection === l.id ? 'active' : ''}`}
                >
                  {l.label}
                </a>
              ))}
            </div>

            <div style={{ width: '1px', height: '20px', background: `${GOLD}40` }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={() => setSearchOpen(true)}
                className="mnav-icon-btn"
                aria-label="Search chocolate packs"
                title="Search packs (⌘K)"
              >
                <Search size={16} strokeWidth={2.1} />
              </button>

              <button
                onClick={handleBagClick}
                className="mnav-icon-btn"
                style={{ position: 'relative' }}
                aria-label="Open pour bag"
              >
                <ShoppingBag size={16} strokeWidth={2.1} />
                <span
                  style={{
                    position: 'absolute',
                    top: '-2px',
                    right: '-2px',
                    minWidth: '16px',
                    height: '16px',
                    padding: '0 4px',
                    borderRadius: '9999px',
                    background: TERRACOTTA,
                    color: CREAM,
                    fontSize: '9px',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 0 0 2px ${COCOA_DEEP}`,
                  }}
                >
                  {totalItems}
                </span>
              </button>

              {currentUser ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Link href="/account" className="mnav-user-pill" title={currentUser.email}>
                    <User size={14} strokeWidth={2.2} />
                    Hi, {firstName}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="mnav-icon-btn"
                    aria-label="Log out"
                    title="Log out"
                  >
                    <LogOut size={15} strokeWidth={2.1} />
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="mnav-icon-btn"
                  style={{
                    width: 'auto',
                    gap: '6px',
                    padding: '0 13px',
                    textDecoration: 'none',
                  }}
                >
                  <User size={15} strokeWidth={2.1} />
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      letterSpacing: '0.09em',
                      textTransform: 'uppercase',
                    }}
                  >
                    Login
                  </span>
                </Link>
              )}

              <Link href="/products" className="mnav-cta">
                Shop Now
              </Link>
            </div>
          </div>

          {/* Mobile Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} className="mnav-mobile-panel">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => setSearchOpen(true)}
                className="mnav-icon-btn"
                aria-label="Search packs"
              >
                <Search size={17} />
              </button>

              <button
                onClick={handleBagClick}
                className="mnav-icon-btn"
                style={{ position: 'relative' }}
                aria-label="Open pour bag"
              >
                <ShoppingBag size={17} />
                <span
                  style={{
                    position: 'absolute',
                    top: '-2px',
                    right: '-2px',
                    minWidth: '16px',
                    height: '16px',
                    borderRadius: '9999px',
                    background: TERRACOTTA,
                    color: CREAM,
                    fontSize: '9px',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {totalItems}
                </span>
              </button>

              <button
                className="mnav-burger"
                onClick={() => setMobileMenuOpen((v) => !v)}
                aria-label="Toggle menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Scroll Reading Progress Hairline */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            height: '1.5px',
            width: `${scrollProgress}%`,
            background: `linear-gradient(90deg, ${GOLD}, ${GOLD_LIGHT}, ${TERRACOTTA})`,
            transition: 'width 0.12s ease-out',
            pointerEvents: 'none',
          }}
        />

        {/* Mobile Dropdown Panel */}
        <div
          className="mnav-mobile-panel"
          style={{
            maxHeight: mobileMenuOpen ? '460px' : '0px',
            overflow: 'hidden',
            transition: 'max-height 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
            background: 'rgba(18, 11, 6, 0.98)',
            backdropFilter: 'blur(22px)',
            WebkitBackdropFilter: 'blur(22px)',
            borderTop: mobileMenuOpen ? '1px solid rgba(212, 163, 115, 0.16)' : 'none',
          }}
        >
          <div style={{ padding: '22px 24px 28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={pathname === '/' ? l.href : `/${l.href}`}
                className={`mnav-mobile-link ${activeSection === l.id ? 'active' : ''}`}
                onClick={(e) => handleAnchorClick(e, l.href)}
              >
                <span>{l.label}</span>
                <ArrowRight size={14} style={{ color: GOLD }} />
              </a>
            ))}

            <div style={{ height: '1px', background: `${GOLD}2E`, margin: '4px 0' }} />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
              {currentUser ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Link
                    href="/account"
                    onClick={() => setMobileMenuOpen(false)}
                    className="mnav-user-pill"
                  >
                    <User size={14} /> Hi, {firstName}
                  </Link>
                  <button
                    onClick={handleLogout}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      color: TERRACOTTA,
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: 800,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                    }}
                  >
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: CREAM,
                    textDecoration: 'none',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                  }}
                >
                  <User size={16} style={{ color: GOLD }} /> Login / Signup
                </Link>
              )}

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleBagClick();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: GOLD_LIGHT,
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}
              >
                <ShoppingBag size={16} /> Bag ({totalItems})
              </button>
            </div>

            <Link
              href="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="mnav-cta"
              style={{ width: '100%', padding: '13px 0', marginTop: '4px' }}
            >
              Shop Classic Packs
            </Link>
          </div>
        </div>
      </nav>

      {/* Quick-Pack Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSearchOpen(false)}
            className="mnav-search-backdrop"
          >
            <motion.div
              initial={{ opacity: 0, y: -16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.97 }}
              transition={{ duration: 0.22 }}
              onClick={(e) => e.stopPropagation()}
              className="mnav-search-box"
              role="dialog"
              aria-label="Search Melti hot chocolate packs"
            >
              <div className="mnav-search-input-row">
                <Search size={18} style={{ color: GOLD, flexShrink: 0 }} />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search 20g Sachet, 200g Family Pack, or 32% Cocoa..."
                  className="mnav-search-input"
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  aria-label="Close search"
                  className="mnav-icon-btn"
                  style={{ width: '32px', height: '32px' }}
                >
                  <X size={15} />
                </button>
              </div>

              <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
                {matchingProducts.length > 0 ? (
                  matchingProducts.map((prod) => (
                    <Link
                      key={prod.id}
                      href={`/products/${prod.slug}`}
                      onClick={() => setSearchOpen(false)}
                      className="mnav-search-result"
                    >
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 800, color: CREAM }}>
                          {prod.name}{' '}
                          <span style={{ fontSize: '11px', color: GOLD_LIGHT, fontWeight: 700 }}>
                            ({prod.cocoaPercent} Cocoa)
                          </span>
                        </div>
                        <div style={{ fontSize: '12px', color: 'rgba(235, 197, 147, 0.7)', marginTop: '2px' }}>
                          {prod.servings} • {prod.tastingNotes.join(' • ')}
                        </div>
                      </div>
                      <span style={{ fontSize: '14px', fontWeight: 900, color: GOLD_LIGHT }}>
                        ₹{prod.price}
                      </span>
                    </Link>
                  ))
                ) : (
                  <div style={{ padding: '28px 22px', textAlign: 'center', fontSize: '13px', color: 'rgba(235, 197, 147, 0.7)' }}>
                    No packs matched &ldquo;{query}&rdquo;. Try searching 20g, 200g, or 32%.
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Live Slide-Over Pour Bag Drawer */}
      <AnimatePresence>
        {isBagOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeBag}
            className="mnav-drawer-backdrop"
          >
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 260 }}
              onClick={(e) => e.stopPropagation()}
              className="mnav-drawer"
              aria-label="Your Pour Bag"
            >
              {/* Top Section */}
              <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0, flex: 1 }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingBottom: '16px',
                    borderBottom: '1px solid rgba(212, 163, 115, 0.18)',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '0.16em', textTransform: 'uppercase', color: GOLD }}>
                      32% Classic Couverture
                    </div>
                    <h3 style={{ fontSize: '20px', fontWeight: 900, margin: '2px 0 0' }}>
                      Your Pour Bag ({totalItems})
                    </h3>
                  </div>
                  <button
                    onClick={closeBag}
                    aria-label="Close bag"
                    className="mnav-icon-btn"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Free Shipping Progress Meter */}
                <div
                  style={{
                    marginTop: '14px',
                    padding: '12px 14px',
                    borderRadius: '15px',
                    background: 'rgba(212, 163, 115, 0.08)',
                    border: '1px solid rgba(212, 163, 115, 0.2)',
                  }}
                >
                  <div style={{ fontSize: '11.5px', fontWeight: 700, color: GOLD_LIGHT }}>
                    {amountToFreeShipping > 0
                      ? `Add ₹${amountToFreeShipping} more for free insulated shipping`
                      : 'Unlocked! Free cold-pack insulated shipping'}
                  </div>
                  <div
                    style={{
                      marginTop: '8px',
                      height: '5px',
                      borderRadius: '9999px',
                      background: 'rgba(255, 248, 240, 0.1)',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${shippingPercent}%`,
                        height: '100%',
                        background: `linear-gradient(90deg, ${GOLD}, ${GOLD_LIGHT})`,
                        transition: 'width 0.35s ease',
                      }}
                    />
                  </div>
                </div>

                {/* Cart Items List or Empty State */}
                {items.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '44px 12px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div
                      style={{
                        width: '52px',
                        height: '52px',
                        borderRadius: '9999px',
                        margin: '0 auto 14px',
                        background: 'rgba(212, 163, 115, 0.1)',
                        border: '1px solid rgba(212, 163, 115, 0.28)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: GOLD_LIGHT,
                      }}
                    >
                      <ShoppingBag size={22} />
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: CREAM }}>
                      Your mug is waiting
                    </div>
                    <p style={{ fontSize: '12.5px', color: 'rgba(235, 197, 147, 0.72)', marginTop: '6px', lineHeight: 1.5 }}>
                      Quick-add a 20g single sachet or a 200g family pack below.
                    </p>

                    {/* Quick 1-Tap Add Cards for the 2 SKUs */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '18px' }}>
                      {MELTI_PRODUCTS.map((p) => (
                        <div
                          key={p.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '11px 14px',
                            borderRadius: '14px',
                            background: 'rgba(255, 248, 240, 0.04)',
                            border: '1px solid rgba(212, 163, 115, 0.2)',
                            textAlign: 'left',
                          }}
                        >
                          <div>
                            <div style={{ fontSize: '13px', fontWeight: 800, color: CREAM }}>
                              {p.shortName}
                            </div>
                            <div style={{ fontSize: '11px', color: GOLD_LIGHT }}>
                              {p.cocoaPercent} Cocoa • ₹{p.price}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => addItem(p, 1)}
                            style={{
                              padding: '7px 14px',
                              borderRadius: '9999px',
                              border: 'none',
                              background: GOLD_LIGHT,
                              color: COCOA,
                              fontSize: '11px',
                              fontWeight: 900,
                              cursor: 'pointer',
                            }}
                          >
                            + Add
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div style={{ flex: 1, overflowY: 'auto', marginTop: '14px', paddingRight: '2px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {items.map((item) => (
                      <div
                        key={item.productId}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '12px',
                          borderRadius: '16px',
                          background: 'rgba(255, 248, 240, 0.04)',
                          border: '1px solid rgba(212, 163, 115, 0.2)',
                        }}
                      >
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          style={{
                            width: '50px',
                            height: '58px',
                            objectFit: 'contain',
                            borderRadius: '10px',
                            filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.5))',
                          }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '13.5px', fontWeight: 800, color: CREAM }}>
                            {item.shortName}
                          </div>
                          <div style={{ fontSize: '11px', color: 'rgba(235, 197, 147, 0.72)' }}>
                            {item.cocoaPercent} Cocoa • ₹{item.unitPrice} each
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                              aria-label="Decrease quantity"
                              style={{
                                width: '24px',
                                height: '24px',
                                borderRadius: '9999px',
                                border: '1px solid rgba(212, 163, 115, 0.35)',
                                background: 'transparent',
                                color: CREAM,
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                              }}
                            >
                              <Minus size={12} />
                            </button>
                            <span style={{ fontSize: '13px', fontWeight: 800, minWidth: '18px', textAlign: 'center' }}>
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                              aria-label="Increase quantity"
                              style={{
                                width: '24px',
                                height: '24px',
                                borderRadius: '9999px',
                                border: '1px solid rgba(212, 163, 115, 0.35)',
                                background: 'transparent',
                                color: CREAM,
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                              }}
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                        </div>

                        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                          <button
                            type="button"
                            onClick={() => removeItem(item.productId)}
                            aria-label="Remove item"
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: 'rgba(235, 197, 147, 0.5)',
                              cursor: 'pointer',
                              padding: 0,
                            }}
                          >
                            <Trash2 size={14} />
                          </button>
                          <span style={{ fontSize: '14px', fontWeight: 900, color: GOLD_LIGHT }}>
                            ₹{item.unitPrice * item.quantity}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom Totals + Coupon + Checkout CTA */}
              {items.length > 0 && (
                <div style={{ paddingTop: '14px', borderTop: '1px solid rgba(212, 163, 115, 0.2)' }}>
                  {/* Promo Code Input */}
                  {couponCode ? (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 12px',
                        borderRadius: '10px',
                        background: 'rgba(200, 109, 81, 0.16)',
                        border: '1px dashed #C86D51',
                        marginBottom: '12px',
                        fontSize: '12px',
                        color: GOLD_LIGHT,
                      }}
                    >
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 800 }}>
                        <Tag size={13} /> {couponCode} applied (-₹{discount})
                      </span>
                      <button
                        type="button"
                        onClick={removeCoupon}
                        style={{ background: 'transparent', border: 'none', color: CREAM, cursor: 'pointer', fontSize: '11px', textDecoration: 'underline' }}
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handlePromoSubmit} style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                      <input
                        type="text"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value)}
                        placeholder="Code: FIRSTPOUR15 or MELTI150"
                        style={{
                          flex: 1,
                          padding: '9px 12px',
                          borderRadius: '10px',
                          background: 'rgba(255, 248, 240, 0.06)',
                          border: '1px solid rgba(212, 163, 115, 0.25)',
                          color: CREAM,
                          fontSize: '12px',
                          outline: 'none',
                        }}
                      />
                      <button
                        type="submit"
                        style={{
                          padding: '0 14px',
                          borderRadius: '10px',
                          border: '1px solid rgba(212, 163, 115, 0.4)',
                          background: 'rgba(212, 163, 115, 0.15)',
                          color: GOLD_LIGHT,
                          fontSize: '11px',
                          fontWeight: 800,
                          textTransform: 'uppercase',
                          cursor: 'pointer',
                        }}
                      >
                        Apply
                      </button>
                    </form>
                  )}

                  {couponError && (
                    <div style={{ fontSize: '11px', color: '#F6B8A6', marginBottom: '8px' }}>
                      {couponError}
                    </div>
                  )}

                  {/* Price Summary */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '12.5px', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(255, 248, 240, 0.72)' }}>
                      <span>Subtotal</span>
                      <span>₹{subtotal}</span>
                    </div>
                    {discount > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#E89A6C' }}>
                        <span>Promo Discount</span>
                        <span>-₹{discount}</span>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(255, 248, 240, 0.72)' }}>
                      <span>Insulated Shipping</span>
                      <span>{shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}</span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '15px',
                        fontWeight: 900,
                        color: CREAM,
                        paddingTop: '6px',
                        borderTop: '1px solid rgba(212, 163, 115, 0.14)',
                      }}
                    >
                      <span>Total</span>
                      <span style={{ color: GOLD_LIGHT }}>₹{totalAmount}</span>
                    </div>
                  </div>

                  <Link
                    href="/checkout"
                    onClick={closeBag}
                    className="mnav-cta"
                    style={{ width: '100%', padding: '14px 0' }}
                  >
                    Proceed to Checkout • ₹{totalAmount}
                  </Link>
                </div>
              )}
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function Navbar(props: NavbarProps) {
  return (
    <Suspense fallback={<div style={{ height: '76px' }} />}>
      <NavbarContent {...props} />
    </Suspense>
  );
}