import ColorThief from "colorthief";

function getPalette(img: HTMLImageElement, colors: number, colorThief: ColorThief) {
  return colorThief.getPalette(img, colors);
}

export function getPaletteFromSrc(src: string, colors: number, colorThief: ColorThief): Promise<number[][]> {
  // Generate palette from image source
  return new Promise((resolve, reject) => {
    const img: HTMLImageElement = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = src;
    
    if (img.complete) {
      try {
        const palette = getPalette(img, colors, colorThief);
        resolve(palette);
      } catch (err) {
        reject(err);
      }
    } else {
      img.onload = () => {
        try {
          const palette = getPalette(img, colors, colorThief);
          resolve(palette);
        } catch (err) {
          reject(err);
        }
      };
      img.onerror = reject;
    }
  });
}
