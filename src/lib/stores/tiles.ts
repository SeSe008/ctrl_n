import { writable, get } from 'svelte/store';

import type { GlobalTiles, Tile, TileManager } from '$lib/types/tiles';

export const globalTiles = writable<GlobalTiles>({
  managers: [],
  cssVars: {}
});

export function getTiles(): GlobalTiles {
  return get(globalTiles);
}

export function setTiles(tiles: GlobalTiles) {
  globalTiles.set(tiles);
}

export function changeGlobalCssVar(name: string, value: string) {
  globalTiles.update((current) => {
    current.cssVars[name] = value;
    return current;
  });
}

export function deleteGlobalCssVar(name: string) {
  globalTiles.update((current) => {
    delete current.cssVars[name];
    return current;
  });
}

export function getGlobalCssVar(name: string): string | undefined {
  return get(globalTiles).cssVars[name];
}

export function resetGlobalCssVars() {
  globalTiles.update((current) => {
    current.cssVars = {};
    return current;
  });
}

export function getManagers(): Array<TileManager> {
  return get(globalTiles).managers;
}

export function setManager(id: number, manager: TileManager) {
  globalTiles.update((current) => {
    if (current.managers[id]) {
      current.managers[id] = manager;
    }
    return current;
  });
}

export function addManager() {
  globalTiles.update((current) => {
    current.managers = [
      ...current.managers,
      {
        tiles: [{ pos: 0, element: 0, cssVars: {} }],
        height: 1
      }
    ];
    return current;
  });
}

export function removeManager(id?: number) {
  globalTiles.update((current) => {
    current.managers =
      id !== undefined
        ? current.managers.filter((_, index) => index !== id)
        : current.managers.slice(0, -1);
    return current;
  });
}

export function changeManagerHeight(managerId: number, height: number) {
  if (managerId !== undefined)
    globalTiles.update((current) => {
      if (current.managers[managerId]) current.managers[managerId].height = height;
      return current;
    });
}

export function getManager(id: number): TileManager | undefined {
  return get(globalTiles).managers[id];
}

export function addTile(managerId: number | undefined) {
  if (managerId !== undefined)
    globalTiles.update((current) => {
      if (current.managers[managerId])
        current.managers[managerId].tiles = [
          ...current.managers[managerId].tiles,
          {
            pos: current.managers[managerId].tiles.length,
            element: 0,
            cssVars: {}
          }
        ];
      return current;
    });
}

export function removeTile(managerId: number, tileId: number) {
  globalTiles.update((current) => {
    if (current.managers[managerId] && current.managers[managerId].tiles.length > 1)
      current.managers[managerId].tiles = [
        ...current.managers[managerId].tiles.slice(0, tileId || 0),
        ...current.managers[managerId].tiles.slice((tileId || 0) + 1)
      ];
    return current;
  });
}

export function getTile(managerId: number, tileId: number): Tile | undefined {
  const current = get(globalTiles);
  if (current.managers[managerId] && current.managers[managerId].tiles[tileId]) {
    return current.managers[managerId].tiles[tileId];
  } else {
    return undefined;
  }
}

export function setTileElement(managerId: number, tileId: number, element: number) {
  globalTiles.update((current) => {
    if (
      current.managers[managerId] !== undefined &&
      current.managers[managerId].tiles[tileId] !== undefined
    ) {
      current.managers[managerId].tiles[tileId].element = element;
    }
    return current;
  });
}

export function changeTileCssVar(
  managerId: number,
  tileId: number,
  varName: string,
  varValue: string
) {
  globalTiles.update((current) => {
    if (current.managers[managerId] && current.managers[managerId].tiles[tileId])
      current.managers[managerId].tiles[tileId].cssVars[varName] = varValue;
    return current;
  });
}

export function deleteTileCssVar(managerId: number, tileId: number, varName: string) {
  globalTiles.update((current) => {
    if (current.managers[managerId] && current.managers[managerId].tiles[tileId])
      delete current.managers[managerId].tiles[tileId].cssVars[varName];
    return current;
  });
}

export function resetTileCssVars(managerId: number, tileId: number) {
  globalTiles.update((current) => {
    if (current.managers[managerId] && current.managers[managerId].tiles[tileId])
      current.managers[managerId].tiles[tileId].cssVars = {};
    return current;
  });
}

export function getTileCssVar(
  managerId: number,
  tileId: number,
  cssVar: string
): string | undefined {
  const current = get(globalTiles);
  if (current.managers[managerId] && current.managers[managerId].tiles[tileId]) {
    return current.managers[managerId].tiles[tileId].cssVars[cssVar];
  } else {
    return undefined;
  }
}

export function initializeTiles() {
  const stored = window.localStorage.getItem('tiles') || '';

  try {
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed.managers) && parsed.cssVars) {
      globalTiles.set(JSON.parse(stored));
    }
  } catch {
    // Clock and search bar
    globalTiles.set({
      managers: [
        {
          tiles: [
            {
              pos: 0,
              element: 2,
              cssVars: {
                '--tileWidth': 'max-content',
                '--tileHeight': 'max-content',
                '--tileHorPos': 'center',
                '--tileVerPos': 'center',
                '--clockFontSize': '5rem'
              }
            }
          ],
          height: 1
        },
        {
          tiles: [{ pos: 1, element: 1, cssVars: {} }],
          height: 1
        }
      ],
      cssVars: {}
    });
  }

  globalTiles.subscribe((value) => {
    window.localStorage.setItem('tiles', JSON.stringify(value));
  });
}
