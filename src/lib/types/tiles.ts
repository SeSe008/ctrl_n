import type { Component } from 'svelte';
import type { SettingsSection } from '$lib/classes/settings';

export interface Tile {
  pos: number;
  element: number;
  widgetOptions: Record<string, any>;
  cssVars: Record<string, string>;
}

export interface TileManager {
  tiles: Tile[];
  height: number;
}

export interface GlobalTiles {
  managers: TileManager[];
  cssVars: Record<string, string>;
}

export interface TileDef {
  name: string;
  label: string;
  icon?: string;
  component?: Component;
  tileProps: SettingsSection;
}

export interface TileMetadata {
  name: string;
  label: string;
  icon?: string;
  cssVars?: Array<string>;
}
