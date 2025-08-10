import { SettingsElement, SettingsSection } from '$lib/classes/settings';
import { tileSettings } from '$lib/constants/tileSettings';
import type { Element, ElementProps } from '$lib/types/settings/settings';
import type { Readable } from 'svelte/store';

export function createNewSettingsSection(elements?: Element[]): SettingsSection {
  return new SettingsSection([...tileSettings.elements, ...(elements ?? [])]);
}

export function createNewSettingsSlice(elements?: Element[]): SettingsSection {
  return new SettingsSection(elements);
}

export function createNewElement(
  elementType?: string,
  elementOptions?: ElementProps,
  condition?: Readable<boolean> | (() => boolean),
  updater?: Readable<any> | Array<Readable<any>>
): SettingsElement {
  return new SettingsElement(elementType ?? '', elementOptions ?? {}, condition, updater);
}
