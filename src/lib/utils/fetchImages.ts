import { getImageCategories } from "$lib/stores/backgroundImage";
import type { Images } from "$lib/types/backgroundImage";

export async function fetchImages(path: string) : Promise<Images> {
  if (getImageCategories()[path]) return getImageCategories()[path];
  
  const res = await fetch('/api/images', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ subdir: path, url: window.location.href })
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
