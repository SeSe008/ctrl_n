import { setBackgroundImage } from '$lib/stores/backgroundImage';
import type { Image } from '$lib/types/backgroundImage';
import type ColorThief from 'colorthief';
import { applyPalette } from "./applyPalette";
import { parseExif } from './getExif';
import { getPalette } from './getPalette';
import { pickImage } from './useImage';

export function applyImage(
    images: Array<Image> | undefined,
    lastImage: string | undefined,
    colors: number,
    colorThief: ColorThief,
    retry: boolean = false
): string {
    if (!images) return lastImage || '';

    const toggledImages = images.filter((img): img is [string, boolean] => img[1] === true);

    if (!toggledImages) return lastImage || '';

    let image: string | undefined = pickImage(toggledImages);

    while (toggledImages.length > 1 && lastImage === image && lastImage) {
        image = pickImage(toggledImages);
    }

    if (!image) return lastImage || '';

    const imgElement = new Image();
    imgElement.src = image;

    imgElement.onload = async () => {
        setBackgroundImage(image);

        parseExif(image);

        applyPalette(getPalette(imgElement, colors, colorThief));
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
