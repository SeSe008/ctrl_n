import type { Readable, Writable } from 'svelte/store';

export interface Options {
  placeholder?: string;
  store?: Writable<any>;
  onInput?: (_value: string) => void;
  defaultValue?: Readable<any>;
  label?: any;
}
