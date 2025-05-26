import type { Element, ElementProps } from "$lib/types/settings/settings";

export class SettingsSection {
  #elements: Element[];

  constructor (
    elements?: Element[]
  ) {
    this.#elements = elements || [];
    return this;
  }

  public appendElement(
    type: string,
    options: ElementProps
  ) {
    this.#elements.push(new SettingsElement(type, options));
    return this;
  }

  public get elements() : Element[] {
    return this.#elements;
  }

  public getElement(id: number) : Element {
    return this.#elements[id];
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

  public get elementType() : string {
    return this.#elementType;
  }

  public get elementOptions() : ElementProps {
    return this.#elementOptions;
  }
}
