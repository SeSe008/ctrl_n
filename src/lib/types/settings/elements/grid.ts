import { SettingsSection } from "$lib/classes/settings";
import type { Readable } from "svelte/store";

export interface Options {
  columns?: number;
  rows?: number;
  objects: SettingsSection | (() => SettingsSection);
  updater?: Readable<any> | Array<Readable<any>>;
}
