import { useImage } from "$lib/utils/useImage";
import { writable, get } from "svelte/store";
import type ColorThief from "colorthief";
import { fetchImages } from "$lib/utils/fetchImages";

export const backgroundImage = writable<string | undefined>(undefined);

export function setBackgroundImage(imageUrl: string) {
  backgroundImage.set(imageUrl);
};

export function getBackgroundImage() : string | undefined {
  return get(backgroundImage);
}

export const images = writable<string[]>([]);

export function setImages(imageList: string[]) {
  images.set(imageList);
}

export function getImages() : string[] {
  return get(images);
}

export const imageCategory = writable<string>();

export function setImageCategory(category: string) {
  imageCategory.set(category);
};

export function getImageCategory() : string {
  return get(imageCategory);
}

function initImageCatergory(defaultCategory: string) {
  const stored = window.localStorage.getItem('imageCategory');
  
  if (stored) {
    imageCategory.set(stored);
  } else {
    imageCategory.set(defaultCategory);
  }
}

export function initBgImages(defaultCategory: string, imageInterval: number, colors: number, colorThief: ColorThief) {
  initImageCatergory(defaultCategory);


  imageCategory.subscribe(async (category) => {
    window.localStorage.setItem('imageCategory', category);

    setImages(await fetchImages(category));
    
    useImage(getImages(), imageInterval, colors, colorThief);
  });
}
