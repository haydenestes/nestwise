'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/context';

export default function AuthModal() {
  const { authOpen, setAuthOpen, authMode, setAuthMode, setUser, setShowSuccess } =
    useApp();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!authOpen) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const resolvedName =
      authMode === 'signup' ? name || 'Guest' : email.split('@')[0] || 'Guest';
    setUser({ name: resolvedName, email });
    setAuthOpen(false);
    setShowSuccess(true);
    // SuccessOverlay in Providers handles the 2.4s delay + router.push('/criteria')
  }

  return (
    <div className="overlay" onClick={() => setAuthOpen(false)}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={() => setAuthOpen(false)}>
          ✕
        </button>
        <div className="modal-wordmark">NestWise</div>

        {authMode === 'signup' ? (
          <>
            <div className="modal-title">Create your account</div>
            <div className="modal-sub">
              Start receiving curated SF listings matched to your exact criteria.
            </div>
          </>
        ) : (
          <>
            <div className="modal-title">Welcome back</div>
            <div className="modal-sub">
              Sign in to view your matches and manage your search.
            </div>
          </>
        )}

        <form onSubmit={handleSubmit}>
          {authMode === 'signup' && (
            <div className="modal-field">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Jane Smith"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            </div>
          )}
          <div className="modal-field">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="jane@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className="modal-field">
            <label>Password</label>
            <input
              type="password"
              placeholder={authMode === 'signup' ? 'Create a password' : 'Your password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete={authMode === 'signup' ? 'new-password' : 'current-password'}
            />
          </div>

          <button type="submit" className="modal-submit">
            {authMode === 'signup' ? 'Create Account & Start Search' : 'Sign In'}
          </button>
        </form>

        <div className="modal-divider">
          <span>or</span>
        </div>

        <div className="modal-switch">
          {authMode === 'signup' ? (
            <>
              Already have an account?{' '}
              <button onClick={() => setAuthMode('login')}>Sign in</button>
            </>
          ) : (
            <>
              New to NestWise?{' '}
              <button onClick={() => setAuthMode('signup')}>Create account</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
