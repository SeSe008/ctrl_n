import { writable } from 'svelte/store';

export const rssUrl = writable<string>();

export function setRssUrl(url: string) {
  if (!url.startsWith('http')) {
    url = 'http://' + url;
  }

  rssUrl.set(url);
}

export function initRssUrl() {
  rssUrl.update(() => window.localStorage.getItem('rssUrl') || '');

  rssUrl.subscribe((current) => {
    window.localStorage.setItem('rssUrl', current);
  });
}
