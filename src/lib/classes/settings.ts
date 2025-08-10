import type { Element, ElementProps } from '$lib/types/settings/settings';
import type { Readable } from 'svelte/store';

export class SettingsSection {
  #elements: Element[];

  constructor(elements?: Element[]) {
    this.#elements = elements || [];
    return this;
  }

  appendElement(element: Element) {
    this.#elements.push(element);
    return this;
  }

  appendElements(elements: Element[]) {
    this.#elements.push(...elements);
    return this;
  }

  get elements(): Element[] {
    return this.#elements;
  }

  getElement(idx: number): Element {
    return this.#elements[idx];
  }
}

export class SettingsElement implements Element {
  #elementType: string;
  #elementOptions: ElementProps;
  #condition?: Readable<boolean> | (() => boolean);
  #updater?: Readable<any> | Array<Readable<any>>;

  constructor(
    elementType: string,
    elementOptions: ElementProps,
    condition?: Readable<boolean> | (() => boolean),
    updater?: Readable<any> | Array<Readable<any>>
  ) {
    this.#elementType = elementType;
    this.#elementOptions = elementOptions;
    this.#condition = condition;
    this.#updater = updater;

    return this;
  }

  get elementType(): string {
    return this.#elementType;
  }

  get elementOptions(): ElementProps {
    return this.#elementOptions;
  }

  get condition(): Readable<boolean> | (() => boolean) {
    return this.#condition ?? (() => true);
  }

  get updater(): (Readable<any> | Array<Readable<any>>) | undefined {
    return this.#updater;
  }

  setType(type: string): SettingsElement {
    this.#elementType = type;
    return this;
  }

  withOptions(options: ElementProps): SettingsElement {
    this.#elementOptions = options;
    return this;
  }

  addCondition(condition: Readable<boolean> | (() => boolean)): SettingsElement {
    this.#condition = condition;
    return this;
  }

  addUpdater(updater: Readable<any> | Array<Readable<any>>): SettingsElement {
    this.#updater = updater;
    return this;
  }
}
