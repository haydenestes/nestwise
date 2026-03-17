export const SF_NEIGHBORHOODS = [
  { name: "Pacific Heights", tier: "top", desc: "Prestige address, stunning views" },
  { name: "Marina", tier: "top", desc: "Vibrant, walkable, waterfront" },
  { name: "Cow Hollow", tier: "top", desc: "Boutique feel, Union St energy" },
  { name: "Russian Hill", tier: "top", desc: "Quiet elegance, city panoramas" },
  { name: "Nob Hill", tier: "secondary", desc: "Classic SF, central location" },
  { name: "Hayes Valley", tier: "secondary", desc: "Arts district, great dining" },
  { name: "Noe Valley", tier: "secondary", desc: "Village feel, sunny microclimate" },
  { name: "Lower Haight", tier: "secondary", desc: "Eclectic, value-forward" },
  { name: "Inner Richmond", tier: "conditional", desc: "Conditional — close to Pac Heights" },
  { name: "Dolores Heights", tier: "secondary", desc: "Views, quiet, desirable" },
];

export const UNIT_TYPES = ["Studio", "1 Bedroom", "2 Bedrooms", "3+ Bedrooms"];

export const PET_OPTIONS = [
  { id: "required", label: "Dog-friendly required", icon: "🐕" },
  { id: "preferred", label: "Strongly prefer it", icon: "🐾" },
  { id: "flexible", label: "Flexible / no pets", icon: "—" },
];

export const AMENITIES = [
  "In-unit laundry", "Parking", "Outdoor space", "Dishwasher",
  "Gym", "Concierge / doorman", "Rooftop deck", "EV charging",
  "Storage", "Bike room",
];

export const ALERT_TIMES = ["10:00 AM", "2:00 PM", "6:00 PM"];

export const SOURCES = [
  "Zillow", "Craigslist", "Apartments.com", "Zumper", "HotPads",
  "Chandler Properties", "Relisto", "J. Wavro", "Structure Properties", "WCPM",
];

export const MOCK_LISTINGS = [
  {
    id: 1,
    address: "2847 Fillmore St, Unit 4",
    neighborhood: "Pacific Heights",
    rent: 4200,
    beds: 2, baths: 1, sqft: 1050,
    petPolicy: "dogs_ok",
    parking: true, laundry: "In-unit", outdoor: "Private deck",
    available: "April 1, 2026",
    source: "Chandler Properties",
    score: 94, freshness: "2h ago", urgency: "high",
    highlight: "2BR in prime Pac Heights — dog-friendly, just listed directly on PM site before Zillow.",
    img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=700&q=80",
  },
  {
    id: 2,
    address: "3122 Broderick St",
    neighborhood: "Cow Hollow",
    rent: 3750,
    beds: 1, baths: 1, sqft: 780,
    petPolicy: "dogs_ok",
    parking: false, laundry: "In-building", outdoor: "Shared garden",
    available: "March 15, 2026",
    source: "Relisto",
    score: 87, freshness: "5h ago", urgency: "high",
    highlight: "Under budget, Cow Hollow 1BR. Pet-friendly with garden access. Strong early find.",
    img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=700&q=80",
  },
  {
    id: 3,
    address: "1890 Union St, #201",
    neighborhood: "Marina",
    rent: 4850,
    beds: 2, baths: 2, sqft: 1200,
    petPolicy: "verify",
    parking: true, laundry: "In-unit", outdoor: "Juliet balcony",
    available: "April 15, 2026",
    source: "Zillow",
    score: 82, freshness: "1d ago", urgency: "medium",
    highlight: "2BR/2BA Marina — great layout, in-unit laundry. Pet policy needs a quick call to confirm.",
    img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=700&q=80",
  },
  {
    id: 4,
    address: "1045 Green St, #3",
    neighborhood: "Russian Hill",
    rent: 5200,
    beds: 2, baths: 1, sqft: 990,
    petPolicy: "no_pets",
    parking: false, laundry: "In-building", outdoor: null,
    available: "May 1, 2026",
    source: "Apartments.com",
    score: 61, freshness: "3d ago", urgency: "low",
    highlight: "Great Russian Hill address. Docked for no-pet policy and no outdoor space.",
    img: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=700&q=80",
  },
];
