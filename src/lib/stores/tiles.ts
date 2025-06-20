import { writable, get } from 'svelte/store';

import type { GlobalTiles, Tile, TileManager } from '$lib/types/tiles';

export const globalTiles = writable<GlobalTiles>([]);

export function getTiles(): GlobalTiles {
  return get(globalTiles);
}

export function updateManager(manager: TileManager, id: number) {
  globalTiles.update((current) => {
    const newGlobal = [...current];
    newGlobal[id] = manager;
    return newGlobal;
  });
}

export function changeTile(
  managerId: number | undefined,
  tileId: number | undefined,
  element: number
) {
  if (managerId !== undefined && tileId !== undefined)
    globalTiles.update((current) => {
      if (current[managerId] !== undefined && current[managerId].tiles[tileId] !== undefined)
        current[managerId].tiles[tileId].element = element;
      return current;
    });
}

export function addManager() {
  globalTiles.update((current) => {
    const newGlobal = [
      ...current,
      {
        tiles: [{ pos: 0, element: 0, cssVars: {} }],
        height: 1
      }
    ];
    return newGlobal;
  });
}

export function removeManager(id?: number) {
  globalTiles.update((current) => {
    const newGlobal =
      id !== undefined ? current.filter((_, index) => index !== id) : current.slice(0, -1);
    return newGlobal;
  });
}

export function getManager(id: number): TileManager | undefined {
  return get(globalTiles)[id];
}

export function addTile(managerId: number | undefined) {
  if (managerId !== undefined)
    globalTiles.update((current) => {
      if (current[managerId])
        current[managerId].tiles = [
          ...current[managerId].tiles,
          {
            pos: current[managerId].tiles.length,
            element: 0,
            cssVars: {}
          }
        ];
      return current;
    });
}

export function removeTile(managerId: number | undefined, tileId?: number) {
  if (managerId !== undefined)
    globalTiles.update((current) => {
      if (current[managerId] && current[managerId].tiles.length > 1)
        current[managerId].tiles = [...current[managerId].tiles.slice(0, tileId || 0), ...current[managerId].tiles.slice((tileId || 0) + 1)];
      return current;
    });
}

export function getTile(managerId: number, tileId: number): Tile | undefined {
  const current = get(globalTiles);
  if (current[managerId] && current[managerId].tiles[tileId]) {
    return current[managerId].tiles[tileId];
  } else {
    return undefined;
  }
}

export function changeManagerHeight(managerId: number | undefined, height: number) {
  if (managerId !== undefined)
    globalTiles.update((current) => {
      if (current[managerId]) current[managerId].height = height;
      return current;
    });
}

export function changeCssVar(
  managerId: number | undefined,
  tileId: number | undefined,
  varName: string,
  varValue: string
) {
  if (managerId !== undefined && tileId !== undefined)
    globalTiles.update((current) => {
      if (current[managerId] && current[managerId].tiles[tileId])
        current[managerId].tiles[tileId].cssVars[varName] = varValue;
      return current;
    });
}

export function deleteCssVar(
  managerId: number | undefined,
  tileId: number | undefined,
  varName: string
) {
  if (managerId !== undefined && tileId !== undefined)
    globalTiles.update((current) => {
      if (current[managerId] && current[managerId].tiles[tileId])
        delete current[managerId].tiles[tileId].cssVars[varName];
      return current;
    });
}

export function resetCssVars(managerId: number | undefined, tileId: number | undefined) {
  if (managerId !== undefined && tileId !== undefined)
    globalTiles.update((current) => {
      if (current[managerId] && current[managerId].tiles[tileId])
	current[managerId].tiles[tileId].cssVars = {};
      return current;
    });
}

export function getCssVar(managerId: number | undefined, tileId: number | undefined, cssVar: string): string | undefined {
  if (managerId !== undefined && tileId !== undefined) {
    const current = get(globalTiles);
    if (current[managerId] && current[managerId].tiles[tileId]) {
      return current[managerId].tiles[tileId].cssVars[cssVar];
    }
  }
  return undefined;
}

export function initializeTiles() {
  const stored = window.localStorage.getItem('tiles') || '';

  try {
    globalTiles.set(JSON.parse(stored));
  } catch {
    // Clock and search bar
    globalTiles.set([
      {
        tiles: [{ pos: 0, element: 2, cssVars: {
	  '--tileWidth': 'max-content',
	  '--tileHeight': 'max-content',
	  '--tileHorPos': 'center',
	  '--tileVerPos': 'center'
	} }],
        height: 1
      },
      {
        tiles: [{ pos: 1, element: 1, cssVars: {} }],
        height: 1
      }
    ]);
  }

  globalTiles.subscribe((value) => {
    window.localStorage.setItem('tiles', JSON.stringify(value));
  });
}
