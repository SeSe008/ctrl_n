import type { SettingsSection } from '$lib/classes/settings';
import type { Readable } from 'svelte/store';

export interface Options {
  layout?: string;
  wrap?: boolean;
  center?: boolean;
  objects: SettingsSection | (() => SettingsSection);
  updater?: Readable<any> | Array<Readable<any>>;
}
