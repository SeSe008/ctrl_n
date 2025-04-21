import { getPaletteFromSrc } from './getPalette';
import { applyPalette } from './applyPalette';
import ColorThief from 'colorthief';

function pickImage(images: string[]) {
  return images[Math.floor(Math.random() * images.length)];
}

export function applyImage(images: string[], lastImage: string | undefined, colors: number, colorThief: ColorThief, retry: boolean = false) {
  let image = pickImage(images);
  while (images.length > 1 && lastImage === image) {
    image = pickImage(images);
  }
  
  const imgElement = new Image();
  imgElement.src = image;

  imgElement.onload = () => {
    document.body.style.backgroundImage = `url(${image})`;
    
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
      document.body.style.backgroundImage = `url(${image})`;
      return;
    }
  };

  return image;
}

export async function useImage(images: string[], changeInterval: number, colors: number, colorThief: ColorThief) {
  // Pick a random image and set it as the pages background in intervals

  let lastImage: string = applyImage(images, undefined, colors, colorThief);

  setInterval(
    () => {
      lastImage = applyImage(images, lastImage, colors, colorThief);
    },
    changeInterval
  );
}
