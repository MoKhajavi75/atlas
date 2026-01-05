'use client';

import { type Place } from '@/types';
import { normalizeProvinceName, provincesMatch } from '@/utils/mapData';
import { useEffect } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import styles from './IranMap.module.css';

// Using local GeoJSON file for Iran provinces
const geoUrl = '/data/ir.json';

type IranMapProps = {
  places: Place[];
  selectedPlace: { country: string; state?: string; city?: string } | null;
  onSelectPlace: (place: { country: string; state?: string; city?: string } | null) => void;
  onBack: () => void;
  hoveredPlace?: { country: string; state?: string; city?: string } | null;
};

export default function IranMap({
  places,
  selectedPlace,
  onSelectPlace,
  onBack,
  hoveredPlace
}: IranMapProps) {
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

  const handleStateClick = (provinceName: string) => {
    if (!provinceName) return;

    const normalizedProvince = normalizeProvinceName(provinceName);
    if (!normalizedProvince) return;

    const matchingPlace = places.find(
      p => p.country === 'Iran' && p.state && provincesMatch(p.state, normalizedProvince)
    );

    if (matchingPlace?.state) {
      onSelectPlace({ country: 'Iran', state: matchingPlace.state });
    }
  };

  return (
    <div className={styles.mapContainer}>
      <div className={styles.header}>
        <button
          className={styles.backButton}
          onClick={onBack}
        >
          ← Back to World
        </button>
        <h3 className={styles.title}>🇮🇷 Iran</h3>
      </div>
      <ComposableMap
        projectionConfig={{
          scale: 2000,
          center: [53, 32.5]
        }}
        width={800}
        height={600}
        style={{
          width: '100%',
          height: '100%',
          maxWidth: '100%',
          maxHeight: '100%'
        }}
      >
        <ZoomableGroup>
          <Geographies geography={geoUrl}>
            {({ geographies }: { geographies: unknown[] }) => {
              // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
              if (!geographies || geographies.length === 0) {
                return null;
              }

              // Helper to extract province name from geo properties
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const getProvinceName = (geo: any): string =>
                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                geo.properties?.name ??
                geo.properties?.NAME ??
                geo.properties?.Name ??
                geo.properties?.province ??
                geo.properties?.Province ??
                geo.properties?.PROVINCE ??
                geo.properties?.NAME_FA ??
                geo.properties?.name_fa ??
                '';

              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const filtered = geographies.filter((geo: any) => {
                const provinceName = getProvinceName(geo);
                return provinceName.length > 0;
              });

              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              return filtered.map((geo: any) => {
                const provinceName = getProvinceName(geo);
                const normalizedProvince = normalizeProvinceName(provinceName);
                if (!normalizedProvince) return null;

                // Find matching place to check for images
                const matchingPlace = places.find(
                  p =>
                    p.country === 'Iran' && p.state && provincesMatch(p.state, normalizedProvince)
                );
                const hasImages = matchingPlace?.hasImages ?? false;

                const selectedState =
                  selectedPlace?.country === 'Iran' ? selectedPlace.state : undefined;
                const isSelected =
                  selectedState !== undefined && provincesMatch(selectedState, normalizedProvince);

                const hoveredState =
                  hoveredPlace?.country === 'Iran' ? hoveredPlace.state : undefined;
                const isHovered =
                  hoveredState !== undefined && provincesMatch(hoveredState, normalizedProvince);

                // Determine colors based on state
                let fillColor: string;
                let strokeColor: string;

                if (isSelected) {
                  fillColor = '#6366f1'; // accent - blue
                  strokeColor = '#818cf8'; // accent-hover
                } else if (isHovered) {
                  fillColor = '#818cf8'; // hover - lighter blue
                  strokeColor = '#6366f1'; // darker blue border for hover
                } else if (hasImages) {
                  fillColor = '#4ade80'; // visited - green
                  strokeColor = '#22c55e'; // visited-dark border
                } else {
                  fillColor = '#3a3a3a'; // gray - no images
                  strokeColor = '#666666'; // gray border
                }

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth={isSelected ? 2 : isHovered ? 1.5 : 0.5}
                    style={{
                      default: {
                        outline: 'none',
                        cursor: hasImages ? 'pointer' : 'default'
                      },
                      hover: {
                        fill: hasImages ? '#818cf8' : '#3a3a3a',
                        stroke: hasImages ? '#6366f1' : '#666666',
                        strokeWidth: hasImages ? 1.5 : 0.5,
                        outline: 'none',
                        cursor: hasImages ? 'pointer' : 'default'
                      },
                      pressed: { outline: 'none' }
                    }}
                    onClick={() => {
                      if (hasImages) {
                        handleStateClick(provinceName);
                      }
                    }}
                  />
                );
              });
            }}
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
}
