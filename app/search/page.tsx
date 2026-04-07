'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SearchCriteria } from '@/lib/scoring';

const NEIGHBORHOODS = [
  'Pacific Heights','Marina','Cow Hollow','Russian Hill','Nob Hill',
  'Hayes Valley','Noe Valley','Castro','Mission District','Potrero Hill',
  'Dogpatch','Bernal Heights','SOMA','Inner Richmond','Inner Sunset',
];

const BED_OPTIONS = ['Studio','1BR','2BR','3BR+'];
const MOVE_IN_OPTIONS = [
  { value: 'within-30', label: 'Within 30 days' },
  { value: '1-3-months', label: '1–3 months' },
  { value: 'flexible', label: 'Flexible' },
];

export default function SearchPage() {
  const router = useRouter();
  const [hoods, setHoods]   = useState<string[]>([]);
  const [minPrice, setMin]  = useState(2500);
  const [maxPrice, setMax]  = useState(5500);
  const [beds, setBeds]     = useState<string[]>([]);
  const [pets, setPets]     = useState<boolean | null>(null);
  const [laundry, setLaundry] = useState<'in-unit'|'in-building'|'either'>('either');
  const [moveIn, setMoveIn] = useState<'within-30'|'1-3-months'|'flexible'>('flexible');

  function toggleHood(h: string) {
    setHoods(prev => prev.includes(h) ? prev.filter(x => x !== h) : [...prev, h]);
  }
  function toggleBed(b: string) {
    setBeds(prev => prev.includes(b) ? prev.filter(x => x !== b) : [...prev, b]);
  }

  function handleSearch() {
    const criteria: SearchCriteria = {
      neighborhoods: hoods,
      minPrice,
      maxPrice,
      beds,
      pets: pets ?? false,
      laundry,
      moveIn,
    };
    const params = new URLSearchParams({ criteria: JSON.stringify(criteria) });
    router.push(`/results?${params.toString()}`);
  }

  const pill = (label: string, active: boolean, onClick: () => void) => (
    <button key={label} onClick={onClick} style={{
      border: `1px solid ${active ? '#c9a84c' : 'rgba(201,168,76,0.25)'}`,
      background: active ? 'rgba(201,168,76,0.1)' : 'transparent',
      color: active ? '#c9a84c' : 'rgba(240,235,224,0.55)',
      borderRadius: '20px', fontSize: '12px', padding: '6px 14px',
      cursor: 'pointer', fontFamily: 'Inter, sans-serif',
      transition: 'all 0.15s',
    }}>{label}</button>
  );

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0e0c0a; }
        input[type=range] { accent-color: #c9a84c; }
        .search-nav { display: flex; align-items: center; justify-content: space-between; padding: 24px 48px; border-bottom: 1px solid rgba(240,235,224,0.07); }
        .search-container { max-width: 680px; margin: 0 auto; padding: 48px 24px 0; }
        .search-h1 { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 42px; font-weight: 300; color: #f0ebe0; margin-bottom: 8px; }
        .search-budget-row { display: flex; gap: 16px; align-items: center; }
        .search-cta { width: 100%; background: #c9a84c; color: #0e0c0a; border: none; border-radius: 4px; font-size: 13px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; padding: 16px; cursor: pointer; font-family: Inter, sans-serif; min-height: 48px; }
        @media (max-width: 768px) {
          .search-nav { padding: 20px 20px; }
          .search-container { padding: 32px 20px 0; }
          .search-h1 { font-size: 28px; }
          .search-budget-row { flex-direction: column; gap: 12px; }
          .search-budget-row > div { width: 100%; }
        }
      `}</style>
      <div style={{ minHeight: '100vh', background: '#0e0c0a', color: '#f0ebe0', fontFamily: 'Inter, sans-serif', padding: '0 0 80px' }}>

        {/* Nav */}
        <nav className="search-nav">
          <button onClick={() => router.push('/')} style={{ background: 'none', border: 'none', fontSize: '13px', fontWeight: 500, letterSpacing: '0.18em', color: '#c9a84c', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>Nestwise</button>
        </nav>

        <div className="search-container">
          <div style={{ fontSize: '10px', letterSpacing: '0.22em', color: '#c9a84c', textTransform: 'uppercase', marginBottom: '12px' }}>Your Search</div>
          <h1 className="search-h1">
            Tell us what you need.
          </h1>
          <p style={{ fontSize: '14px', color: 'rgba(240,235,224,0.5)', marginBottom: '40px', lineHeight: 1.6 }}>
            Every detail sharpens your results. The more you tell us, the better your matches.
          </p>

          {/* Neighborhoods */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ fontSize: '11px', letterSpacing: '0.08em', color: 'rgba(240,235,224,0.5)', textTransform: 'uppercase', marginBottom: '12px' }}>Neighborhoods</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {NEIGHBORHOODS.map(h => pill(h, hoods.includes(h), () => toggleHood(h)))}
            </div>
          </div>

          {/* Budget */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ fontSize: '11px', letterSpacing: '0.08em', color: 'rgba(240,235,224,0.5)', textTransform: 'uppercase', marginBottom: '12px' }}>
              Monthly Budget — <span style={{ color: '#c9a84c' }}>${minPrice.toLocaleString()} – ${maxPrice.toLocaleString()}</span>
            </div>
            <div className="search-budget-row">
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '11px', color: 'rgba(240,235,224,0.35)', marginBottom: '6px' }}>Min</div>
                <input type="range" min={1500} max={7000} step={100} value={minPrice}
                  onChange={e => setMin(Math.min(Number(e.target.value), maxPrice - 500))}
                  style={{ width: '100%' }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '11px', color: 'rgba(240,235,224,0.35)', marginBottom: '6px' }}>Max</div>
                <input type="range" min={1500} max={8000} step={100} value={maxPrice}
                  onChange={e => setMax(Math.max(Number(e.target.value), minPrice + 500))}
                  style={{ width: '100%' }} />
              </div>
            </div>
          </div>

          {/* Bedrooms */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ fontSize: '11px', letterSpacing: '0.08em', color: 'rgba(240,235,224,0.5)', textTransform: 'uppercase', marginBottom: '12px' }}>Bedrooms</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {BED_OPTIONS.map(b => pill(b, beds.includes(b), () => toggleBed(b)))}
            </div>
          </div>

          {/* Pets */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ fontSize: '11px', letterSpacing: '0.08em', color: 'rgba(240,235,224,0.5)', textTransform: 'uppercase', marginBottom: '12px' }}>Pets</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {pill('🐾 Yes, I have pets', pets === true, () => setPets(true))}
              {pill('No pets', pets === false, () => setPets(false))}
            </div>
          </div>

          {/* Laundry */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ fontSize: '11px', letterSpacing: '0.08em', color: 'rgba(240,235,224,0.5)', textTransform: 'uppercase', marginBottom: '12px' }}>Laundry</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {pill('In-unit', laundry === 'in-unit', () => setLaundry('in-unit'))}
              {pill('In-building', laundry === 'in-building', () => setLaundry('in-building'))}
              {pill('Either', laundry === 'either', () => setLaundry('either'))}
            </div>
          </div>

          {/* Move-in */}
          <div style={{ marginBottom: '48px' }}>
            <div style={{ fontSize: '11px', letterSpacing: '0.08em', color: 'rgba(240,235,224,0.5)', textTransform: 'uppercase', marginBottom: '12px' }}>Move-in Timeline</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {MOVE_IN_OPTIONS.map(o => pill(o.label, moveIn === o.value, () => setMoveIn(o.value as typeof moveIn)))}
            </div>
          </div>

          {/* CTA */}
          <button onClick={handleSearch} className="search-cta">
            Find my home →
          </button>
        </div>
      </div>
    </>
  );
}
