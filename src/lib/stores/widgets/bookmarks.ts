import { get, writable } from 'svelte/store';
import type { Bookmarks } from '$lib/types/widgets/bookmarks';

export const bookmarks = writable<Bookmarks>([]);

export function addBookmark(name: string, url: string) {
  if (!url.startsWith('http')) {
    url = 'http://' + url;
  }

  if (name === undefined) {
    name = url;
  }

  bookmarks.update((current) => {
    return [...current, { name, url }];
  });
}

export function removeBookmark(index: number) {
  bookmarks.update((current) => {
    return [...current.slice(0, index).concat(current.slice(index + 1))];
  });
}

export function getBookmarks() {
  return get(bookmarks);
}

export function parseBookmarks() {
  const stored = window.localStorage.getItem('bookmarks');
  if (stored) {
    const parsed = JSON.parse(stored);
    bookmarks.set(parsed);
  }

  bookmarks.subscribe((current) => {
    window.localStorage.setItem('bookmarks', JSON.stringify(current));
  });
}

export const bookmarksLinkTarget = writable<boolean>(true);

export function toggleBookmarksLinkTarget() {
  bookmarksLinkTarget.update(current => !current);
}

export function parseBookmarksLinkTarget() {
  const stored = window.localStorage.getItem('bookmarksTarget');

  const parsed = stored !== 'false';
  bookmarksLinkTarget.set(parsed);

  bookmarksLinkTarget.subscribe((current) => {
    window.localStorage.setItem('bookmarksTarget', current.toString());
  });
}
