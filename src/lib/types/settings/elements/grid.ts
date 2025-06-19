import { SettingsSection } from '$lib/classes/settings';

export interface Options {
  columns: number;
  objects: SettingsSection | (() => SettingsSection);
}
