import { writable } from "svelte/store";

import type { GlobalTiles, TileManager } from '$lib/types/tiles';

export const globalTiles = writable<GlobalTiles>([]);

export function updateManager(manager: TileManager, id: number) {
  globalTiles.update(current => {
    const newGlobal = [...current];
    newGlobal[id] = manager;
    return newGlobal;
  });
}

export function changeTile(managerId: number, tileId: number, element: number) {
  globalTiles.update(current => {
    return current.map((manager, idx) => {
      if (idx !== managerId) {
        return manager;
      }

      return {
        ...manager,
        tiles: manager.tiles.map((tile, i) =>
          i === tileId ? { ...tile, element } : tile
        )
      };
    });
  });
}

export function addManager() {
  globalTiles.update(current => {
    const newGlobal = [
      ...current,
      {
	tiles: [{ pos: 0, element: -1}],
	height: 1
      }
    ];
    return newGlobal;
  });
}

export function removeManager() {
  globalTiles.update(current => {
    const newGlobal = [...current.slice(0, -1)];
    return newGlobal;
  });
}

export function initializeTiles() {
  const stored = window.localStorage.getItem('tiles') || '';

  try {
    globalTiles.set(JSON.parse(stored));
  } catch {
    // Clock and search bar
    globalTiles.set([
      {
	tiles: [{ pos: 0, element: 2 }],
	height: 1
      },
      {
	tiles: [{ pos: 1, element: 1 }],
	height: 1
      }
    ]);
  }
  
  globalTiles.subscribe(value => {
    window.localStorage.setItem('tiles', JSON.stringify(value));
  });
}
