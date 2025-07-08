import type { SettingsSection } from '$lib/classes/settings';

export interface Options {
  layout?: string;
  wrap?: boolean;
  center?: boolean;
  background?: boolean;
  border?: boolean;
  objects: SettingsSection | (() => SettingsSection);
}
