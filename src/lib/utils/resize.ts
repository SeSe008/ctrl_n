export function resize<T extends HTMLElement>(
  node: T,
  callback: (entry: ResizeObserverEntry) => void
): { destroy(): void; } {
  const observer = new ResizeObserver((entries) => {
    callback(entries[0]);
  });
  observer.observe(node);
  return {
    destroy() {
      observer.disconnect();
    }
  };
}
