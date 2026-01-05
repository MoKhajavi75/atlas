'use client';

import { type Place } from '@/types';
import { getFontFamily, getTextDirection } from '@/utils/textUtils';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import styles from './ImageGallery.module.css';

function getImagePath(filename: string): string {
  return `/api/images/${filename}`;
}

type ImageGalleryProps = {
  place: Place;
  onClose: () => void;
};

export default function ImageGallery({ place, onClose }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const placeName =
    place.country === 'Iran'
      ? place.state
        ? `${place.state}, ${place.country}`
        : place.country
      : place.city
        ? `${place.city}, ${place.country}`
        : place.country;

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedImage !== null) {
          setSelectedImage(null);
        } else {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [selectedImage, onClose]);

  return (
    <div
      className={styles.modalOverlay}
      onClick={onClose}
    >
      <div
        className={styles.modalContainer}
        onClick={e => {
          e.stopPropagation();
        }}
      >
        <div className={styles.container}>
          <div className={styles.header}>
            <div>
              <h2 className={styles.placeName}>{placeName}</h2>
              <p className={styles.imageCount}>{place.images.length}</p>
            </div>
            <button
              className={styles.closeButton}
              onClick={onClose}
            >
              ✕
            </button>
          </div>

          <div className={styles.gallery}>
            {place.images.map((image, index) => (
              <div
                key={image.filename}
                className={styles.imageCard}
                onClick={() => {
                  setSelectedImage(index);
                }}
              >
                <Image
                  src={getImagePath(image.filename)}
                  alt={image.name}
                  width={300}
                  height={250}
                  className={styles.image}
                  unoptimized
                />
                <div className={styles.imageInfo}>
                  <p
                    className={styles.imageName}
                    style={{
                      fontFamily: getFontFamily(image.name),
                      direction: getTextDirection(image.name)
                    }}
                  >
                    {image.name}
                  </p>
                  {image.date && (
                    <p className={styles.imageDate}>
                      {new Date(image.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  )}
                  {image.note && (
                    <p
                      className={styles.imageNote}
                      style={{
                        fontFamily: getFontFamily(image.note),
                        direction: getTextDirection(image.note)
                      }}
                    >
                      {image.note}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {selectedImage !== null && (
            <div
              className={styles.modal}
              onClick={() => {
                setSelectedImage(null);
              }}
            >
              <div
                className={styles.modalContent}
                onClick={e => {
                  e.stopPropagation();
                }}
              >
                <button
                  className={styles.modalClose}
                  onClick={() => {
                    setSelectedImage(null);
                  }}
                >
                  ✕
                </button>
                <Image
                  src={getImagePath(place.images[selectedImage].filename)}
                  alt={place.images[selectedImage].name}
                  width={1200}
                  height={800}
                  className={styles.modalImage}
                  unoptimized
                  style={{ maxWidth: '100%', height: 'auto' }}
                />
                <div className={styles.modalInfo}>
                  <h3
                    style={{
                      fontFamily: getFontFamily(place.images[selectedImage].name),
                      direction: getTextDirection(place.images[selectedImage].name)
                    }}
                  >
                    {place.images[selectedImage].name}
                  </h3>
                  {place.images[selectedImage].date && (
                    <p>
                      {new Date(place.images[selectedImage].date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  )}
                  {place.images[selectedImage].note && (
                    <p
                      className={styles.modalNote}
                      style={{
                        fontFamily: getFontFamily(place.images[selectedImage].note),
                        direction: getTextDirection(place.images[selectedImage].note)
                      }}
                    >
                      {place.images[selectedImage].note}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
