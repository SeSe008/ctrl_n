import { writable } from "svelte/store";
import type { Bookmarks } from '$lib/types/widgets/bookmarks';

export const bookmarks = writable<Bookmarks>([]);

export function addBookmark(name: string, url: string) {
  if (!url.startsWith("http")) {
    url = "http://" + url;
  }
  
  bookmarks.update(current => {
    return [ ...current, { name, url } ];
  });
}

export function removeBookmark(index: number) {
  bookmarks.update(current => {
    return [ ...current.slice(0, index).concat(current.slice(index + 1)) ];
  });
}

export function parseBookmarks() {
  const stored = window.localStorage.getItem("bookmarks");
  if (stored) {
    const parsed = JSON.parse(stored);
    bookmarks.set(parsed);
  }

  bookmarks.subscribe(current => {
    window.localStorage.setItem("bookmarks", JSON.stringify(current));
  });
}
