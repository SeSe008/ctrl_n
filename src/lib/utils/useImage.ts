import { getPaletteFromSrc } from './getPalette';
import { applyPalette } from './applyPalette';
import { parseExif } from './getExif';

import ColorThief from 'colorthief';
import { setBackgroundImage } from '$lib/stores/backgroundImage';
import type { Images } from '$lib/types/backgroundImage';

let imageInterval: NodeJS.Timeout;

function pickImage(images: Images) : string | undefined {
  const toggledImages = images.filter(
    (img): img is [string, boolean] => img[1] === true
  );

  if (toggledImages.length === 0) {
    return undefined;
  }

  const randomIndex = Math.floor(Math.random() * toggledImages.length);
  return toggledImages[randomIndex][0];
}

export function applyImage(images: Images, lastImage: string | undefined, colors: number, colorThief: ColorThief, retry: boolean = false) : string {
  let image: string | undefined = pickImage(images);

  while (images.length > 1 && lastImage === image && lastImage) {
    image = pickImage(images);
  }

  if (!image) return lastImage || '';
  
  const imgElement = new Image();
  imgElement.src = image;

  imgElement.onload = async () => {
    setBackgroundImage(image);

    parseExif(image);
    
    getPaletteFromSrc(image, colors, colorThief)
      .then((palette) => {
        applyPalette(palette);
      });
  };
  
  imgElement.onerror = () => {
    console.error(`Failed to load image: ${image}`);
    if (!retry) {
      applyImage(images, lastImage, colors, colorThief, true);
    } else {
      setBackgroundImage(image);
      return;
    }
  };
  return image;
}

export async function useImage(images: Images, changeInterval: number, colors: number, colorThief: ColorThief) {
  // Pick a random image and set it as the page background in intervals
  if (imageInterval) clearInterval(imageInterval);
  
  let lastImage: string = applyImage(images, undefined, colors, colorThief);

  imageInterval = setInterval(
    () => {
      lastImage = applyImage(images, lastImage, colors, colorThief);
    },
    changeInterval
  );
}
