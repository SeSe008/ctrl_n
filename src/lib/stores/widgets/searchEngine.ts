import { writable } from 'svelte/store';

import { searchEngines } from '$lib/constants/searchEngines';

const defaultSearchEngineName = 'ecosia';
export const searchEngineName = writable<string>(defaultSearchEngineName);

export function setSearchEngineName(newEngine: string) {
  if (searchEngines[newEngine]) searchEngineName.set(newEngine);
}

export function initSearchEngineName() {
  const stored = window.localStorage.getItem('searchEngine') || defaultSearchEngineName;
  searchEngineName.set(searchEngines[stored] ? stored : defaultSearchEngineName);

  searchEngineName.subscribe((engine) => window.localStorage.setItem('searchEngine', engine));
}
