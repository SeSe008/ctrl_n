import { writable } from "svelte/store";
import type { Settings } from "$lib/types/settings/settings";

export const settings = writable<Settings>({ enabled: false });

export function toggleSettings(
  managerId?: number,
  tileId?: number
) {
  settings.update(current => {
    if (current.enabled) {
      return { enabled: false };
    } else {
      return {
        enabled: true,
        selectedManager: managerId,
        selectedTile: tileId
      };
    }
  });
}

export function setSelectedTile(selectedTile: number) {
  settings.update(current => {
    current.selectedTile = selectedTile;
    return current;
  });
}
