export interface TravelImage {
  name: string;
  country: string;
  state?: string; // Only for Iran
  city?: string; // For non-Iran countries
  date: string;
  note?: string;
  filename: string;
}

export interface Place {
  country: string;
  state?: string; // Only for Iran
  city?: string; // For non-Iran countries
  images: TravelImage[];
  hasImages: boolean;
}

