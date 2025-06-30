export function applyCssVars(
  node: HTMLElement,
  vars: Record<string, string> = {}
) {
  function update(newVars: Record<string, string>) {
    for (let i = node.style.length - 1; i >= 0; i--) {
      const prop = node.style[i];
      if (prop.startsWith("--")) {
        node.style.removeProperty(prop);
      }
    }

    for (const [key, value] of Object.entries(newVars)) {
      node.style.setProperty(key, value);
    }
  }

  update(vars);

  return {
    update,
    destroy() {
      for (let i = node.style.length - 1; i >= 0; i--) {
        const prop = node.style[i];
        if (prop.startsWith("--")) {
          node.style.removeProperty(prop);
        }
      }
    },
  };
}
