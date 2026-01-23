'use client';

import ImageGallery from '@/components/ImageGallery';
import PlaceList from '@/components/PlaceList';
import { type Place } from '@/types';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import styles from './page.module.css';

// eslint-disable-next-line @typescript-eslint/naming-convention
const WorldMap = dynamic(() => import('@/components/WorldMap'), { ssr: false });
// eslint-disable-next-line @typescript-eslint/naming-convention
const IranMap = dynamic(() => import('@/components/IranMap'), { ssr: false });
// eslint-disable-next-line @typescript-eslint/naming-convention
const CitiesMap = dynamic(() => import('@/components/CitiesMap'), { ssr: false });

export default function Home() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlace, setSelectedPlace] = useState<{
    country: string;
    state?: string;
    city?: string;
  } | null>(null);
  const [hoveredPlace, setHoveredPlace] = useState<{
    country: string;
    state?: string;
    city?: string;
  } | null>(null);

  useEffect(() => {
    fetch('/api/places')
      .then(res => res.json())
      .then(data => {
        setPlaces(data);
        setLoading(false);
      })
      .catch((error: unknown) => {
        console.error('Error fetching places:', error);
        setLoading(false);
      });
  }, []);

  const selectedPlaceData = selectedPlace
    ? places.find(
        p =>
          p.country === selectedPlace.country &&
          p.state === selectedPlace.state &&
          p.city === selectedPlace.city
      )
    : null;

  // Derive view states from selectedPlace instead of using effects
  const showIranStates =
    selectedPlace?.country === 'Iran' && !selectedPlace.state && !selectedPlace.city;
  const showCities =
    selectedPlace?.country !== undefined &&
    selectedPlace.country !== 'Iran' &&
    !selectedPlace.city &&
    !selectedPlace.state;
  const selectedCountry = showCities ? selectedPlace.country : null;
  const showImageModal = Boolean(selectedPlace && selectedPlaceData?.hasImages);

  const handlePlaceSelect = (place: { country: string; state?: string; city?: string } | null) => {
    setSelectedPlace(place);
  };

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h1>
          <span className={styles.emoji}>🗺️</span> Atlas
        </h1>
        <p className={styles.subtitle}>Our Travel Memories</p>
      </header>

      <div className={styles.content}>
        {loading ? (
          <div className={styles.emptyState}>
            <p>Loading...</p>
          </div>
        ) : (
          <>
            <PlaceList
              places={places}
              selectedPlace={selectedPlace}
              onSelectPlace={handlePlaceSelect}
              onHoverPlace={setHoveredPlace}
            />
            <div className={styles.mapView}>
              {showIranStates ? (
                <IranMap
                  places={places}
                  selectedPlace={selectedPlace}
                  onSelectPlace={handlePlaceSelect}
                  onBack={() => {
                    setSelectedPlace(null);
                  }}
                  hoveredPlace={hoveredPlace}
                />
              ) : showCities && selectedCountry ? (
                <CitiesMap
                  country={selectedCountry}
                  places={places}
                  selectedPlace={selectedPlace}
                  onSelectPlace={handlePlaceSelect}
                  onBack={() => {
                    setSelectedPlace(null);
                  }}
                />
              ) : (
                <WorldMap
                  places={places}
                  selectedPlace={selectedPlace}
                  onSelectPlace={handlePlaceSelect}
                  hoveredPlace={hoveredPlace}
                />
              )}
            </div>
            {showImageModal && selectedPlaceData && (
              <ImageGallery
                place={selectedPlaceData}
                onClose={() => {
                  // Return to cities/states list instead of world map
                  // If it's Iran with a state, go back to Iran states view
                  // If it's a country with a city, go back to cities view
                  if (selectedPlaceData.country === 'Iran' && selectedPlaceData.state) {
                    setSelectedPlace({ country: 'Iran' });
                  } else if (selectedPlaceData.country !== 'Iran' && selectedPlaceData.city) {
                    setSelectedPlace({ country: selectedPlaceData.country });
                  } else {
                    setSelectedPlace(null);
                  }
                }}
              />
            )}
          </>
        )}
      </div>
    </main>
  );
}
