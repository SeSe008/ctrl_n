import { writable } from 'svelte/store';

export const weatherLocation = writable<string>();

export function setWeatherLocation(location: string) {
  weatherLocation.set(location);
}

export function initWeatherLoaction() {
  weatherLocation.update(() => window.localStorage.getItem('weatherLocation') || '');

  weatherLocation.subscribe((current) => {
    window.localStorage.setItem('weatherLocation', current);
  });
}
