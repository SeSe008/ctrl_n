import type { Readable, Writable } from 'svelte/store';

export interface Options {
  placeholder?: string;
  store?: Writable<string>;
  onInput?: (_value: string) => void;
  defaultValue?: Readable<string> | (() => string);
  label?: string;
}
