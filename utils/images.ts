import { TravelImage, Place } from '@/types';
import fs from 'fs';
import path from 'path';

const IMAGES_DIR = path.join(process.cwd(), 'images');
const METADATA_FILE = path.join(IMAGES_DIR, 'metadata.json');

export function getImageMetadata(): TravelImage[] {
  try {
    if (!fs.existsSync(METADATA_FILE)) {
      return [];
    }
    const fileContent = fs.readFileSync(METADATA_FILE, 'utf-8');
    return JSON.parse(fileContent) as TravelImage[];
  } catch (error) {
    console.error('Error reading image metadata:', error);
    return [];
  }
}

export function getPlacesByLocation(): Place[] {
  const images = getImageMetadata();
  const placeMap = new Map<string, Place>();

  images.forEach((image) => {
    // For Iran: use country-state as key
    // For others: use country-city as key (or just country if no city)
    let key: string;
    if (image.country === 'Iran' && image.state) {
      key = `${image.country}-${image.state}`;
    } else if (image.country !== 'Iran' && image.city) {
      key = `${image.country}-${image.city}`;
    } else {
      key = image.country;
    }

    if (!placeMap.has(key)) {
      placeMap.set(key, {
        country: image.country,
        state: image.state,
        city: image.city,
        images: [],
        hasImages: true,
      });
    }

    placeMap.get(key)!.images.push(image);
  });

  return Array.from(placeMap.values()).sort((a, b) => {
    if (a.country !== b.country) {
      return a.country.localeCompare(b.country);
    }
    // For Iran, sort by state
    if (a.country === 'Iran') {
      return (a.state || '').localeCompare(b.state || '');
    }
    // For others, sort by city
    return (a.city || '').localeCompare(b.city || '');
  });
}

// Image path helper - images should be in public/images/
export function getImagePath(filename: string): string {
  return `/images/${filename}`;
}

