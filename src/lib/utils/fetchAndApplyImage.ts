import { imageApis } from '$lib/constants/imageApis';
import { setBackgroundImage, setImageCredits } from '$lib/stores/backgroundImage';
import type ColorThief from 'colorthief';
import { applyPalette } from './applyPalette';
import { getPalette } from './getPalette';

export async function fetchAndApplyImage(
  categoryId: number,
  colors: number,
  colorThief: ColorThief
): Promise<HTMLImageElement | undefined> {
  const api = imageApis[categoryId];

  if (!api) {
    console.error(`Category ${categoryId} not found.`);
    return;
  }

  const url = new URL(api.endpoint);
  url.search = new URLSearchParams(api.params).toString();
  const res = await fetch(url);

  if (!res.ok) {
    console.error('Fetching Image failed:', res.status, await res.text());
    setBackgroundImage(undefined);
    return;
  }

  const data = await res.json();

  if (api.isEmpty(data)) {
    setBackgroundImage(undefined);
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
    };

    return imgElement;
  } catch {
    console.error('Error parsing image data:', data);
    return;
  }
}
