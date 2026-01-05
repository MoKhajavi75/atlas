'use client';

import { type Place } from '@/types';
import { getCountryFlag } from '@/utils/flags';
import { useEffect } from 'react';
import styles from './CitiesMap.module.css';

type CitiesMapProps = {
  country: string;
  places: Place[];
  selectedPlace: { country: string; state?: string; city?: string } | null;
  onSelectPlace: (place: { country: string; state?: string; city?: string } | null) => void;
  onBack: () => void;
};

export default function CitiesMap({
  country,
  places,
  selectedPlace,
  onSelectPlace,
  onBack
}: CitiesMapProps) {
  // Handle ESC key to go back to world map
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onBack();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [onBack]);

  // Get all cities for this country
  const countryPlaces = places.filter(p => p.country === country && p.city);
  const cities = Array.from(new Set(countryPlaces.map(p => p.city))).sort();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button
          className={styles.backButton}
          onClick={onBack}
        >
          ← Back to World
        </button>
        <h3 className={styles.title}>
          {getCountryFlag(country)} {country}
        </h3>
      </div>
      <div className={styles.citiesGrid}>
        {cities.map(city => {
          const cityPlace = countryPlaces.find(p => p.city === city);
          const hasImages = cityPlace?.hasImages ?? false;
          const isSelected = selectedPlace?.country === country && selectedPlace.city === city;

          return (
            <button
              key={city}
              className={`${styles.cityButton} ${
                hasImages ? styles.hasImages : ''
              } ${isSelected ? styles.selected : ''}`}
              onClick={() => {
                if (cityPlace) {
                  onSelectPlace({
                    country: country,
                    city: city
                  });
                }
              }}
            >
              <span className={styles.cityName}>{city}</span>
              {hasImages && cityPlace && (
                <span className={styles.badge}>{cityPlace.images.length}</span>
              )}
            </button>
          );
        })}
        {cities.length === 0 && (
          <div className={styles.empty}>
            <p>No cities found for {country}</p>
          </div>
        )}
      </div>
    </div>
  );
}
