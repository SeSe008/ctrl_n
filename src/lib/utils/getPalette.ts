import ColorThief from 'colorthief';

function luminance([r, g, b]: number[]) : number {
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

function contrast(lum: number, darkestLum: number) : number {
  return (lum + 0.05) / (darkestLum + 0.05);
}

export function getPalette(img: HTMLImageElement, colors: number, colorThief: ColorThief) : number[][] {
  const pallete: number[][] = colorThief.getPalette(img, colors);
  const darkest: number = Math.min(...pallete.map(luminance));
  
  return pallete.sort((a, b) => {
    return contrast(luminance(a), darkest) - contrast(luminance(b), darkest);
  });;
}
