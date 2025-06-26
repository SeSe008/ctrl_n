import { SettingsSection } from '$lib/classes/settings';
import { tileManagerSettings, tileSettings } from '$lib/constants/settings';
import type { Element } from '$lib/types/settings/settings';

export function createNewSettingsSection(elements?: Element[]): SettingsSection {
    return new SettingsSection([...tileManagerSettings.elements, ...tileSettings.elements, ...(elements ? elements : [])]);
}

export function createNewSettingsSlice(elements?: Element[]): SettingsSection {
    return new SettingsSection(elements);
}
