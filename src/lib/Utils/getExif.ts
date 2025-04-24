import { Buffer } from 'buffer';
import * as ExifParser from 'exif-parser';
import { setExifFromRaw } from '$lib/stores/exif';

export interface RawData {
  ImageDescription: string;
  Artist: string;
  Copyright: string;
}

export interface ExifData {
  artist: string[];
  copyright: string[];
  description: string[];
}

export function toExifData(input: RawData): ExifData {
  return {
    artist: JSON.parse(input.Artist),
    copyright: JSON.parse(input.Copyright),
    description: JSON.parse(input.ImageDescription),
  };
}

export async function parseExif(url: string) {
  try {
    const resp = await fetch(url);

    const arrayBuffer = await resp.arrayBuffer();
    const buf = Buffer.from(arrayBuffer);
    const parser = ExifParser.create(buf);

    const exifData: RawData = parser.parse().tags;

    setExifFromRaw(exifData);
  } catch (err) {
    console.error('EXIF parse failed', err);
    return;
  }
}
