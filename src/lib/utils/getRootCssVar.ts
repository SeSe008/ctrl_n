export function getRootCssVar(name: string): string | undefined {
  const root = document.documentElement;

  if (root) {
    const value = getComputedStyle(root).getPropertyValue(`${name}`);
    return value ? value.trim() : undefined;
  }
  
  return undefined;
}
