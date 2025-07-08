/* Skips first store on subscribe-mount */
import type { Readable, Unsubscriber } from 'svelte/store';

export function subscribeIndirect<T>(
  store: Readable<T>,
  callback: (value: T) => void
): Unsubscriber {
  let first = true;
  return store.subscribe(value => {
    if (first) { first = false; return; }
    callback(value);
  });
}
