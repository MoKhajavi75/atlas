import fs from 'fs';
import path from 'path';
import { NextResponse, type NextRequest } from 'next/server';

const IMAGES_DIR = path.join(process.cwd(), 'images');

export async function GET(_: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  try {
    const { path: pathArray } = await params;
    const filePath = path.join(IMAGES_DIR, ...pathArray);

    // Security: ensure the file is within the images directory
    const resolvedPath = path.resolve(filePath);
    const resolvedDir = path.resolve(IMAGES_DIR);

    if (!resolvedPath.startsWith(resolvedDir)) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 403 });
    }

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);
    const ext = path.extname(filePath).toLowerCase();

    const contentType: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp'
    };

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType[ext] || 'application/octet-stream'
      }
    });
  } catch (error) {
    console.error('Error serving image:', error);
    return NextResponse.json({ error: 'Failed to serve image' }, { status: 500 });
  }
}
