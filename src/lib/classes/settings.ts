import { tileManagerSettings, tileSettings } from "$lib/constants/settings";
import type { Element, ElementProps } from "$lib/types/settings/settings";

export class TileSettings {
  #elements: Element[];

  constructor (
    elements?: Element[]
  ) {
    this.#elements = [
      ...tileSettings,
      ...(elements ? elements : []),
      ...tileManagerSettings
    ];
  }

  public appendElement(
    type: string,
    options: ElementProps
  ) {
    this.#elements.push(new SettingsElement(type, options));
    return this;
  }

  public get elements() {
    return this.#elements;
  }

  public getElement(id: number) {
    return this.#elements[id]
  }
}

export class SettingsElement implements Element {
  #elementType: string;
  #elementOptions: ElementProps;

  constructor(
    type: string,
    options: ElementProps
  ) {
    this.#elementType = type;
    this.#elementOptions = options;
  }

  public get elementType() {
    return this.#elementType;
  }

  public get elementOptions() {
    return this.#elementOptions;
  }
}

export function createNewTileSettings(elements?: Element[]) {
  return new TileSettings(elements);
}
