import { tileSettings, tileManagerSettings } from "$lib/constants/settings";
import type { Element } from "$lib/types/settings/settings";

export function createNewTileSettings(elements?: Element[]) : Element[] {
  return [
    ...tileSettings,
    ...(elements ? elements : []),
    ...tileManagerSettings
  ];
}
