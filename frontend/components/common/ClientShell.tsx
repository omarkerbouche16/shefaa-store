'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Toast } from '@heroui/react';

const Header = dynamic(() => import('@/components/brand/Header'), { ssr: false });
const Footer = dynamic(() => import('@/components/brand/Footer'), { ssr: false });
const CartDrawer = dynamic(() => import('@/components/cart/CartDrawer'), { ssr: false });
const CheckoutModal = dynamic(
  () => import('@/components/checkout/CheckoutModal'),
  { ssr: false }
);

export default function ClientShell({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {/* Toast notifications — RTL-aware, bottom-right for Arabic */}
      <Toast.Provider
        placement="bottom end"
        maxVisibleToasts={3}
        width={360}
      />

      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          {mounted ? children : null}
        </main>
        <Footer />
      </div>
      <CartDrawer />
      <CheckoutModal />
    </>
  );
}
