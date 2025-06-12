import { getImageCategories } from "$lib/stores/backgroundImage";
import type { Image } from "$lib/types/backgroundImage";

export async function fetchImages(categoryId: number) : Promise<Array<Image>> {
  const category = getImageCategories()[categoryId];

  if (!category) {
    console.error('fetchImages: Category not found for ID', categoryId);
    return [];
  } else if (!category.path) {
    return category.images || [];
  }
  
  const res = await fetch('/api/images', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ subdir: category.path, url: window.location.href })
  });

  if (!res.ok) {
    console.error('fetchImages failed:', res.status, await res.text());
    return [];
  }

  const json = await res.json();

  if (Array.isArray(json) && json.every(item => typeof item === "string")) {
    return json.map(img => [img, true]);
  } else {
    return [];
  }
}
