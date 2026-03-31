import { NEIGHBORHOODS, getNeighborhood } from '@/lib/neighborhoodData';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';

export async function generateStaticParams() {
  return NEIGHBORHOODS.map(n => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const hood = getNeighborhood(params.slug);
  if (!hood) return {};
  return {
    title: `${hood.name} Apartments for Rent SF | Nestwise`,
    description: `Find ${hood.name} apartments in San Francisco before anyone else. Nestwise scans every listing in real time.`,
    openGraph: {
      title: `${hood.name} Apartments for Rent | Nestwise`,
      description: `Browse ${hood.name} rentals in SF — filtered, scored, and surfaced before they hit Zillow.`,
      url: `https://nestwise-sf.vercel.app/neighborhoods/${params.slug}`,
    },
  };
}

const TIER_COLORS: Record<number, { bg: string; color: string; label: string }> = {
  1: { bg: 'rgba(201,168,76,0.12)', color: '#c9a84c', label: 'Tier 1 · Premium' },
  2: { bg: 'rgba(99,179,237,0.1)',  color: '#63b3ed', label: 'Tier 2 · Prime' },
  3: { bg: 'rgba(154,215,163,0.1)', color: '#9ad7a3', label: 'Tier 3 · Value' },
};

const MOCK_CARDS = [
  { beds: 2, baths: 1, price: null, offset: -150, source: 'Chandler Properties' },
  { beds: 1, baths: 1, price: null, offset: 0,    source: 'Craigslist' },
  { beds: 2, baths: 2, price: null, offset: 200,  source: 'ReLISTO' },
];

export default function NeighborhoodPage({ params }: { params: { slug: string } }) {
  const hood = getNeighborhood(params.slug);
  if (!hood) notFound();

  const tier = TIER_COLORS[hood.tier];
  const nearbyHoods = NEIGHBORHOODS.filter(n => hood.nearby.includes(n.slug));

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=Inter:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0e0c0a; }
        .hood-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }
        @media(max-width:700px) { .hood-grid { grid-template-columns: 1fr; } }
      `}</style>
      <div style={{ minHeight: '100vh', background: '#0e0c0a', color: '#f0ebe0', fontFamily: 'Inter, sans-serif' }}>

        {/* Nav */}
        <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 48px', borderBottom: '1px solid rgba(240,235,224,0.07)' }}>
          <Link href="/" style={{ fontSize: '13px', fontWeight: 500, letterSpacing: '0.18em', color: '#c9a84c', textTransform: 'uppercase', textDecoration: 'none' }}>Nestwise</Link>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <Link href="/waitlist" style={{ fontSize: '12px', color: 'rgba(240,235,224,0.45)', textDecoration: 'none' }}>Join waitlist</Link>
            <Link href="/signin" style={{ fontSize: '12px', color: 'rgba(240,235,224,0.45)', textDecoration: 'none' }}>Sign in</Link>
          </div>
        </nav>

        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '56px 24px 80px' }}>

          {/* Breadcrumb */}
          <div style={{ fontSize: '12px', color: 'rgba(240,235,224,0.3)', marginBottom: '20px' }}>
            <Link href="/" style={{ color: 'rgba(240,235,224,0.3)', textDecoration: 'none' }}>Nestwise</Link>
            {' / '}
            <Link href="/search" style={{ color: 'rgba(240,235,224,0.3)', textDecoration: 'none' }}>Neighborhoods</Link>
            {' / '}{hood.name}
          </div>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' }}>
            <div>
              <span style={{ display: 'inline-block', background: tier.bg, color: tier.color, fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '4px 10px', borderRadius: '3px', marginBottom: '12px' }}>
                {tier.label}
              </span>
              <h1 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '52px', fontWeight: 300, color: '#f0ebe0', lineHeight: 1.05, marginBottom: '6px' }}>
                {hood.name}<br />Apartments for Rent
              </h1>
              <div style={{ fontSize: '13px', color: 'rgba(240,235,224,0.4)' }}>San Francisco, CA</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '42px', fontWeight: 300, color: '#c9a84c' }}>
                ${hood.avgRent.toLocaleString()}
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(240,235,224,0.35)' }}>avg. monthly rent</div>
            </div>
          </div>

          {/* Bullets */}
          <div style={{ borderTop: '1px solid rgba(240,235,224,0.07)', borderBottom: '1px solid rgba(240,235,224,0.07)', padding: '28px 0', marginBottom: '40px' }}>
            {hood.bullets.map((b, i) => (
              <div key={i} style={{ display: 'flex', gap: '14px', marginBottom: i < 2 ? '16px' : 0 }}>
                <span style={{ color: '#c9a84c', marginTop: '2px', flexShrink: 0 }}>✦</span>
                <p style={{ fontSize: '15px', color: 'rgba(240,235,224,0.7)', lineHeight: 1.65 }}>{b}</p>
              </div>
            ))}
          </div>

          {/* Mock listings */}
          <div style={{ marginBottom: '48px' }}>
            <div style={{ fontSize: '11px', letterSpacing: '0.1em', color: 'rgba(240,235,224,0.4)', textTransform: 'uppercase', marginBottom: '16px' }}>Current Listings</div>
            <div className="hood-grid">
              {MOCK_CARDS.map((card, i) => (
                <div key={i} style={{ background: '#161310', border: '1px solid rgba(240,235,224,0.08)', borderRadius: '8px', overflow: 'hidden' }}>
                  <div style={{ height: '140px', background: 'linear-gradient(135deg, #2a1f0e, #1a1208)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '18px', color: '#c9a84c', opacity: 0.6 }}>{hood.name}</span>
                  </div>
                  <div style={{ padding: '14px' }}>
                    <div style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '22px', color: '#f0ebe0', marginBottom: '4px' }}>
                      ${(hood.avgRent + card.offset).toLocaleString()}/mo
                    </div>
                    <div style={{ fontSize: '12px', color: 'rgba(240,235,224,0.4)', marginBottom: '10px' }}>
                      {card.beds === 0 ? 'Studio' : `${card.beds}BR`} · {card.baths}BA · {card.source}
                    </div>
                    <Link href={`/search`} style={{
                      display: 'inline-block', fontSize: '11px', color: '#c9a84c',
                      border: '1px solid rgba(201,168,76,0.3)', borderRadius: '3px',
                      padding: '5px 12px', textDecoration: 'none',
                    }}>View listing →</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div style={{ background: 'rgba(201,168,76,0.05)', border: '1px solid rgba(201,168,76,0.15)', borderRadius: '10px', padding: '32px', textAlign: 'center', marginBottom: '56px' }}>
            <div style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '28px', fontWeight: 300, color: '#f0ebe0', marginBottom: '10px' }}>
              See all {hood.name} listings
            </div>
            <div style={{ fontSize: '13px', color: 'rgba(240,235,224,0.5)', marginBottom: '20px' }}>
              Nestwise scans every source in real time — find your match before it disappears.
            </div>
            <Link href={`/search`} style={{
              display: 'inline-block', background: '#c9a84c', color: '#0e0c0a',
              borderRadius: '4px', fontSize: '12px', fontWeight: 500,
              letterSpacing: '0.08em', textTransform: 'uppercase',
              padding: '12px 24px', textDecoration: 'none',
            }}>
              See all {hood.name} listings →
            </Link>
          </div>

          {/* Nearby neighborhoods */}
          <div>
            <div style={{ fontSize: '11px', letterSpacing: '0.1em', color: 'rgba(240,235,224,0.4)', textTransform: 'uppercase', marginBottom: '16px' }}>Explore Nearby</div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {nearbyHoods.map(n => (
                <Link key={n.slug} href={`/neighborhoods/${n.slug}`} style={{
                  border: '1px solid rgba(201,168,76,0.2)', borderRadius: '20px',
                  fontSize: '13px', color: 'rgba(240,235,224,0.6)',
                  padding: '7px 16px', textDecoration: 'none',
                  transition: 'all 0.15s',
                }}>
                  {n.name} · <span style={{ color: '#c9a84c' }}>${n.avgRent.toLocaleString()}/mo avg</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
