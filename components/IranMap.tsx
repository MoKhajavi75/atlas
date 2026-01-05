'use client';

import { type Place } from '@/types';
import { getIranStateHasImages, iranProvinces } from '@/utils/mapData';
import { useEffect } from 'react';
import styles from './IranMap.module.css';

type IranMapProps = {
  places: Place[];
  selectedPlace: { country: string; state?: string; city?: string } | null;
  onSelectPlace: (place: { country: string; state?: string; city?: string } | null) => void;
  onBack: () => void;
};

export default function IranMap({ places, selectedPlace, onSelectPlace, onBack }: IranMapProps) {
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

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button
          className={styles.backButton}
          onClick={onBack}
        >
          ← Back to World
        </button>
        <h3 className={styles.title}>🇮🇷 Iran</h3>
      </div>
      <div className={styles.provincesGrid}>
        {iranProvinces.map(province => {
          const hasImages = getIranStateHasImages(province, places);
          const isSelected = selectedPlace?.country === 'Iran' && selectedPlace.state === province;

          return (
            <button
              key={province}
              className={`${styles.provinceButton} ${
                hasImages ? styles.hasImages : ''
              } ${isSelected ? styles.selected : ''}`}
              onClick={() => {
                const place = places.find(p => p.country === 'Iran' && p.state === province);
                if (place) {
                  onSelectPlace({ country: 'Iran', state: province });
                }
              }}
            >
              <span className={styles.provinceName}>{province}</span>
              {hasImages && (
                <span className={styles.badge}>
                  {places.find(p => p.country === 'Iran' && p.state === province)?.images.length ??
                    0}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
