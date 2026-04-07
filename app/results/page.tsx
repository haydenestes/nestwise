'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MOCK_LISTINGS, MockListing } from '@/lib/mockListings';
import { ZillowListing } from '@/lib/zillow';
import { scoreAndSort, SearchCriteria } from '@/lib/scoring';

type AnyListing = MockListing | ZillowListing;
import PaywallModal from '@/components/PaywallModal';

type SortKey = 'score' | 'newest' | 'price-asc' | 'price-desc';

function ResultsInner() {
  const router = useRouter();
  const params = useSearchParams();
  const [listings, setListings] = useState<AnyListing[]>([]);
  const [dataSource, setDataSource] = useState<string>('mock');
  const [criteria, setCriteria] = useState<SearchCriteria | null>(null);
  const [sort, setSort] = useState<SortKey>('score');
  const [showPaywall, setShowPaywall] = useState(false);
  const [searchCount, setSearchCount] = useState(0);

  useEffect(() => {
    const raw = params.get('criteria');
    if (raw) {
      try {
        const c: SearchCriteria = JSON.parse(raw);
        setCriteria(c);

        // Try live Zillow data first, fall back to mock
        const fetchListings = async () => {
          try {
            const qs = new URLSearchParams();
            if (c.maxPrice)      qs.set('maxPrice', String(c.maxPrice));
            if (c.minPrice)      qs.set('minPrice', String(c.minPrice));
            if (c.beds?.length)  qs.set('beds', c.beds[0] === '1BR' ? '1' : c.beds[0] === '2BR' ? '2' : c.beds[0] === '3BR+' ? '3' : '0');
            if (c.neighborhoods?.length) qs.set('neighborhoods', c.neighborhoods.join(','));

            const res = await fetch(`/api/listings?${qs.toString()}`);
            const { listings: fetched, source } = await res.json();
            setDataSource(source);
            const scored = scoreAndSort(fetched, c);
            setListings(scored);
          } catch {
            const scored = scoreAndSort(MOCK_LISTINGS, c);
            setListings(scored);
            setDataSource('mock');
          }
        };
        fetchListings();
        setSearchCount(prev => {
          const next = prev + 1;
          if (next > 1) setShowPaywall(true);
          return next;
        });
      } catch { setListings(MOCK_LISTINGS); }
    } else {
      setListings(MOCK_LISTINGS);
    }
  }, [params]);

  function sorted() {
    const l = [...listings];
    if (sort === 'newest')     return l.sort((a,b) => a.daysOnMarket - b.daysOnMarket);
    if (sort === 'price-asc')  return l.sort((a,b) => a.price - b.price);
    if (sort === 'price-desc') return l.sort((a,b) => b.price - a.price);
    return l.sort((a,b) => (b.score ?? 0) - (a.score ?? 0));
  }

  function gatedAction() { setShowPaywall(true); }

  const hoods = Array.from(new Set(listings.map(l => l.neighborhood)));

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0e0c0a; }
        .results-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; }
        @media(max-width:900px) { .results-grid { grid-template-columns: repeat(2,1fr); } }
        @media(max-width:600px) { .results-grid { grid-template-columns: 1fr; } }
        .listing-card { background: #161310; border: 1px solid rgba(240,235,224,0.08); border-radius: 10px; overflow: hidden; transition: border-color 0.2s; }
        .listing-card:hover { border-color: rgba(201,168,76,0.3); }
        .card-img { width: 100%; height: 180px; object-fit: cover; display: block; }
        .card-body { padding: 16px; }
        .card-score { display: inline-block; background: rgba(201,168,76,0.15); color: #c9a84c; font-size: 11px; font-weight: 600; padding: 3px 8px; border-radius: 3px; margin-bottom: 8px; }
        .card-address { font-size: 14px; font-weight: 500; color: #f0ebe0; margin-bottom: 2px; }
        .card-hood { font-size: 12px; color: rgba(240,235,224,0.45); margin-bottom: 10px; }
        .card-price { font-family: 'Cormorant Garamond',Georgia,serif; font-size: 22px; font-weight: 300; color: #f0ebe0; margin-bottom: 6px; }
        .card-meta { font-size: 12px; color: rgba(240,235,224,0.45); margin-bottom: 10px; }
        .card-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 14px; }
        .tag { font-size: 10px; padding: 3px 8px; border-radius: 3px; font-family: Inter,sans-serif; }
        .tag-green { background: rgba(74,222,128,0.12); color: #4ade80; }
        .tag-muted { background: rgba(240,235,224,0.06); color: rgba(240,235,224,0.45); }
        .tag-gold { background: rgba(201,168,76,0.1); color: #c9a84c; }
        .card-actions { display: flex; gap: 8px; }
        .btn-action { flex: 1; padding: 8px; border-radius: 4px; font-size: 11px; font-family: Inter,sans-serif; cursor: pointer; letter-spacing: 0.04em; border: 1px solid rgba(240,235,224,0.15); background: rgba(240,235,224,0.04); color: rgba(240,235,224,0.6); transition: all 0.15s; min-height: 44px; }
        .btn-action:hover { border-color: #c9a84c; color: #c9a84c; }
        .dom-new { color: #4ade80; font-weight: 500; }
        .dom-old { color: rgba(240,235,224,0.35); }
        .results-nav { display: flex; align-items: center; justify-content: space-between; padding: 20px 40px; border-bottom: 1px solid rgba(240,235,224,0.07); }
        .results-h1 { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 36px; font-weight: 300; color: #f0ebe0; margin-bottom: 12px; }
        .results-sort-row { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
        @media (max-width: 768px) {
          .results-nav { padding: 16px 20px; }
          .results-h1 { font-size: 24px; margin-bottom: 10px; }
          .results-sort-row { gap: 6px; }
        }
        @media (max-width: 600px) {
          .card-body { padding: 14px; }
        }
      `}</style>

      {showPaywall && <PaywallModal onClose={() => setShowPaywall(false)} />}

      <div style={{ minHeight: '100vh', background: '#0e0c0a', color: '#f0ebe0', fontFamily: 'Inter, sans-serif' }}>

        {/* Nav */}
        <nav className="results-nav">
          <button onClick={() => router.push('/')} style={{ background: 'none', border: 'none', fontSize: '13px', fontWeight: 500, letterSpacing: '0.18em', color: '#c9a84c', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>Nestwise</button>
          <button onClick={() => router.push('/search')} style={{ background: 'none', border: '1px solid rgba(201,168,76,0.3)', color: 'rgba(240,235,224,0.6)', borderRadius: '4px', fontSize: '12px', padding: '6px 14px', cursor: 'pointer', fontFamily: 'Inter, sans-serif', minHeight: '44px' }}>
            New search
          </button>
        </nav>

        <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '36px 20px 80px' }}>

          {/* Header */}
          <div style={{ marginBottom: '28px' }}>
            <h1 className="results-h1">
              {listings.length} homes match your criteria
            </h1>

            {/* Hood pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
              {hoods.map(h => {
                const count = listings.filter(l => l.neighborhood === h).length;
                return (
                  <span key={h} style={{ border: '1px solid rgba(201,168,76,0.2)', borderRadius: '20px', fontSize: '11px', padding: '4px 12px', color: 'rgba(240,235,224,0.55)' }}>
                    {h} <span style={{ color: '#c9a84c' }}>({count})</span>
                  </span>
                );
              })}
            </div>

            {/* Sort */}
            <div className="results-sort-row">
              <span style={{ fontSize: '11px', color: 'rgba(240,235,224,0.35)', marginRight: '4px' }}>Sort:</span>
              {[
                { key: 'score', label: 'Best match' },
                { key: 'newest', label: 'Newest' },
                { key: 'price-asc', label: 'Price ↑' },
                { key: 'price-desc', label: 'Price ↓' },
              ].map(s => (
                <button key={s.key} onClick={() => setSort(s.key as SortKey)} style={{
                  border: `1px solid ${sort === s.key ? '#c9a84c' : 'rgba(240,235,224,0.15)'}`,
                  background: sort === s.key ? 'rgba(201,168,76,0.1)' : 'transparent',
                  color: sort === s.key ? '#c9a84c' : 'rgba(240,235,224,0.5)',
                  borderRadius: '20px', fontSize: '11px', padding: '4px 12px',
                  cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                }}>{s.label}</button>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div className="results-grid">
            {sorted().map(l => <ListingCard key={l.id} listing={l} onGated={gatedAction} />)}
          </div>
        </div>
      </div>
    </>
  );
}

function ListingCard({ listing, onGated }: { listing: MockListing; onGated: () => void }) {
  const score = listing.score ?? 0;
  const domLabel = listing.daysOnMarket === 0 ? 'New today' : `${listing.daysOnMarket}d ago`;

  return (
    <div className="listing-card">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="card-img" src={listing.img} alt={listing.address} />
      <div className="card-body">
        <div className="card-score">{score}% match</div>
        <div className="card-address">{listing.address}</div>
        <div className="card-hood">{listing.neighborhood}</div>
        <div className="card-price">${listing.price.toLocaleString()}/mo</div>
        <div className="card-meta">
          {listing.beds === 0 ? 'Studio' : `${listing.beds}BR`} · {listing.baths}BA · {listing.sqft.toLocaleString()} sqft ·{' '}
          <span className={listing.daysOnMarket === 0 ? 'dom-new' : 'dom-old'}>{domLabel}</span>
        </div>
        <div className="card-tags">
          {listing.petPolicy === 'dogs_ok' && <span className="tag tag-green">🐕 Pets OK</span>}
          {listing.petPolicy === 'cats_ok' && <span className="tag tag-muted">🐱 Cats OK</span>}
          {listing.petPolicy === 'no_pets' && <span className="tag tag-muted">No pets</span>}
          <span className="tag tag-muted">{listing.laundry === 'in-unit' ? '🧺 In-unit' : 'In-building laundry'}</span>
          <span className="tag tag-gold">{listing.source}</span>
        </div>
        <div className="card-actions">
          <button className="btn-action" onClick={onGated}>♡ Save</button>
          <button className="btn-action" onClick={onGated}>🔔 Alerts</button>
          <button className="btn-action" onClick={() => {
            const url = `${window.location.origin}?ref=SHARE`;
            navigator.clipboard.writeText(url);
            const btn = document.activeElement as HTMLButtonElement;
            const orig = btn.textContent;
            btn.textContent = '✓ Copied';
            setTimeout(() => { btn.textContent = orig; }, 1500);
          }} title="Copy referral link">⧉</button>
        </div>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<div style={{ background: '#0e0c0a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c9a84c', fontFamily: 'Inter, sans-serif' }}>Loading…</div>}>
      <ResultsInner />
    </Suspense>
  );
}
