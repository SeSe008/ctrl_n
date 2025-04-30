import { writable } from "svelte/store";

export interface Tile {
  pos: number,
  element: number
};

export type Tiles = Tile[]

type GlobalTiles = Tiles[];

export const globalTiles = writable<GlobalTiles>([]);

export function updateGlobalTiles(tiles: Tiles, id: number) {
  globalTiles.update(current => {
    const newGlobal = [...current];
    newGlobal[id] = tiles;
    return newGlobal;
  });
}

export function changeTile(managerId: number, tileId: number, element: number) {
  globalTiles.update(current => {
    const newGlobal = current.map((managerTiles, idx) => {
      if (idx !== managerId) return managerTiles;
      return managerTiles.map((tile, i) =>
        i === tileId ? { pos: tile.pos, element } : tile
      );
    });
    return newGlobal;
  });
}

export function addManager() {
  globalTiles.update(current => {
    const newGlobal = [...current, [{ pos: 0, element: -1}]];
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
      [
	{ pos: 0, element: 2 }
      ],
      [
	{ pos: 1, element: 1 }
      ]
    ]);
  }
  
  globalTiles.subscribe(value => {
    window.localStorage.setItem('tiles', JSON.stringify(value));
  });
}
