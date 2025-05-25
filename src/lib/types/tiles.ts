import type { Component } from "svelte";
import type { TileSettings } from "$lib/classes/settings";

export interface Tile {
  pos: number,
  element: number,
  cssVars: Record<string, string>,
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
  tileProps: TileSettings
}

export interface TileMetadata {
  name: string;
  label: string;
  icon?: string;
}
