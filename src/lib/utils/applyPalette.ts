export function applyPalette(palette: number[][]): void {
    // Set colors to palette colors
    const root: HTMLElement = document.documentElement;
    palette.forEach((color, i) => {
        root.style.setProperty(`--c${i + 1}`, color.join(', '));
    });
}
