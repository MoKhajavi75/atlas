import { NextResponse } from 'next/server';
import { getPlacesByLocation } from '@/utils/images';

export async function GET() {
  try {
    const places = getPlacesByLocation();
    return NextResponse.json(places);
  } catch (error) {
    console.error('Error fetching places:', error);
    return NextResponse.json({ error: 'Failed to fetch places' }, { status: 500 });
  }
}



