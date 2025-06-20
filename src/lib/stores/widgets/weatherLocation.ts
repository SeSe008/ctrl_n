import { get, writable } from 'svelte/store';

export const weatherLocation = writable<string>();

export function setWeatherLocation(location: string) {
  weatherLocation.set(location);
}

export function getWeatherLocation() : string {
  return get(weatherLocation);
}

export function initWeatherLoaction() {
  weatherLocation.update(() => window.localStorage.getItem('weatherLocation') || '');

  weatherLocation.subscribe((current) => {
    window.localStorage.setItem('weatherLocation', current);
  });
}
