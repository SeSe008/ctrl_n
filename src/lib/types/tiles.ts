import type { Component } from 'svelte';
import type { SettingsSection } from '$lib/classes/settings';

export interface TileProps {
  tileId: number;
  managerId: number;
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
