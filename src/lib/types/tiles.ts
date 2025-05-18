import type { Component } from "svelte";
import type { Element } from "./settings/settings";

export interface Tile {
  pos: number,
  element: number,
};

export interface TileManager {
  tiles: Tile[],
  height: number
};

export type GlobalTiles = TileManager[];

export interface TileDef {
  name: string;
  label: string;
  icon?: string;
  component?: Component;
  tileProps: Element[]
}

export interface TileMetadata {
  name: string;
  label: string;
  icon?: string;
}
