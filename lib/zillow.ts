/**
 * Zillow Property Data API (APIllow via RapidAPI)
 * Host: zillow-property-data1.p.rapidapi.com
 */

export interface ZillowListing {
  id: string;
  address: string;
  neighborhood: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  petPolicy: 'dogs_ok' | 'no_pets' | 'cats_ok';
  laundry: 'in-unit' | 'in-building' | 'none';
  source: string;
  daysOnMarket: number;
  img: string;
  link: string;
  zpid?: string;
  zestimate?: number;
  score?: number;
}

const API_KEY  = process.env.RAPIDAPI_ZILLOW_KEY!;
const API_HOST = 'zillow-property-data1.p.rapidapi.com';

function headers() {
  return {
    'Content-Type': 'application/json',
    'x-rapidapi-host': API_HOST,
    'x-rapidapi-key': API_KEY,
  };
}

// SF neighborhood → Zillow-compatible search string
const NEIGHBORHOOD_SEARCH: Record<string, string> = {
  'Mission District':     'Mission District, San Francisco, CA',
  'Castro':               'Castro, San Francisco, CA',
  'Noe Valley':           'Noe Valley, San Francisco, CA',
  'Bernal Heights':       'Bernal Heights, San Francisco, CA',
  'Potrero Hill':         'Potrero Hill, San Francisco, CA',
  'SOMA':                 'SoMa, San Francisco, CA',
  'Hayes Valley':         'Hayes Valley, San Francisco, CA',
  'Lower Haight':         'Lower Haight, San Francisco, CA',
  'Haight-Ashbury':       'Haight Ashbury, San Francisco, CA',
  'Inner Sunset':         'Inner Sunset, San Francisco, CA',
  'Outer Sunset':         'Outer Sunset, San Francisco, CA',
  'Inner Richmond':       'Inner Richmond, San Francisco, CA',
  'Outer Richmond':       'Outer Richmond, San Francisco, CA',
  'Pacific Heights':      'Pacific Heights, San Francisco, CA',
  'Cow Hollow':           'Cow Hollow, San Francisco, CA',
  'Marina':               'Marina District, San Francisco, CA',
  'Russian Hill':         'Russian Hill, San Francisco, CA',
  'North Beach':          'North Beach, San Francisco, CA',
  'Chinatown':            'Chinatown, San Francisco, CA',
  'Tenderloin':           'Tenderloin, San Francisco, CA',
  'Western Addition':     'Western Addition, San Francisco, CA',
  'Alamo Square':         'Alamo Square, San Francisco, CA',
  'Excelsior':            'Excelsior, San Francisco, CA',
  'Visitacion Valley':    'Visitacion Valley, San Francisco, CA',
  'Bayview':              'Bayview, San Francisco, CA',
  'Glen Park':            'Glen Park, San Francisco, CA',
  'Diamond Heights':      'Diamond Heights, San Francisco, CA',
  'West Portal':          'West Portal, San Francisco, CA',
};

function normalizeNeighborhood(address: string): string {
  // Try to infer neighborhood from address zip/area — fallback to 'San Francisco'
  return 'San Francisco';
}

function inferPetPolicy(desc: string): ZillowListing['petPolicy'] {
  const d = (desc || '').toLowerCase();
  if (d.includes('no pet') || d.includes('pets not')) return 'no_pets';
  if (d.includes('dog') || d.includes('pet friendly') || d.includes('pets ok')) return 'dogs_ok';
  if (d.includes('cat')) return 'cats_ok';
  return 'no_pets';
}

function inferLaundry(desc: string): ZillowListing['laundry'] {
  const d = (desc || '').toLowerCase();
  if (d.includes('in-unit') || d.includes('in unit') || d.includes('washer') || d.includes('w/d')) return 'in-unit';
  if (d.includes('laundry') || d.includes('coin') || d.includes('shared')) return 'in-building';
  return 'none';
}

function daysOnMarket(listedDate: string | null): number {
  if (!listedDate) return 0;
  const diff = Date.now() - new Date(listedDate).getTime();
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
}

// Map raw Zillow property data → ZillowListing
function mapProperty(raw: Record<string, unknown>): ZillowListing | null {
  try {
    const price = Number(raw.price || raw.listPrice || raw.rentZestimate || 0);
    if (!price || price < 500) return null; // skip non-rentals / bad data

    const desc = String(raw.description || raw.homeDescription || '');
    const address = [raw.streetAddress, raw.city, raw.state, raw.zipcode]
      .filter(Boolean).join(', ') || String(raw.address || '');

    const photos = (raw.photos as string[]) || (raw.imgSrc ? [raw.imgSrc as string] : []);
    const img = photos[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80';

    return {
      id: String(raw.zpid || raw.id || Math.random()),
      zpid: String(raw.zpid || ''),
      address,
      neighborhood: String(raw.neighborhood || normalizeNeighborhood(address)),
      price,
      beds: Number(raw.bedrooms || raw.beds || 0),
      baths: Number(raw.bathrooms || raw.baths || 0),
      sqft: Number(raw.livingArea || raw.sqft || 0),
      petPolicy: inferPetPolicy(desc),
      laundry: inferLaundry(desc),
      source: 'Zillow',
      daysOnMarket: daysOnMarket(raw.datePosted as string || raw.dateSold as string || null),
      img,
      link: raw.url ? String(raw.url) : `https://www.zillow.com/homedetails/${raw.zpid}_zpid/`,
      zestimate: Number(raw.zestimate || 0) || undefined,
    };
  } catch {
    return null;
  }
}

/**
 * Search SF rentals by criteria
 */
export async function searchSFRentals(params: {
  minPrice?: number;
  maxPrice?: number;
  beds?: number;
  neighborhoods?: string[];
}): Promise<ZillowListing[]> {
  if (!API_KEY) throw new Error('RAPIDAPI_ZILLOW_KEY not set');

  const searchLocation = params.neighborhoods?.[0]
    ? (NEIGHBORHOOD_SEARCH[params.neighborhoods[0]] || 'San Francisco, CA')
    : 'San Francisco, CA';

  const body: Record<string, unknown> = {
    location: searchLocation,
    listing_type: 'for_rent',
    home_type: ['Apartments', 'Houses', 'Townhomes', 'Condos'],
    ...(params.minPrice ? { price_min: params.minPrice } : {}),
    ...(params.maxPrice ? { price_max: params.maxPrice } : {}),
    ...(params.beds ? { beds_min: params.beds } : {}),
  };

  const res = await fetch(`https://${API_HOST}/v1/search`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(body),
    next: { revalidate: 3600 }, // cache 1 hour
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Zillow API error ${res.status}: ${text}`);
  }

  const data = await res.json();

  // Handle both array responses and nested results
  const raw: unknown[] = Array.isArray(data)
    ? data
    : (data.results || data.props || data.listings || []);

  return raw
    .map(r => mapProperty(r as Record<string, unknown>))
    .filter((l): l is ZillowListing => l !== null)
    .slice(0, 50); // cap at 50 results
}

/**
 * Get details for a single property by ZPID
 */
export async function getPropertyDetails(zpid: string): Promise<Record<string, unknown> | null> {
  if (!API_KEY) return null;

  const body = { zpid };

  const res = await fetch(`https://${API_HOST}/v1/property`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(body),
    next: { revalidate: 3600 },
  });

  if (!res.ok) return null;
  return res.json();
}
