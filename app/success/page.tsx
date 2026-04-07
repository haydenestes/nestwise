'use client';

import Link from 'next/link';

export default function SuccessPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8f7f5',
      color: '#1e1e1e',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      <div style={{
        maxWidth: '500px',
        textAlign: 'center',
        background: '#fff',
        padding: '48px 32px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>✓</div>
        <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '12px', color: '#1e1e1e' }}>
          You're all set!
        </h1>
        <p style={{ fontSize: '16px', color: '#666', marginBottom: '24px', lineHeight: '1.6' }}>
          We'll start sending you personalized apartment matches for San Francisco based on your criteria and notification preferences.
        </p>
        <p style={{ fontSize: '14px', color: '#999', marginBottom: '32px' }}>
          Check your inbox for the first listings. New matches will arrive according to your preferences.
        </p>
        <Link href="/" style={{
          display: 'inline-block',
          padding: '12px 24px',
          background: '#6b8f71',
          color: '#fff',
          textDecoration: 'none',
          borderRadius: '8px',
          fontWeight: 500,
          fontSize: '14px',
        }}>
          Back to Home
        </Link>
      </div>
    </div>
  );
}
