import { getPlacesByLocation } from '@/utils/images';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const places = getPlacesByLocation();
    return NextResponse.json(places);
  } catch (error) {
    console.error('Error fetching places:', error);
    return NextResponse.json({ error: 'Failed to fetch places' }, { status: 500 });
  }
}
