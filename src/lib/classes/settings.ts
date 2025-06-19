import type { Element, ElementProps } from '$lib/types/settings/settings';
import type { Readable } from 'svelte/store';

export class SettingsSection {
  #elements: Element[];

  constructor(elements?: Element[]) {
    this.#elements = elements || [];
    return this;
  }

  public appendElement(
    type: string,
    options: ElementProps,
    condition?: Readable<boolean> | (() => boolean),
    updater?: Readable<any> | Array<Readable<any>>
  ) {
    this.#elements.push(new SettingsElement(type, options, condition, updater));
    return this;
  }

  public get elements(): Element[] {
    return this.#elements;
  }

  public getElement(id: number): Element {
    return this.#elements[id];
  }
}

export class SettingsElement implements Element {
  #elementType: string;
  #elementOptions: ElementProps;
  #condition?: Readable<boolean> | (() => boolean);
  #updater?: Readable<any> | Array<Readable<any>>;

  constructor(
    type: string,
    options: ElementProps,
    condition?: Readable<boolean> | (() => boolean),
    updater?: Readable<any> | Array<Readable<any>>
  ) {
    this.#elementType = type;
    this.#elementOptions = options;
    this.#condition = condition;
    this.#updater = updater;
  }

  public get elementType(): string {
    return this.#elementType;
  }

  public get elementOptions(): ElementProps {
    return this.#elementOptions;
  }

  public get condition(): Readable<boolean> | (() => boolean) {
    return this.#condition ?? (() => true);
  }

  public get updater(): (Readable<any> | Array<Readable<any>>) | undefined {
    return this.#updater;
  }
}
