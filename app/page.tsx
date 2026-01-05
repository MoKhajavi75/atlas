'use client';

import CitiesMap from '@/components/CitiesMap';
import ImageGallery from '@/components/ImageGallery';
import IranMap from '@/components/IranMap';
import PlaceList from '@/components/PlaceList';
import WorldMap from '@/components/WorldMap';
import { type Place } from '@/types';
import { useEffect, useState } from 'react';
import styles from './page.module.css';

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
        <h1>🗺️ Atlas</h1>
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
