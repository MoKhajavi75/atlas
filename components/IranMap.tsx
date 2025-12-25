'use client';

import { Place } from '@/types';
import { getIranStateHasImages, iranProvinces } from '@/utils/mapData';
import styles from './IranMap.module.css';

// Simplified Iran provinces coordinates (centers for display)
// This is a simplified representation - for a real map, you'd use actual GeoJSON
const iranProvincesData: Record<string, { x: number; y: number; name: string }> = {
  'Tehran': { x: 50, y: 35, name: 'Tehran' },
  'Isfahan': { x: 51.5, y: 32.5, name: 'Isfahan' },
  'Fars': { x: 52.5, y: 29.5, name: 'Fars' },
  'Khuzestan': { x: 48.5, y: 31.5, name: 'Khuzestan' },
  'East Azerbaijan': { x: 46.5, y: 38, name: 'East Azerbaijan' },
  'West Azerbaijan': { x: 45, y: 38.5, name: 'West Azerbaijan' },
  'Kerman': { x: 57, y: 30, name: 'Kerman' },
  'Sistan and Baluchestan': { x: 60.5, y: 27.5, name: 'Sistan and Baluchestan' },
  'Khorasan Razavi': { x: 59.5, y: 36, name: 'Khorasan Razavi' },
  'Mazandaran': { x: 52.5, y: 36.5, name: 'Mazandaran' },
  'Gilan': { x: 49.5, y: 37.5, name: 'Gilan' },
  'Golestan': { x: 54.5, y: 37, name: 'Golestan' },
  'Kurdistan': { x: 47, y: 35.5, name: 'Kurdistan' },
  'Lorestan': { x: 48.5, y: 33.5, name: 'Lorestan' },
  'Hormozgan': { x: 56.5, y: 27, name: 'Hormozgan' },
  'Bushehr': { x: 50.5, y: 28.5, name: 'Bushehr' },
  'Chaharmahal and Bakhtiari': { x: 50.5, y: 32, name: 'Chaharmahal and Bakhtiari' },
  'Kohgiluyeh and Boyer-Ahmad': { x: 50.5, y: 30.5, name: 'Kohgiluyeh and Boyer-Ahmad' },
  'Yazd': { x: 54.5, y: 31.5, name: 'Yazd' },
  'Qom': { x: 50.5, y: 34.5, name: 'Qom' },
  'Qazvin': { x: 50, y: 36, name: 'Qazvin' },
  'Zanjan': { x: 48.5, y: 36.5, name: 'Zanjan' },
  'Ardabil': { x: 48, y: 38.5, name: 'Ardabil' },
  'Semnan': { x: 53.5, y: 35.5, name: 'Semnan' },
  'Markazi': { x: 49.5, y: 34.5, name: 'Markazi' },
  'Hamadan': { x: 48.5, y: 34.5, name: 'Hamadan' },
  'Kermanshah': { x: 47, y: 34.5, name: 'Kermanshah' },
  'Ilam': { x: 46.5, y: 33.5, name: 'Ilam' },
  'North Khorasan': { x: 57.5, y: 37.5, name: 'North Khorasan' },
  'South Khorasan': { x: 59, y: 32.5, name: 'South Khorasan' },
  'Alborz': { x: 50.5, y: 36, name: 'Alborz' },
};

interface IranMapProps {
  places: Place[];
  selectedPlace: { country: string; state?: string; city?: string } | null;
  onSelectPlace: (place: { country: string; state?: string; city?: string } | null) => void;
  onBack: () => void;
}

export default function IranMap({
  places,
  selectedPlace,
  onSelectPlace,
  onBack,
}: IranMapProps) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={onBack}>
          ← Back to World
        </button>
        <h3 className={styles.title}>🇮🇷 Iran</h3>
      </div>
      <div className={styles.provincesGrid}>
        {iranProvinces.map((province) => {
          const hasImages = getIranStateHasImages(province, places);
          const isSelected = selectedPlace?.country === 'Iran' && selectedPlace?.state === province;
          const provinceData = iranProvincesData[province];

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
                  {places.filter(p => p.country === 'Iran' && p.state === province)[0]?.images.length || 0}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

