import type { Element, ElementProps } from '$lib/types/settings/settings';
import type { Readable } from 'svelte/store';

export class SettingsSection {
  #elements: Element[];

  constructor(elements?: Element[]) {
    this.#elements = elements || [];
    return this;
  }

  public appendElement(type: string, options: ElementProps, condition?: Readable<boolean> | (() => boolean)) {
    this.#elements.push(new SettingsElement(type, options, condition));
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
  #condition?: Readable<boolean> | (() => boolean)

  constructor(type: string, options: ElementProps, condition?: Readable<boolean> | (() => boolean)) {
    this.#elementType = type;
    this.#elementOptions = options;
    this.#condition = condition;
  }

  public get elementType(): string {
    return this.#elementType;
  }

  public get elementOptions(): ElementProps {
    return this.#elementOptions;
  }

  public get condition() : (Readable<boolean> | (() => boolean)) {
    return  this.#condition ?? (() => true);
  }
}
