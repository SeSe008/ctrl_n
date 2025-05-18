import { writable } from "svelte/store";
import type { Element, Settings } from "$lib/types/settings/settings";

export const settings = writable<Settings>({ enabled: false });

export function toggleSettings(
  elements?: Element[],
  managerId?: number,
  tileId?: number
) {
  settings.update(current => {
    if (current.enabled) {
      return { enabled: false };
    } else {
      return {
        enabled: true,
        elements,
        selectedManager: managerId,
        selectedTile: tileId
      };
    }
  });
}
