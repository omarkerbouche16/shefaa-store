'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@heroui/react';
import { useCartStore } from '@/store/cart-store';
import Logo from './Logo';
import { cn } from '@/lib/utils';
import AnnouncementBar from './AnnouncementBar';
import { debugCart } from '@/lib/debug-cart';

const NAV_LINKS = [
  { href: '/', label: 'الرئيسية' },
  { href: '/products', label: 'المنتجات' },
  { href: '/about', label: 'من نحن' },
  { href: '/contact', label: 'تواصل معنا' },
];

function CartIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <div className="w-5 flex flex-col gap-1">
      <span className={cn('h-0.5 bg-desert-olive rounded transition-all duration-200', open && 'rotate-45 translate-y-1.5')} />
      <span className={cn('h-0.5 bg-desert-olive rounded transition-all duration-200', open && 'opacity-0 scale-x-0')} />
      <span className={cn('h-0.5 bg-desert-olive rounded transition-all duration-200', open && '-rotate-45 -translate-y-1.5')} />
    </div>
  );
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { getItemCount, openCart } = useCartStore();
  const itemCount = mounted ? getItemCount() : 0;

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <AnnouncementBar />
      <header
        className={cn(
          'sticky top-0 inset-x-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-cream/95 backdrop-blur-md shadow-warm border-b border-border-sand'
            : 'bg-cream'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-18">

            {/* Logo */}
            <Logo size="md" />

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-6" aria-label="التنقل الرئيسي">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-plex text-sm font-medium text-charcoal-ink hover:text-honey-gold transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Cart + Mobile menu */}
            <div className="flex items-center gap-1">
              {/* Cart button */}
              <Button
                isIconOnly
                variant="ghost"
                aria-label="سلة التسوق"
                className="relative min-h-[44px] min-w-[44px] rounded-full hover:bg-warm-sand/60 touch-manipulation text-desert-olive"
                onPress={() => {
                  debugCart('Header', 'open cart');
                  openCart();
                }}
              >
                <CartIcon />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -left-1 w-5 h-5 flex items-center justify-center bg-honey-gold text-white text-[10px] font-bold rounded-full font-inter pointer-events-none">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </Button>

              {/* Mobile hamburger */}
              <Button
                isIconOnly
                variant="ghost"
                className="md:hidden min-h-[44px] min-w-[44px] rounded-full hover:bg-warm-sand/60 touch-manipulation"
                onPress={() => setMenuOpen(!menuOpen)}
                aria-label="القائمة"
                aria-expanded={menuOpen}
              >
                <MenuIcon open={menuOpen} />
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu — full-width slide-down */}
        <div
          className={cn(
            'md:hidden overflow-hidden transition-all duration-300 ease-in-out',
            menuOpen ? 'max-h-64 border-t border-border-sand' : 'max-h-0'
          )}
        >
          <nav className="bg-cream px-4 py-3 space-y-1" aria-label="القائمة المحمولة">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center py-3 px-4 font-plex font-medium text-charcoal-ink hover:text-honey-gold hover:bg-warm-sand/40 rounded-xl transition-colors duration-200 min-h-[48px]"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
    </>
  );
}
