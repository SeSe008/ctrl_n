import type { Image } from '$lib/types/backgroundImage';

export interface Options {
  image: () => Image | Promise<Image>;
  label?: string;
  alt?: string;
  width?: string;
  height?: string;
}
