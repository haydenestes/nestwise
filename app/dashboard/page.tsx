'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Nav from '@/components/Nav';
import { useApp } from '@/lib/context';
import { scoreColor, petTag } from '@/lib/utils';
import { MOCK_LISTINGS, SOURCES } from '@/lib/data';

export default function DashboardPage() {
  const router = useRouter();
  const { user, hoods, minRent, maxRent, beds } = useApp();

  const strongCandidates = MOCK_LISTINGS.filter((l) => l.score >= 85);
  const worthWatching = MOCK_LISTINGS.filter((l) => l.score >= 70 && l.score < 85);
  const needsVerification = MOCK_LISTINGS.filter((l) => l.score < 70);

  const userName = user?.name ?? 'there';

  return (
    <div className="dashboard">
      <Nav />

      {/* Header */}
      <div className="dash-header">
        <div>
          <div className="dash-greeting">Good morning, {userName}.</div>
          <div className="dash-sub">
            Scanning {hoods.length} neighborhoods &middot; $
            {minRent.toLocaleString()}–${maxRent.toLocaleString()} &middot;{' '}
            {beds.join(', ') || 'Any size'}
          </div>
        </div>
        <div className="dash-kpis">
          <div className="kpi">
            <div className="kpi-num">{MOCK_LISTINGS.length}</div>
            <div className="kpi-label">New Matches</div>
          </div>
          <div className="kpi">
            <div className="kpi-num">{strongCandidates.length}</div>
            <div className="kpi-label">Strong Fits</div>
          </div>
          <div className="kpi">
            <div className="kpi-num">10</div>
            <div className="kpi-label">Sources Live</div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="dash-body">

        {/* Strong Candidates */}
        {strongCandidates.length > 0 && (
          <div className="dash-section">
            <div className="dash-section-header">
              <div className="dash-section-title">Strong Candidates</div>
              <span className="section-badge badge-hot">
                🔥 Act fast — high demand
              </span>
            </div>
            <div className="listing-grid">
              {strongCandidates.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </div>
        )}

        {/* Worth Watching */}
        {worthWatching.length > 0 && (
          <div className="dash-section">
            <div className="dash-section-header">
              <div className="dash-section-title">Worth Watching</div>
              <span className="section-badge badge-watch">
                ◆ Monitor closely
              </span>
            </div>
            <div className="listing-grid">
              {worthWatching.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </div>
        )}

        {/* Needs Verification */}
        {needsVerification.length > 0 && (
          <div className="dash-section">
            <div className="dash-section-header">
              <div className="dash-section-title">Needs Verification</div>
              <span className="section-badge badge-verify">
                ✎ Confirm details
              </span>
            </div>
            <div className="verify-list">
              {needsVerification.map((listing) => (
                <div key={listing.id} className="verify-row">
                  <div style={{ flex: 1 }}>
                    <div className="verify-address">{listing.address}</div>
                    <div className="verify-detail">
                      {listing.neighborhood} &middot; $
                      {listing.rent.toLocaleString()}/mo &middot;{' '}
                      {listing.beds}BR/{listing.baths}BA
                    </div>
                  </div>
                  <span className="verify-flag">{listing.highlight.slice(0, 48)}…</span>
                  <button className="verify-action">Review</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Edit criteria prompt */}
        <div style={{ marginTop: '8px', marginBottom: '32px', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            className="btn-primary"
            style={{ fontSize: '12px', padding: '12px 28px' }}
            onClick={() => router.push('/criteria')}
          >
            Edit Criteria
          </button>
        </div>

        {/* Sources bar */}
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

interface Listing {
  id: number;
  address: string;
  neighborhood: string;
  rent: number;
  beds: number;
  baths: number;
  sqft: number;
  petPolicy: string;
  parking: boolean;
  laundry: string;
  outdoor: string | null;
  available: string;
  source: string;
  score: number;
  freshness: string;
  urgency: string;
  highlight: string;
  img: string;
}

function ListingCard({ listing }: { listing: Listing }) {
  return (
    <div className="listing-card">
      <Image
        src={listing.img}
        alt={listing.address}
        width={700}
        height={192}
        style={{ objectFit: 'cover', width: '100%', height: '192px' }}
        className="listing-img"
      />
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
          <span>{listing.beds}BR / {listing.baths}BA</span>
          <span>{listing.sqft.toLocaleString()} sqft</span>
          <span>Avail {listing.available}</span>
        </div>

        <div className="listing-tags">
          {petTag(listing.petPolicy)}
          {listing.parking && (
            <span className="tag tag-default">Parking</span>
          )}
          {listing.laundry === 'In-unit' && (
            <span className="tag tag-green">In-unit laundry</span>
          )}
          {listing.laundry === 'In-building' && (
            <span className="tag tag-default">In-bldg laundry</span>
          )}
          {listing.outdoor && (
            <span className="tag tag-default">{listing.outdoor}</span>
          )}
          <span className="tag tag-default">{listing.source}</span>
        </div>

        <div className="listing-highlight">{listing.highlight}</div>

        <div className="listing-footer">
          <div className="listing-freshness">
            <div
              className={`urgency-pip pip-${listing.urgency}`}
            />
            {listing.freshness}
          </div>
          <button className="listing-btn">View Listing</button>
        </div>
      </div>
    </div>
  );
}
