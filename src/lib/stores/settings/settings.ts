import { writable, get } from 'svelte/store';
import type { Settings } from '$lib/types/settings/settings';

export const settings = writable<Settings>({ enabled: false, selectedManager: 0, selectedTile: 0 });

export function toggleSettings(managerId?: number, tileId?: number) {
  settings.update((current) => {
    if (current.enabled) {
      current.enabled = false;
    } else {
      current.enabled = true;
      current.selectedManager = managerId ?? 0;
      current.selectedTile = tileId ?? 0;
    }
    return current;
  });
}

export function settingsEnabled(): boolean {
  return get(settings).enabled;
}

export function setSelectedTile(selectedTile: number) {
  settings.update((current) => {
    current.selectedTile = selectedTile;
    return current;
  });
}

export function getSelectedTileId(): number {
  return get(settings).selectedTile;
}

export function setSelectedManager(selectedManager: number) {
  settings.update((current) => {
    current.selectedManager = selectedManager;
    return current;
  });
}

export function getSelectedManagerId(): number {
  return get(settings).selectedManager;
}

export const selectingTile = writable<boolean>(false);

export function setSelectingTile(value: boolean) {
  selectingTile.set(value);
}

export function toggleSelectingTile() {
  selectingTile.update((current) => !current);
}

export function isSelectingTile(): boolean {
  return get(selectingTile);
}
