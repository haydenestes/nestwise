'use client';

export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabase } from '@/lib/supabase';

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await getSupabase().auth.signInWithPassword({ email, password });
    if (error) { setError(error.message); setLoading(false); return; }
    router.push('/dashboard');
  }

  return (
    <>
      <style>{`
        .auth-root {
          min-height: 100vh;
          background: #0e0c0a;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Inter', sans-serif;
          padding: 24px;
        }
        .auth-card {
          background: #161310;
          border: 1px solid rgba(201,168,76,0.15);
          border-radius: 12px;
          padding: 40px 36px;
          width: 100%;
          max-width: 400px;
        }
        .auth-logo {
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.18em;
          color: #c9a84c;
          text-transform: uppercase;
          margin-bottom: 28px;
        }
        .auth-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 28px;
          font-weight: 300;
          color: #f0ebe0;
          margin-bottom: 6px;
        }
        .auth-sub {
          font-size: 13px;
          color: rgba(240,235,224,0.45);
          margin-bottom: 32px;
        }
        .auth-field { margin-bottom: 16px; }
        .auth-field label {
          display: block;
          font-size: 11px;
          letter-spacing: 0.06em;
          color: rgba(240,235,224,0.5);
          text-transform: uppercase;
          margin-bottom: 6px;
        }
        .auth-field input {
          width: 100%;
          background: rgba(240,235,224,0.04);
          border: 1px solid rgba(240,235,224,0.1);
          border-radius: 4px;
          padding: 10px 12px;
          color: #f0ebe0;
          font-size: 14px;
          font-family: 'Inter', sans-serif;
          outline: none;
          transition: border-color 0.2s;
        }
        .auth-field input:focus { border-color: rgba(201,168,76,0.4); }
        .auth-error {
          font-size: 12px;
          color: #f87171;
          margin-bottom: 16px;
          padding: 8px 12px;
          background: rgba(248,113,113,0.08);
          border-radius: 4px;
          border: 1px solid rgba(248,113,113,0.2);
        }
        .auth-btn {
          width: 100%;
          background: #c9a84c;
          color: #0e0c0a;
          border: none;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 13px;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          transition: background 0.2s;
          margin-top: 8px;
        }
        .auth-btn:hover { background: #e8c97a; }
        .auth-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .auth-footer {
          margin-top: 20px;
          text-align: center;
          font-size: 13px;
          color: rgba(240,235,224,0.4);
        }
        .auth-footer a {
          color: #c9a84c;
          text-decoration: none;
          cursor: pointer;
        }
        .auth-footer a:hover { text-decoration: underline; }
      `}</style>
      <div className="auth-root">
        <div className="auth-card">
          <div className="auth-logo">Nestwise</div>
          <div className="auth-title">Welcome back.</div>
          <div className="auth-sub">Sign in to view your SF rental matches.</div>
          <form onSubmit={handleSignIn}>
            <div className="auth-field">
              <label>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" />
            </div>
            <div className="auth-field">
              <label>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" />
            </div>
            {error && <div className="auth-error">{error}</div>}
            <button className="auth-btn" type="submit" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in →'}
            </button>
          </form>
          <div className="auth-footer">
            Don&apos;t have an account?{' '}
            <a onClick={() => router.push('/signup')}>Start your search</a>
          </div>
        </div>
      </div>
    </>
  );
}
