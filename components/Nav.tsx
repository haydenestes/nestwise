'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useApp } from '@/lib/context';

const STEPS = [
  { label: '1', path: '/criteria' },
  { label: '2', path: '/dashboard' },
];

export default function Nav() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, setAuthOpen, setAuthMode } = useApp();

  function getStepState(path: string): 'done' | 'active' | 'idle' {
    if (pathname === '/criteria') {
      if (path === '/criteria') return 'active';
      return 'idle';
    }
    if (pathname === '/dashboard') {
      if (path === '/dashboard') return 'active';
      if (path === '/criteria') return 'done';
      return 'idle';
    }
    return 'idle';
  }

  return (
    <nav className="nav">
      <button className="nav-brand" onClick={() => router.push('/')}>
        NestWise
      </button>

      <div className="nav-progress">
        <div className="nav-step-wrap">
          {STEPS.map((step, i) => {
            const state = getStepState(step.path);
            return (
              <React.Fragment key={step.path}>
                {i > 0 && (
                  <div
                    className={`nav-step-line${
                      getStepState(STEPS[i - 1].path) === 'done' ? ' done' : ''
                    }`}
                  />
                )}
                <div className={`nav-step-dot${state === 'active' ? ' active' : state === 'done' ? ' done' : ''}`}>
                  {state === 'done' ? '✓' : step.label}
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div className="nav-actions">
        {user ? (
          <span className="nav-link" style={{ cursor: 'default' }}>
            {user.name}
          </span>
        ) : (
          <>
            <button
              className="nav-link"
              onClick={() => {
                setAuthMode('login');
                setAuthOpen(true);
              }}
            >
              Sign in
            </button>
            <button
              className="nav-link-primary"
              onClick={() => {
                setAuthMode('signup');
                setAuthOpen(true);
              }}
            >
              Sign up
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
