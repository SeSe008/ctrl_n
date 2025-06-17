import { writable } from 'svelte/store';
import type { ExifData, RawData } from '$lib/utils/getExif';
import { toExifData } from '$lib/utils/getExif';

export const exifData = writable<ExifData | undefined>();

export function setExifFromRaw(raw: RawData | undefined) {
  if (raw) {
    exifData.set(toExifData(raw));
  } else {
    exifData.set(undefined);
  }
}
