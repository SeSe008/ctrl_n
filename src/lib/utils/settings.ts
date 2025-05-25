import { SettingsSection } from "$lib/classes/settings";
import { tileSettings, tileManagerSettings } from "$lib/constants/settings";
import type { Element } from "$lib/types/settings/settings";

export function createNewSettingsSection(elements?: Element[]) : SettingsSection {
  return new SettingsSection([
    ...tileSettings.elements,
    ...(elements ? elements : []),
    ...tileManagerSettings.elements
  ]);
}

export function createNewSettingsGroup(elements?: Element[]) : SettingsSection {
  return new SettingsSection(elements);
}
