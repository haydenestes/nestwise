export interface NeighborhoodData {
  slug: string;
  name: string;
  tier: 1 | 2 | 3;
  tierLabel: string;
  avgRent: number;
  bullets: string[];
  nearby: string[];
}

export const NEIGHBORHOODS: NeighborhoodData[] = [
  {
    slug: 'marina',
    name: 'Marina',
    tier: 1,
    tierLabel: 'Premium',
    avgRent: 3850,
    bullets: [
      'Walkable waterfront neighborhood with boutique shops and top-rated restaurants along Chestnut and Union Streets',
      'Close proximity to Crissy Field, the Palace of Fine Arts, and direct access to the Bay Trail',
      'Young professional hub with a vibrant social scene and strong demand — listings move fast',
    ],
    nearby: ['cow-hollow', 'pacific-heights', 'russian-hill'],
  },
  {
    slug: 'pacific-heights',
    name: 'Pacific Heights',
    tier: 1,
    tierLabel: 'Premium',
    avgRent: 4000,
    bullets: [
      'One of SF\'s most prestigious addresses with sweeping views of the Bay and Golden Gate Bridge',
      'Grand Victorian and Edwardian architecture alongside quiet, tree-lined streets',
      'Steps from Fillmore Street\'s dining and boutiques — high demand, low turnover',
    ],
    nearby: ['cow-hollow', 'marina', 'russian-hill'],
  },
  {
    slug: 'russian-hill',
    name: 'Russian Hill',
    tier: 1,
    tierLabel: 'Premium',
    avgRent: 3900,
    bullets: [
      'Iconic SF neighborhood known for Lombard Street, stunning city panoramas, and quiet residential streets',
      'Walkable to North Beach, Fisherman\'s Wharf, and the heart of downtown',
      'Mix of classic flats, newer condos, and architectural gems — consistently high demand',
    ],
    nearby: ['nob-hill', 'cow-hollow', 'pacific-heights'],
  },
  {
    slug: 'cow-hollow',
    name: 'Cow Hollow',
    tier: 1,
    tierLabel: 'Premium',
    avgRent: 3700,
    bullets: [
      'Boutique neighborhood nestled between the Marina and Pacific Heights with a distinct village energy',
      'Union Street is the main drag — independent shops, wine bars, and some of the city\'s best brunch spots',
      'Quieter and more residential than the Marina with similar access to the waterfront',
    ],
    nearby: ['marina', 'pacific-heights', 'russian-hill'],
  },
  {
    slug: 'noe-valley',
    name: 'Noe Valley',
    tier: 2,
    tierLabel: 'Prime',
    avgRent: 3250,
    bullets: [
      'Sunny microclimate and village-like feel make it one of SF\'s most livable neighborhoods',
      '24th Street is a beloved local corridor with bakeries, independent bookshops, and coffee roasters',
      'Popular with young families and long-term residents — low turnover means you need to move quickly',
    ],
    nearby: ['castro', 'mission', 'bernal-heights'],
  },
  {
    slug: 'hayes-valley',
    name: 'Hayes Valley',
    tier: 2,
    tierLabel: 'Prime',
    avgRent: 3100,
    bullets: [
      'Arts and culture hub anchored by the SF Symphony and Opera, with some of the city\'s best cocktail bars',
      'Boutique-lined Hayes Street offers independent fashion, design, and food at a high density',
      'Central location with easy access to the Wiggle bike route and multiple MUNI lines',
    ],
    nearby: ['nopa', 'castro', 'soma'],
  },
  {
    slug: 'castro',
    name: 'Castro',
    tier: 2,
    tierLabel: 'Prime',
    avgRent: 3050,
    bullets: [
      'Historic heart of SF\'s LGBTQ+ community with a lively, walkable main street and strong neighborhood identity',
      'Castro Street offers excellent dining, nightlife, and the iconic Castro Theatre',
      'Good transit access via BART and MUNI Metro — popular with renters who want central SF living',
    ],
    nearby: ['noe-valley', 'mission', 'hayes-valley'],
  },
  {
    slug: 'mission',
    name: 'Mission District',
    tier: 2,
    tierLabel: 'Prime',
    avgRent: 3200,
    bullets: [
      'SF\'s cultural melting pot — world-class taquerias, vibrant murals, and one of the city\'s sunniest microclimates',
      'Valencia Street corridor is a walkable strip of restaurants, bookstores, and independent bars',
      'Strong BART access at 16th and 24th Street stations — one of the city\'s most connected neighborhoods',
    ],
    nearby: ['castro', 'bernal-heights', 'soma'],
  },
  {
    slug: 'soma',
    name: 'SOMA',
    tier: 2,
    tierLabel: 'Prime',
    avgRent: 3400,
    bullets: [
      'South of Market is SF\'s urban tech and design district — new construction condos and converted warehouse lofts',
      'Home to the SF Giants\' Oracle Park, the Moscone Center, and proximity to the Financial District',
      'Excellent transit access; walkable to the Embarcadero and Caltrain for Peninsula commuters',
    ],
    nearby: ['mission', 'dogpatch', 'hayes-valley'],
  },
  {
    slug: 'richmond',
    name: 'Inner Richmond',
    tier: 3,
    tierLabel: 'Value',
    avgRent: 2750,
    bullets: [
      'Quiet, residential neighborhood bordering Golden Gate Park with excellent dim sum and international dining on Clement Street',
      'One of SF\'s most affordable neighborhoods near the park — large apartments at comparatively lower rents',
      'Easy access to Ocean Beach and the Presidio for outdoor enthusiasts',
    ],
    nearby: ['pacific-heights', 'cow-hollow', 'marina'],
  },
  {
    slug: 'dogpatch',
    name: 'Dogpatch',
    tier: 3,
    tierLabel: 'Value',
    avgRent: 2900,
    bullets: [
      'Up-and-coming waterfront neighborhood with a growing roster of breweries, galleries, and design studios',
      'New construction housing stock means modern units at lower price points than central SF neighborhoods',
      'T-Third MUNI line connects directly to Caltrain and downtown — growing infrastructure investment',
    ],
    nearby: ['soma', 'mission', 'bernal-heights'],
  },
  {
    slug: 'bernal-heights',
    name: 'Bernal Heights',
    tier: 3,
    tierLabel: 'Value',
    avgRent: 2850,
    bullets: [
      'Beloved community-focused neighborhood centered around Bernal Hill Park with 360° views of the city',
      'Cortland Avenue is a charming local main street with independent restaurants and neighborhood staples',
      'Strong sense of community with a mix of long-term residents and newcomers — relatively affordable for SF',
    ],
    nearby: ['mission', 'noe-valley', 'dogpatch'],
  },
];

export function getNeighborhood(slug: string): NeighborhoodData | undefined {
  return NEIGHBORHOODS.find(n => n.slug === slug);
}
