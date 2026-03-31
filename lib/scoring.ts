import { MockListing } from './mockListings';

export interface SearchCriteria {
  neighborhoods: string[];
  minPrice: number;
  maxPrice: number;
  beds: string[]; // 'Studio', '1BR', '2BR', '3BR+'
  pets: boolean;
  laundry: 'in-unit' | 'in-building' | 'either';
  moveIn: 'within-30' | '1-3-months' | 'flexible';
}

export function scoreListing(listing: MockListing, criteria: SearchCriteria): number {
  let score = 0;

  // Neighborhood: 30 pts
  if (criteria.neighborhoods.length === 0 || criteria.neighborhoods.includes(listing.neighborhood)) {
    score += 30;
  }

  // Budget: 25 pts
  if (listing.price >= criteria.minPrice && listing.price <= criteria.maxPrice) {
    score += 25;
    // Bonus for being well under budget
    if (listing.price <= criteria.minPrice + (criteria.maxPrice - criteria.minPrice) * 0.5) {
      score += 5;
    }
  } else if (listing.price > criteria.maxPrice) {
    score -= 10;
  }

  // Bedrooms: 20 pts
  const bedsLabel =
    listing.beds === 0 ? 'Studio' :
    listing.beds === 1 ? '1BR' :
    listing.beds === 2 ? '2BR' : '3BR+';
  if (criteria.beds.length === 0 || criteria.beds.includes(bedsLabel)) {
    score += 20;
  }

  // Pet policy: 15 pts
  if (criteria.pets) {
    if (listing.petPolicy === 'dogs_ok') score += 15;
    else if (listing.petPolicy === 'cats_ok') score += 8;
    else score -= 10;
  } else {
    score += 15; // don't care, full points
  }

  // Laundry: 10 pts
  if (criteria.laundry === 'either') {
    score += 10;
  } else if (criteria.laundry === listing.laundry) {
    score += 10;
  } else if (criteria.laundry === 'in-unit' && listing.laundry === 'in-building') {
    score += 4;
  }

  return Math.max(0, Math.min(100, score));
}

export function scoreAndSort(listings: MockListing[], criteria: SearchCriteria): MockListing[] {
  return listings
    .map(l => ({ ...l, score: scoreListing(l, criteria) }))
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
}
