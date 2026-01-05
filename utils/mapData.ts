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

// Province name mapping - maps GeoJSON province names to our internal names
export const iranProvinceNameMap: Record<string, string> = {
  'Tehran': 'Tehran',
  'Tehrān': 'Tehran',
  'Isfahan': 'Isfahan',
  'Esfahan': 'Isfahan',
  'Eşfahān': 'Isfahan',
  'Fars': 'Fars',
  'Fārs': 'Fars',
  'Khuzestan': 'Khuzestan',
  'Khūzestān': 'Khuzestan',
  'East Azerbaijan': 'East Azerbaijan',
  'Āz̄arbāyjān-e Sharqī': 'East Azerbaijan',
  'West Azerbaijan': 'West Azerbaijan',
  'Āz̄arbāyjān-e Gharbī': 'West Azerbaijan',
  'Kerman': 'Kerman',
  'Kermān': 'Kerman',
  'Sistan and Baluchestan': 'Sistan and Baluchestan',
  'Sīstān va Balūchestān': 'Sistan and Baluchestan',
  'Khorasan Razavi': 'Khorasan Razavi',
  'Khorāsān-e Raẕavī': 'Khorasan Razavi',
  'Mazandaran': 'Mazandaran',
  'Māzandarān': 'Mazandaran',
  'Gilan': 'Gilan',
  'Gīlān': 'Gilan',
  'Golestan': 'Golestan',
  'Golestān': 'Golestan',
  'Kurdistan': 'Kurdistan',
  'Kordestān': 'Kurdistan',
  'Lorestan': 'Lorestan',
  'Lorestān': 'Lorestan',
  'Hormozgan': 'Hormozgan',
  'Hormozgān': 'Hormozgan',
  'Bushehr': 'Bushehr',
  'Būshehr': 'Bushehr',
  'Chaharmahal and Bakhtiari': 'Chaharmahal and Bakhtiari',
  'Chahār Maḩāl va Bakhtīārī': 'Chaharmahal and Bakhtiari',
  'Kohgiluyeh and Boyer-Ahmad': 'Kohgiluyeh and Boyer-Ahmad',
  'Kohgīlūyeh va Bowyer Aḩmad': 'Kohgiluyeh and Boyer-Ahmad',
  'Yazd': 'Yazd',
  'Qom': 'Qom',
  'Qazvin': 'Qazvin',
  'Qazvīn': 'Qazvin',
  'Zanjan': 'Zanjan',
  'Zanjān': 'Zanjan',
  'Ardabil': 'Ardabil',
  'Ardabīl': 'Ardabil',
  'Semnan': 'Semnan',
  'Semnān': 'Semnan',
  'Markazi': 'Markazi',
  'Markazī': 'Markazi',
  'Hamadan': 'Hamadan',
  'Hamadān': 'Hamadan',
  'Kermanshah': 'Kermanshah',
  'Kermānshāh': 'Kermanshah',
  'Ilam': 'Ilam',
  'Īlām': 'Ilam',
  'North Khorasan': 'North Khorasan',
  'Khorāsān-e Shomālī': 'North Khorasan',
  'South Khorasan': 'South Khorasan',
  'Khorāsān-e Jonūbī': 'South Khorasan',
  'Alborz': 'Alborz',
  'Alborz Province': 'Alborz'
};

export function normalizeProvinceName(province: string): string {
  if (!province) return '';
  const trimmed = province.trim();
  return iranProvinceNameMap[trimmed] || trimmed;
}

export function provincesMatch(mapProvince: string, userProvince: string): boolean {
  if (!mapProvince || !userProvince) return false;

  const mapLower = mapProvince.trim().toLowerCase();
  const userLower = userProvince.trim().toLowerCase();

  // Exact match
  if (mapLower === userLower) return true;

  // Normalize both and check
  const normalizedMap = normalizeProvinceName(mapProvince).toLowerCase();
  const normalizedUser = normalizeProvinceName(userProvince).toLowerCase();

  if (normalizedMap === normalizedUser) return true;

  // Check if one contains the other
  if (normalizedMap.includes(normalizedUser) || normalizedUser.includes(normalizedMap)) {
    return true;
  }

  // Also check original strings
  if (mapLower.includes(userLower) || userLower.includes(mapLower)) {
    return true;
  }

  return false;
}

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
