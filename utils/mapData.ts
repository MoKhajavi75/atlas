import { type Place } from '@/types';

// Country name normalization - maps map data names to user-friendly names
export const countryNameMap: Record<string, string> = {
  'United States of America': 'United States',
  'United States': 'United States',
  'USA': 'United States',
  'United Kingdom': 'United Kingdom',
  'UK': 'United Kingdom',
  'Russian Federation': 'Russia',
  'Russia': 'Russia',
  'Iran': 'Iran',
  'France': 'France',
  'Japan': 'Japan',
  'Germany': 'Germany',
  'Italy': 'Italy',
  'Spain': 'Spain',
  'Canada': 'Canada',
  'Australia': 'Australia',
  'China': 'China',
  'India': 'India',
  'Brazil': 'Brazil',
  'Mexico': 'Mexico',
  'Turkey': 'Turkey',
  'Egypt': 'Egypt',
  'South Africa': 'South Africa',
  'Argentina': 'Argentina',
  'Chile': 'Chile',
  'Peru': 'Peru',
  'Colombia': 'Colombia',
  'Thailand': 'Thailand',
  'Vietnam': 'Vietnam',
  'Indonesia': 'Indonesia',
  'Philippines': 'Philippines',
  'South Korea': 'South Korea',
  'New Zealand': 'New Zealand',
  'Greece': 'Greece',
  'Portugal': 'Portugal',
  'Netherlands': 'Netherlands',
  'Belgium': 'Belgium',
  'Switzerland': 'Switzerland',
  'Austria': 'Austria',
  'Poland': 'Poland',
  'Czech Republic': 'Czech Republic',
  'Hungary': 'Hungary',
  'Sweden': 'Sweden',
  'Norway': 'Norway',
  'Denmark': 'Denmark',
  'Finland': 'Finland',
  'Ireland': 'Ireland'
};

// Iran provinces/states (simplified list - you can expand this)
export const iranProvinces = [
  'Tehran',
  'Isfahan',
  'Fars',
  'Khuzestan',
  'East Azerbaijan',
  'West Azerbaijan',
  'Kerman',
  'Sistan and Baluchestan',
  'Khorasan Razavi',
  'Mazandaran',
  'Gilan',
  'Golestan',
  'Kurdistan',
  'Lorestan',
  'Hormozgan',
  'Bushehr',
  'Chaharmahal and Bakhtiari',
  'Kohgiluyeh and Boyer-Ahmad',
  'Yazd',
  'Qom',
  'Qazvin',
  'Zanjan',
  'Ardabil',
  'Semnan',
  'Markazi',
  'Hamadan',
  'Kermanshah',
  'Ilam',
  'North Khorasan',
  'South Khorasan',
  'Alborz'
];

export function normalizeCountryName(country: string): string {
  if (!country) return '';
  const trimmed = country.trim();
  return countryNameMap[trimmed] || trimmed;
}

// More flexible matching - checks if country names match (case-insensitive, handles variations)
export function countriesMatch(mapCountry: string, userCountry: string): boolean {
  if (!mapCountry || !userCountry) return false;

  const mapLower = mapCountry.trim().toLowerCase();
  const userLower = userCountry.trim().toLowerCase();

  // Exact match
  if (mapLower === userLower) return true;

  // Normalize both and check
  const normalizedMap = normalizeCountryName(mapCountry).toLowerCase();
  const normalizedUser = normalizeCountryName(userCountry).toLowerCase();

  if (normalizedMap === normalizedUser) return true;

  // Check if one contains the other (for cases like "United States" vs "United States of America")
  if (normalizedMap.includes(normalizedUser) || normalizedUser.includes(normalizedMap)) {
    return true;
  }

  // Also check original strings
  if (mapLower.includes(userLower) || userLower.includes(mapLower)) {
    return true;
  }

  return false;
}

export function getCountryHasImages(mapCountryName: string, places: Place[]): boolean {
  const isIran = countriesMatch(mapCountryName, 'Iran');

  // For Iran, check if there are any images (including states)
  if (isIran) {
    return places.some(p => p.country === 'Iran');
  }

  // For other countries, check if there are any places for that country
  // (regardless of city, since we group by city now)
  return places.some(p => {
    // Skip Iran places
    if (p.country === 'Iran') return false;
    // Check if country matches
    return countriesMatch(mapCountryName, p.country);
  });
}

export function getIranStateHasImages(state: string, places: Place[]): boolean {
  return places.some(p => p.country === 'Iran' && p.state === state);
}

export function getIranStatesWithImages(places: Place[]): Set<string> {
  const states = new Set<string>();
  places.forEach(p => {
    if (p.country === 'Iran' && p.state) {
      states.add(p.state);
    }
  });
  return states;
}
