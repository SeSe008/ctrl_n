import { getPaletteFromSrc } from './getPalette';
import { applyPalette } from './applyPalette';
import ColorThief from 'colorthief'

function pickImage(images: string[]) {
  return images[Math.floor(Math.random() * images.length)];
}

function applyImage(images: string[], lastImage: string | undefined, colors: number, colorThief: ColorThief) {
  let image = pickImage(images);
  while (images.length > 1 && lastImage === image) {
    image = pickImage(images)
  }
  
  document.body.style.backgroundImage = `url(${image})`;
  
  getPaletteFromSrc(image, colors, colorThief)
    .then((palette) => {
      applyPalette(palette);
    });
  
  
  return image;
}

export async function useImage(images: string[], changeInterval: number, colors: number, colorThief: ColorThief) {
  // Pick a random image and set it as the pages background in intervals

  let lastImage: string = applyImage(images, undefined, colors, colorThief);

  setInterval(
    () => {
      lastImage = applyImage(images, lastImage, colors, colorThief)
    },
    changeInterval
  )
}
