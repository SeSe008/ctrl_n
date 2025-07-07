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
    return;
  }

  const url = new URL(api.endpoint);
  url.search = new URLSearchParams(api.params).toString();
  const res = await fetch(url);

  if (!res.ok) {
    addError('image', `Failed to fetch image: ${res.statusText}`);
    setBackgroundImage(undefined);
    setImageLoading(false);
    return;
  }

  const data = await res.json();

  if (api.isEmpty(data)) {
    addError('image', 'No images found for the given category.');
    
    setBackgroundImage(undefined);
    setImageLoading(false);
    return;
  }
  
  try {
    const url = api.url(data);

    const imgElement = new Image();
    imgElement.crossOrigin = 'Anonymous';
    imgElement.src = url;

    imgElement.onload = async () => {
      setBackgroundImage(api.url(data));

      setImageCredits({
        creator: api.creator(data),
        creatorUrl: api.creatorUrl(data),
        license: api.license(data),
        licenseUrl: api.licenseUrl(data)
      });

      applyPalette(getPalette(imgElement, colors, colorThief));

      setImageLoading(false);
    };

    return imgElement;
  } catch {
    addError('image', 'Failed to process the image data.');
    setImageLoading(false);
    return;
  }
}
