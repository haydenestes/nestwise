export interface MockListing {
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
  score?: number;
}

export const MOCK_LISTINGS: MockListing[] = [
  {
    id: 'ml-1',
    address: '2847 Fillmore St, #4',
    neighborhood: 'Pacific Heights',
    price: 4200,
    beds: 2, baths: 1, sqft: 1050,
    petPolicy: 'dogs_ok',
    laundry: 'in-unit',
    source: 'Chandler Properties',
    daysOnMarket: 0,
    img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80',
    link: '#',
  },
  {
    id: 'ml-2',
    address: '3122 Broderick St',
    neighborhood: 'Cow Hollow',
    price: 3750,
    beds: 1, baths: 1, sqft: 780,
    petPolicy: 'dogs_ok',
    laundry: 'in-building',
    source: 'ReLISTO',
    daysOnMarket: 1,
    img: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80',
    link: '#',
  },
  {
    id: 'ml-3',
    address: '1890 Union St, #201',
    neighborhood: 'Marina',
    price: 4850,
    beds: 2, baths: 2, sqft: 1200,
    petPolicy: 'cats_ok',
    laundry: 'in-unit',
    source: 'Zillow',
    daysOnMarket: 2,
    img: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80',
    link: '#',
  },
  {
    id: 'ml-4',
    address: '1045 Green St, #3',
    neighborhood: 'Russian Hill',
    price: 3900,
    beds: 1, baths: 1, sqft: 720,
    petPolicy: 'no_pets',
    laundry: 'in-building',
    source: 'Craigslist',
    daysOnMarket: 3,
    img: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&q=80',
    link: '#',
  },
  {
    id: 'ml-5',
    address: '450 Hayes St, #12',
    neighborhood: 'Hayes Valley',
    price: 3200,
    beds: 1, baths: 1, sqft: 650,
    petPolicy: 'dogs_ok',
    laundry: 'in-unit',
    source: 'J. Wavro',
    daysOnMarket: 0,
    img: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80',
    link: '#',
  },
  {
    id: 'ml-6',
    address: '3850 24th St',
    neighborhood: 'Noe Valley',
    price: 4100,
    beds: 2, baths: 1, sqft: 980,
    petPolicy: 'dogs_ok',
    laundry: 'in-unit',
    source: 'Gaetani Real Estate',
    daysOnMarket: 4,
    img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80',
    link: '#',
  },
  {
    id: 'ml-7',
    address: '2200 Market St, #5B',
    neighborhood: 'Castro',
    price: 2950,
    beds: 0, baths: 1, sqft: 520,
    petPolicy: 'cats_ok',
    laundry: 'in-building',
    source: 'Craigslist',
    daysOnMarket: 5,
    img: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&q=80',
    link: '#',
  },
  {
    id: 'ml-8',
    address: '875 Vermont St, #2',
    neighborhood: 'Potrero Hill',
    price: 3500,
    beds: 1, baths: 1, sqft: 800,
    petPolicy: 'dogs_ok',
    laundry: 'in-unit',
    source: 'ReLISTO',
    daysOnMarket: 1,
    img: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600&q=80',
    link: '#',
  },
];
