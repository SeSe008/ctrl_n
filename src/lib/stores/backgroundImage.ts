import { useImage } from '$lib/utils/useImage';
import { writable, get, derived } from 'svelte/store';
import type ColorThief from 'colorthief';
import type { ImageCredit } from '$lib/types/backgroundImage';

export const backgroundImage = writable<string | undefined>(undefined);

export function setBackgroundImage(imageUrl: string | undefined) {
  backgroundImage.set(imageUrl);
}

export function getBackgroundImage(): string | undefined {
  return get(backgroundImage);
}

export const imageCategory = writable<number>();

export function setImageCategory(category: number) {
  imageCategory.set(category);
}

export function getImageCategory(): number {
  return get(imageCategory);
}

function initImageCategory(defaultCategory: number) {
  const stored = window.localStorage.getItem('imageCategory');

  if (stored && !isNaN(Number(stored))) {
    setImageCategory(Number(stored));
  } else {
    setImageCategory(defaultCategory);
  }
}

export const apiImageKeyword = writable<string>('');

export function setApiImageKeyword(keyword: string) {
  apiImageKeyword.set(keyword);
}

export function getApiImageKeyword(): string {
  return get(apiImageKeyword);
}

export function initApiImageKeyword(defaultKeyword: string) {
  const stored = window.localStorage.getItem('apiImageKeyword');

  setApiImageKeyword(stored ?? defaultKeyword);
}

export const imageCredits = writable<ImageCredit | undefined>(undefined);

export function setImageCredits(credits: ImageCredit | undefined) {
  imageCredits.set(credits);
}

export function getImageCredits(): ImageCredit | undefined {
  return get(imageCredits);
}

export const imageLoading = writable<boolean>(false);

export function setImageLoading(loading: boolean) {
  imageLoading.set(loading);
}

export function getImageLoading(): boolean {
  return get(imageLoading);
}

export function initBgImages(
  defaultCategory: number,
  defaultKeyword: string,
  imageInterval: number,
  colors: number,
  colorThief: ColorThief
) {
  initImageCategory(defaultCategory);
  initApiImageKeyword(defaultKeyword);

  const combinedStore = derived(
    [imageCategory, apiImageKeyword],
    ([$category, $keyword]) => [ $category, $keyword ]
  );
  
  combinedStore.subscribe(([ category, keyword ]) => {
    window.localStorage.setItem('apiImageKeyword', keyword.toString());
    window.localStorage.setItem('imageCategory', category.toString());

    useImage(imageInterval, colors, colorThief);
  });
}
