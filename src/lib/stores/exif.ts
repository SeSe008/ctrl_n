import { writable } from 'svelte/store';
import type { ExifData, RawData } from '$lib/utils/getExif';
import { toExifData } from '$lib/utils/getExif';

export const defaultExif: ExifData = {
  artist: [],
  copyright: [],
  description: []
};

export const exifData = writable<ExifData>(defaultExif);

export function setExifFromRaw(raw: RawData) {
  exifData.set(toExifData(raw));
}
