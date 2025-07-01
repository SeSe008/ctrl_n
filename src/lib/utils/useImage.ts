import ColorThief from 'colorthief';
import { fetchAndApplyImage } from './fetchAndApplyImage';
import { getImageCategory } from '$lib/stores/backgroundImage';

let imageInterval: NodeJS.Timeout;

export async function useImage(changeInterval: number, colors: number, colorThief: ColorThief) {
  // Pick an image and set it as the page background in intervals
  if (imageInterval) clearInterval(imageInterval);

  let image: HTMLImageElement | undefined = await fetchAndApplyImage(
    getImageCategory(),
    colors,
    colorThief
  );

  imageInterval = setInterval(async () => {
    if (image) image.remove();
    image = await fetchAndApplyImage(getImageCategory(), colors, colorThief);
  }, changeInterval);
}
