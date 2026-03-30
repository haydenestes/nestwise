'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Nav from '@/components/Nav';
import { useApp } from '@/lib/context';
import { scoreColor, petTag } from '@/lib/utils';
import { SOURCES } from '@/lib/data';

interface LiveListing {
  id: string;
  source: string;
  title: string;
  address: string;
  neighborhood: string;
  rent: number;
  beds: number;
  link: string;
  pet_policy: string;
  parking: boolean;
  laundry: string;
  outdoor: boolean;
  score: number;
  score_notes: string[];
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, hoods, minRent, maxRent, beds } = useApp();
  const [listings, setListings] = useState<LiveListing[]>([]);
  const [updatedAt, setUpdatedAt] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/listings.json')
      .then((r) => r.json())
      .then((data) => {
        setListings(data.listings || []);
        setUpdatedAt(data.updated || '');
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const strong   = listings.filter((l) => l.score >= 80);
  const moderate = listings.filter((l) => l.score >= 50 && l.score < 80);
  const low      = listings.filter((l) => l.score < 50);
  const userName = user?.name ?? 'there';

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  function formatUpdated(iso: string) {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', timeZoneName: 'short' });
  }

  return (
    <div className="dashboard">
      <Nav />

      <div className="dash-header">
        <div>
          <div className="dash-greeting">{greeting}, {userName}.</div>
          <div className="dash-sub">
            Scanning {hoods.length} neighborhoods &middot; $
            {minRent.toLocaleString()}–${maxRent.toLocaleString()} &middot;{' '}
            {beds.join(', ') || 'Any size'}
            {updatedAt && (
              <span style={{ marginLeft: '12px', opacity: 0.6 }}>
                · Updated {formatUpdated(updatedAt)}
              </span>
            )}
          </div>
        </div>
        <div className="dash-kpis">
          <div className="kpi">
            <div className="kpi-num">{loading ? '—' : listings.length}</div>
            <div className="kpi-label">Listings</div>
          </div>
          <div className="kpi">
            <div className="kpi-num">{loading ? '—' : strong.length}</div>
            <div className="kpi-label">Strong Fits</div>
          </div>
          <div className="kpi">
            <div className="kpi-num">5</div>
            <div className="kpi-label">Sources Live</div>
          </div>
        </div>
      </div>

      <div className="dash-body">

        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted, #888)', fontStyle: 'italic' }}>
            Loading listings…
          </div>
        )}

        {!loading && listings.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted, #888)', fontStyle: 'italic' }}>
            No listings available yet — check back after the next scan.
          </div>
        )}

        {strong.length > 0 && (
          <div className="dash-section">
            <div className="dash-section-header">
              <div className="dash-section-title">Strong Candidates</div>
              <span className="section-badge badge-hot">🔥 Act fast — high demand</span>
            </div>
            <div className="listing-grid">
              {strong.map((l) => <ListingCard key={l.id} listing={l} />)}
            </div>
          </div>
        )}

        {moderate.length > 0 && (
          <div className="dash-section">
            <div className="dash-section-header">
              <div className="dash-section-title">Worth Watching</div>
              <span className="section-badge badge-watch">◆ Monitor closely</span>
            </div>
            <div className="listing-grid">
              {moderate.map((l) => <ListingCard key={l.id} listing={l} />)}
            </div>
          </div>
        )}

        {low.length > 0 && (
          <div className="dash-section">
            <div className="dash-section-header">
              <div className="dash-section-title">Needs Verification</div>
              <span className="section-badge badge-verify">✎ Confirm details</span>
            </div>
            <div className="verify-list">
              {low.map((l) => (
                <div key={l.id} className="verify-row">
                  <div style={{ flex: 1 }}>
                    <div className="verify-address">{l.address}</div>
                    <div className="verify-detail">
                      {l.neighborhood} · ${l.rent.toLocaleString()}/mo · {l.beds}BR
                    </div>
                  </div>
                  <span className="verify-flag">{l.score_notes.slice(0, 2).join(', ')}</span>
                  <a href={l.link} target="_blank" rel="noreferrer">
                    <button className="verify-action">Review</button>
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginTop: '8px', marginBottom: '32px', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            className="btn-primary"
            style={{ fontSize: '12px', padding: '12px 28px' }}
            onClick={() => router.push('/criteria')}
          >
            Edit Criteria
          </button>
        </div>

        <div className="sources-bar">
          <span className="sources-label">Sources</span>
          {SOURCES.map((src) => (
            <span key={src} className="source-chip">{src}</span>
          ))}
        </div>

      </div>
    </div>
  );
}

function ListingCard({ listing }: { listing: LiveListing }) {
  const petPolicy = listing.pet_policy === 'dogs_ok' ? 'dogs_ok'
                  : listing.pet_policy === 'no_pets' ? 'no_pets'
                  : 'unknown';

  return (
    <div className="listing-card">
      {/* No image from scraper — show neighborhood placeholder */}
      <div className="listing-img" style={{
        background: 'linear-gradient(135deg, #2a1f0e 0%, #4a3520 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '160px', flexShrink: 0,
      }}>
        <div style={{ textAlign: 'center', color: '#c8a96e', fontFamily: 'Cormorant Garamond, Georgia, serif' }}>
          <div style={{ fontSize: '22px', fontWeight: 600 }}>{listing.neighborhood}</div>
          <div style={{ fontSize: '13px', opacity: 0.7, marginTop: '4px' }}>{listing.source}</div>
        </div>
      </div>

      <div className="listing-body">
        <div className="listing-top">
          <div>
            <div className="listing-address">{listing.address}</div>
            <div className="listing-hood">{listing.neighborhood}</div>
          </div>
          <div className={`score-ring ${scoreColor(listing.score)}`}>
            {listing.score}
          </div>
        </div>

        <div className="listing-rent">${listing.rent.toLocaleString()}/mo</div>
        <div className="listing-meta">
          <span>{listing.beds > 0 ? `${listing.beds}BR` : 'Studio'}</span>
          <span>{listing.source}</span>
        </div>

        <div className="listing-tags">
          {petTag(petPolicy)}
          {listing.parking && <span className="tag tag-default">Parking</span>}
          {listing.laundry === 'in-unit' && <span className="tag tag-green">In-unit W/D</span>}
          {listing.outdoor && <span className="tag tag-default">Outdoor space</span>}
        </div>

        <div className="listing-highlight">{listing.score_notes.join(' · ')}</div>

        <div className="listing-footer">
          <div className="listing-freshness">
            <div className="urgency-pip pip-medium" />
            {listing.source}
          </div>
          <a href={listing.link} target="_blank" rel="noreferrer">
            <button className="listing-btn">View Listing</button>
          </a>
        </div>
      </div>
    </div>
  );
}
