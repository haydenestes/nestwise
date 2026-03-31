export const SF_NEIGHBORHOODS = [
  // Premium
  { name: "Pacific Heights",       tier: "top",         desc: "Prestige address, stunning views" },
  { name: "Marina",                tier: "top",         desc: "Vibrant, walkable, waterfront" },
  { name: "Cow Hollow",            tier: "top",         desc: "Boutique feel, Union St energy" },
  { name: "Russian Hill",          tier: "top",         desc: "Quiet elegance, city panoramas" },
  { name: "Nob Hill",              tier: "top",         desc: "Classic SF, central location" },
  // Mid-tier
  { name: "Hayes Valley",          tier: "secondary",   desc: "Arts district, great dining" },
  { name: "Noe Valley",            tier: "secondary",   desc: "Village feel, sunny microclimate" },
  { name: "Dolores Heights",       tier: "secondary",   desc: "Views, quiet, desirable" },
  { name: "Duboce Triangle",       tier: "secondary",   desc: "Central, charming, walkable" },
  { name: "Castro",                tier: "secondary",   desc: "Lively, historic, great transit" },
  { name: "Mission District",      tier: "secondary",   desc: "Vibrant culture, great food" },
  { name: "Potrero Hill",          tier: "secondary",   desc: "Sunny, views, up-and-coming" },
  { name: "Glen Park",             tier: "secondary",   desc: "Quiet village feel, BART access" },
  { name: "Bernal Heights",        tier: "secondary",   desc: "Community feel, hilltop views" },
  { name: "Alamo Square",          tier: "secondary",   desc: "Painted Ladies, central park" },
  { name: "NoPa",                  tier: "secondary",   desc: "Hip, walkable, near Panhandle" },
  { name: "Lower Pacific Heights", tier: "secondary",   desc: "Below the hill, great value" },
  // Value / conditional
  { name: "Lower Haight",          tier: "conditional", desc: "Eclectic, value-forward" },
  { name: "Inner Richmond",        tier: "conditional", desc: "Close to parks, quiet streets" },
  { name: "Outer Richmond",        tier: "conditional", desc: "Foggy but affordable, ocean proximity" },
  { name: "Inner Sunset",          tier: "conditional", desc: "Chill, UCSF adjacent, good food" },
  { name: "Outer Sunset",          tier: "conditional", desc: "Quiet, beachy, very affordable" },
  { name: "Cole Valley",           tier: "conditional", desc: "Small, walkable, near UCSF" },
  { name: "Haight-Ashbury",        tier: "conditional", desc: "Historic, colorful, central" },
  { name: "SOMA",                  tier: "conditional", desc: "Urban, tech-centric, convenient" },
  { name: "Mission Bay",           tier: "conditional", desc: "New construction, waterfront" },
  { name: "Dogpatch",              tier: "conditional", desc: "Industrial-chic, up-and-coming" },
  { name: "Excelsior",             tier: "conditional", desc: "Diverse, affordable, family feel" },
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

export const ALERT_TIMES = [
  "7:00 AM", "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM",
  "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM", "10:00 PM",
];

export const SOURCES = [
  "Craigslist", "Chandler Properties", "ReLISTO", "J. Wavro",
  "Gaetani Real Estate", "Anchor Realty", "Zillow", "Redfin",
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
];
