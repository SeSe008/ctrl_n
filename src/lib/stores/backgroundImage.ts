import { useImage } from "$lib/utils/useImage";
import { writable, get } from "svelte/store";
import type ColorThief from "colorthief";
import { fetchImages } from "$lib/utils/fetchImages";
import type { BgImageCategory, Images } from "$lib/types/backgroundImage";

export const backgroundImage = writable<string | undefined>(undefined);

export function setBackgroundImage(imageUrl: string) {
  backgroundImage.set(imageUrl);
};

export function getBackgroundImage() : string | undefined {
  return get(backgroundImage);
}

export const imageCategory = writable<number>();

export function setImageCategory(category: number) {
  imageCategory.set(category);
};

export function getImageCategory() : number {
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

export const imageCategories = writable<Array<BgImageCategory>>();

export function setImageCategories(categories: Array<BgImageCategory>) {
  imageCategories.set(categories);
}

export function getImageCategories() : Array<BgImageCategory> {
  return get(imageCategories);
}

export function addImageCategoryInCategories(label: string, icon?: string, images?: Images, path?: string) {  
  imageCategories.update(current => {
    current.push({
      images: images,
      path: path,
      label: label,
      icon: icon,
    });
    return current;
  });
}

export function deleteImageCategoryInCategories(categoryId: number) {
  imageCategories.update(current => {
    const rest = current.filter((_, index) => index !== categoryId);
    return rest;
  });
}

export function setImageCategoryInCategories(categoryId: number, images: Images) {
  imageCategories.update(current => {
    current[categoryId].images = images;
    return current;
  });
}

export function addImageToCategoryInCategories(categoryId: number, image: string) {
  imageCategories.update(current => {
    if (current[categoryId] && current[categoryId].images) {
      console.log('Adding image to category', categoryId, image);
      current[categoryId].images.push([image, true]);
    }
    return current;
  });
}

export function removeImageFromCategoryInCategories(categoryId: number, imageId: number) {
  imageCategories.update(current => {
    if (current[categoryId] && current[categoryId].images) {
      current[categoryId].images = current[categoryId].images.filter((_, index) => index !== imageId);
    }
    return current;
  });
}

export function toggleImageInCategory(categoryId: number, imageId: number) {
  imageCategories.update(current => {
    if (current[categoryId] && current[categoryId].images) {
      const item = current[categoryId].images[imageId];
      
      if (Array.isArray(item)) {
	const [ url, enabled ] = item;
	current[categoryId].images[imageId] = [ url, !enabled ];
      }
    }
    return current;
  });
}

export function initImageCategories(defaultCategories: Array<BgImageCategory>) {
  const stored = window.localStorage.getItem('imageCategories');
  
  if (stored) {
    try {
      const categories = JSON.parse(stored);
      imageCategories.set(categories);
    } catch (error) {
      console.error('Failed to parse stored image categories:', error);
    }
  } else {
    imageCategories.set(defaultCategories);
  }

  imageCategories.subscribe((categories) => {
    window.localStorage.setItem('imageCategories', JSON.stringify(categories));
  });
}

export function initBgImages(defaultCategory: number, defaultCategories: Array<BgImageCategory>, imageInterval: number, colors: number, colorThief: ColorThief) {
  initImageCategory(defaultCategory);
  initImageCategories(defaultCategories);

  imageCategory.subscribe(async (category) => {
    window.localStorage.setItem('imageCategory', category.toString());

    if (!getImageCategories()[category].images) setImageCategoryInCategories(category, await fetchImages(category));
    
    useImage(getImageCategories()[category].images, imageInterval, colors, colorThief);
  });
}
