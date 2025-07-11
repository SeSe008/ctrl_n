import { imageApis } from '$lib/constants/imageApis';
import { setBackgroundImage, setImageCredits, setImageLoading } from '$lib/stores/backgroundImage';
import type ColorThief from 'colorthief';
import { applyPalette } from './applyPalette';
import { getPalette } from './getPalette';
import { addError } from '$lib/stores/errors';

export async function fetchAndApplyImage(
  categoryId: number,
  colors: number,
  colorThief: ColorThief
): Promise<HTMLImageElement | undefined> {
  setImageLoading(true);

  const api = imageApis[categoryId];
  if (!api) {
    addError('image', `Image API for category ${categoryId} not found.`);
    setImageLoading(false);
    return;
  }

  const url = new URL(api.endpoint);
  url.search = new URLSearchParams(api.params).toString();
  const res = await fetch(url);
  if (!res.ok) {
    addError('image', `Failed to fetch image: ${res.statusText}`);
    setImageLoading(false);
    setBackgroundImage(undefined);
    return;
  }
  const data = await res.json();
  if (api.isEmpty(data)) {
    addError('image', 'No images found for the given category.');
    setImageLoading(false);
    setBackgroundImage(undefined);
    return;
  }

  const imgUrl = api.url(data);
  const img = new Image();
  img.crossOrigin = 'Anonymous';

  img.onload = () => {
    setBackgroundImage(imgUrl);
    setImageCredits({
      creator: api.creator(data),
      creatorUrl: api.creatorUrl(data),
      license: api.license(data),
      licenseUrl: api.licenseUrl(data)
    });
    applyPalette(getPalette(img, colors, colorThief));
    setImageLoading(false);
  };

  img.onerror = () => {
    addError('image', 'Failed to load image (invalid URL or CORS issue).');
    setBackgroundImage(undefined);
    setImageLoading(false);
  };

  img.src = imgUrl;
  return img;
}
