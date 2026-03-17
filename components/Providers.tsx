'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppProvider, useApp } from '@/lib/context';
import AuthModal from './AuthModal';

function SuccessOverlay() {
  const { showSuccess, setShowSuccess } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
        router.push('/dashboard');
      }, 2400);
      return () => clearTimeout(timer);
    }
  }, [showSuccess, setShowSuccess, router]);

  if (!showSuccess) return null;

  return (
    <div className="success-overlay">
      <div className="success-wrap">
        <div className="success-card">
          <div className="success-mark">✦</div>
          <div className="success-title">Your search is live.</div>
          <div className="success-body">
            NestWise is now scanning{' '}
            <span className="success-gold">10 curated sources</span> across San
            Francisco. Your first matches are loading now.
          </div>
          <div className="success-body" style={{ fontSize: '13px', marginTop: '8px' }}>
            Preparing your dashboard…
          </div>
        </div>
      </div>
    </div>
  );
}

function InnerProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <SuccessOverlay />
      <AuthModal />
    </>
  );
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <InnerProviders>{children}</InnerProviders>
    </AppProvider>
  );
}
