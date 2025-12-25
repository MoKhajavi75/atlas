'use client';

import { Place } from '@/types';
import { getCountryFlag } from '@/utils/flags';
import styles from './PlaceList.module.css';

interface PlaceListProps {
  places: Place[];
  selectedPlace: { country: string; state?: string; city?: string } | null;
  onSelectPlace: (place: { country: string; state?: string; city?: string } | null) => void;
  onHoverPlace?: (place: { country: string; state?: string; city?: string } | null) => void;
}

export default function PlaceList({
  places,
  selectedPlace,
  onSelectPlace,
  onHoverPlace,
}: PlaceListProps) {
  const groupedByCountry = places.reduce((acc, place) => {
    if (!acc[place.country]) {
      acc[place.country] = [];
    }
    acc[place.country].push(place);
    return acc;
  }, {} as Record<string, Place[]>);

  // Sort countries: Iran first, then alphabetically
  const sortedCountries = Object.entries(groupedByCountry).sort(([countryA], [countryB]) => {
    if (countryA === 'Iran') return -1;
    if (countryB === 'Iran') return 1;
    return countryA.localeCompare(countryB);
  });

  const isSelected = (place: Place) =>
    selectedPlace?.country === place.country &&
    selectedPlace?.state === place.state &&
    selectedPlace?.city === place.city;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Places We've Visited</h2>
      <div className={styles.places}>
        {sortedCountries.map(([country, countryPlaces]) => (
          <div key={country} className={styles.countryGroup}>
            <h3 className={styles.countryName}>
              {getCountryFlag(country)} {country}
            </h3>
            <div className={styles.states}>
              {countryPlaces.map((place) => {
                const placeKey = place.country === 'Iran'
                  ? `${place.country}-${place.state || 'main'}`
                  : `${place.country}-${place.city || 'main'}`;
                const placeName = place.country === 'Iran'
                  ? place.state || country
                  : place.city || country;

                return (
                  <button
                    key={placeKey}
                    className={`${styles.placeButton} ${
                      place.hasImages ? styles.hasImages : ''
                    } ${isSelected(place) ? styles.selected : ''}`}
                    onClick={() => onSelectPlace(place)}
                    onMouseEnter={() => onHoverPlace?.(place)}
                    onMouseLeave={() => onHoverPlace?.(null)}
                  >
                    <span className={styles.placeName}>
                      {placeName}
                    </span>
                    {place.hasImages && (
                      <span className={styles.badge}>
                        {place.images.length}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
        {places.length === 0 && (
          <div className={styles.empty}>
            <p>No places yet. Add images to the images directory!</p>
          </div>
        )}
      </div>
    </div>
  );
}

