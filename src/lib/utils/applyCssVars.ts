export function applyCssVars(node: HTMLElement, vars: Record<string, string> | undefined) {
  if (!vars) return;

  for (const [key, value] of Object.entries(vars)) {
    node.style.setProperty(key, value);
  }
  return {
    update(newVars: Record<string, string>) {
      for (const [key, value] of Object.entries(newVars)) {
        node.style.setProperty(key, value);
      }
    }
  };
}
