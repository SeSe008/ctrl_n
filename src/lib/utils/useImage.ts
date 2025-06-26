import ColorThief from 'colorthief';
import type { Image } from '$lib/types/backgroundImage';
import { applyImage } from './applyImage';

let imageInterval: NodeJS.Timeout;

export function pickImage(images: Array<Image>): string | undefined {
  const randomIndex = Math.floor(Math.random() * images.length);
  return images[randomIndex][0];
}

export async function useImage({
  images,
  changeInterval,
  colors,
  colorThief
}: {
  images: Array<Image> | undefined;
  changeInterval: number;
  colors: number;
  colorThief: ColorThief;
}) {
  // Pick a random image and set it as the page background in intervals
  if (imageInterval) clearInterval(imageInterval);

  let lastImage: string = applyImage(images, undefined, colors, colorThief);

  imageInterval = setInterval(() => {
    lastImage = applyImage(images, lastImage, colors, colorThief);
  }, changeInterval);
}
