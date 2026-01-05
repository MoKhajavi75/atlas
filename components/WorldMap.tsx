'use client';

import { type Place } from '@/types';
import { countriesMatch, getCountryHasImages } from '@/utils/mapData';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import styles from './WorldMap.module.css';

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

type WorldMapProps = {
  places: Place[];
  selectedPlace: { country: string; state?: string; city?: string } | null;
  onSelectPlace: (place: { country: string; state?: string; city?: string } | null) => void;
  hoveredPlace?: { country: string; state?: string; city?: string } | null;
};

export default function WorldMap({
  places,
  selectedPlace,
  onSelectPlace,
  hoveredPlace
}: WorldMapProps) {
  const handleCountryClick = (countryName: string) => {
    if (!countryName) return;

    // For any country (including Iran), just select the country
    // The parent component will show cities/states view
    if (countriesMatch(countryName, 'Iran')) {
      onSelectPlace({ country: 'Iran' });
    } else {
      // Find the actual country name from places
      const matchingPlace = places.find(
        p => p.country !== 'Iran' && countriesMatch(countryName, p.country)
      );
      if (matchingPlace) {
        onSelectPlace({ country: matchingPlace.country });
      }
    }
  };

  return (
    <div className={styles.mapContainer}>
      <ComposableMap
        projectionConfig={{
          scale: 147,
          center: [0, -20]
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

              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const filtered = geographies.filter((geo: any) => {
                const countryName =
                  geo.properties?.NAME ??
                  geo.properties?.NAME_LONG ??
                  geo.properties?.NAME_EN ??
                  geo.properties?.NAME_SORT ??
                  geo.properties?.name ??
                  '';
                return countryName && countryName.length > 0;
              });

              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              return filtered.map((geo: any) => {
                // Try multiple possible property names
                const countryName =
                  geo.properties?.NAME ??
                  geo.properties?.NAME_LONG ??
                  geo.properties?.NAME_EN ??
                  geo.properties?.NAME_SORT ??
                  geo.properties?.name ??
                  '';
                const hasImages = getCountryHasImages(countryName, places);
                const isIran = countriesMatch(countryName, 'Iran');
                const isSelected = selectedPlace
                  ? (isIran &&
                      selectedPlace.country === 'Iran' &&
                      !selectedPlace.state &&
                      !selectedPlace.city) ||
                    (!isIran &&
                      countriesMatch(countryName, selectedPlace.country) &&
                      !selectedPlace.state &&
                      !selectedPlace.city)
                  : false;

                const isHovered = hoveredPlace
                  ? (isIran && hoveredPlace.country === 'Iran') ||
                    (!isIran && countriesMatch(countryName, hoveredPlace.country))
                  : false;

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
                        cursor: hasImages || isIran ? 'pointer' : 'default'
                      },
                      hover: {
                        fill: hasImages || isIran ? '#818cf8' : '#3a3a3a',
                        stroke: hasImages || isIran ? '#6366f1' : '#666666',
                        strokeWidth: hasImages || isIran ? 1.5 : 0.5,
                        outline: 'none',
                        cursor: hasImages || isIran ? 'pointer' : 'default'
                      },
                      pressed: { outline: 'none' }
                    }}
                    onClick={() => {
                      if (hasImages || isIran) {
                        handleCountryClick(countryName);
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
