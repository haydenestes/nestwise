import { NextResponse } from 'next/server';
import { searchSFRentals } from '@/lib/zillow';
import { MOCK_LISTINGS } from '@/lib/mockListings';

export const maxDuration = 30;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const params = {
    minPrice:      searchParams.get('minPrice')      ? Number(searchParams.get('minPrice'))  : undefined,
    maxPrice:      searchParams.get('maxPrice')      ? Number(searchParams.get('maxPrice'))  : undefined,
    beds:          searchParams.get('beds')          ? Number(searchParams.get('beds'))      : undefined,
    neighborhoods: searchParams.get('neighborhoods') ? searchParams.get('neighborhoods')!.split(',') : undefined,
  };

  // If no API key configured, return mock data
  if (!process.env.RAPIDAPI_ZILLOW_KEY) {
    return NextResponse.json({ listings: MOCK_LISTINGS, source: 'mock' });
  }

  try {
    const listings = await searchSFRentals(params);

    if (listings.length === 0) {
      // Fall back to mock if Zillow returns empty
      return NextResponse.json({ listings: MOCK_LISTINGS, source: 'mock_fallback' });
    }

    return NextResponse.json({ listings, source: 'zillow' });
  } catch (err) {
    console.error('Zillow API error:', err);
    // Always fall back to mock on error — never show empty results
    return NextResponse.json({ listings: MOCK_LISTINGS, source: 'mock_fallback' });
  }
}
