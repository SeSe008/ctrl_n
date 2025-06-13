import type { Image } from '$lib/types/backgroundImage';
import type { Readable } from 'svelte/store';

export interface Options {
  image: () => Image | Promise<Image>;
  updater?: Readable<any> | Array<Readable<any>>;
  label?: string;
}
