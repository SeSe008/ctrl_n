import { useImage } from "$lib/utils/useImage";
import { writable, get } from "svelte/store";
import type ColorThief from "colorthief";
import { fetchImages } from "$lib/utils/fetchImages";
import type { Images } from "$lib/types/backgroundImage";

export const backgroundImage = writable<string | undefined>(undefined);

export function setBackgroundImage(imageUrl: string) {
  backgroundImage.set(imageUrl);
};

export function getBackgroundImage() : string | undefined {
  return get(backgroundImage);
}

export const imageCategory = writable<string>();

export function setImageCategory(category: string) {
  imageCategory.set(category);
};

export function getImageCategory() : string {
  return get(imageCategory);
}

function initImageCategory(defaultCategory: string) {
  const stored = window.localStorage.getItem('imageCategory');
  
  if (stored) {
    imageCategory.set(stored);
  } else {
    imageCategory.set(defaultCategory);
  }
}

export const imageCategories = writable<Record<string, Images>>();

export function setImageCategories(categories: Record<string, Images>) {
  imageCategories.set(categories);
}

export function getImageCategories() : Record<string, Images> {
  return get(imageCategories);
}

export function addImageCategoryInCategories(category: string, images: Images) {
  imageCategories.update(current => {
    return { ...current, [category]: images };
  });
}

export function deleteImageCategoryInCategories(category: string) {
  imageCategories.update(current => {
    const { [category]: _, ...rest } = current;
    return rest;
  });
}

export function setImageCategoryInCategories(category: string, images: Images) {
  imageCategories.update(current => {
    current[category] = images;
    return current;
  });
}

export function addImageToCategoryInCategories(category: string, image: string) {
  imageCategories.update(current => {
    if (current[category]) {
      current[category].push([image, true]);
    } else {
      current[category] = [ [image, true] ];
    }
    return current;
  });
}

export function removeImageFromCategoryInCategories(category: string, id: number) {
  imageCategories.update(current => {
    if (current[category]) {
      current[category] = current[category].filter((_, index) => index !== id);
    }
    return current;
  });
}

export function toggleImageInCategory(category: string, id: number) {
  imageCategories.update(current => {
    if (current[category]) {
      const item = current[category][id];
      
      if (Array.isArray(item)) {
	const [ url, enabled ] = item;
	current[category][id] = [ url, !enabled ];
      }
    }
    return current;
  });
}

export function initImageCategories() {
  const stored = window.localStorage.getItem('imageCategories');
  
  if (stored) {
    try {
      const categories = JSON.parse(stored);
      imageCategories.set(categories);
    } catch (error) {
      console.error('Failed to parse stored image categories:', error);
    }
  } else {
    imageCategories.set({});
  }

  imageCategories.subscribe((categories) => {
    window.localStorage.setItem('imageCategories', JSON.stringify(categories));
  });
}

export function initBgImages(defaultCategory: string, imageInterval: number, colors: number, colorThief: ColorThief) {
  initImageCategory(defaultCategory);
  initImageCategories();

  imageCategory.subscribe(async (category) => {
    window.localStorage.setItem('imageCategory', category);

    setImageCategoryInCategories(category, await fetchImages(category));
    
    useImage(getImageCategories()[category], imageInterval, colors, colorThief);
  });
}
