import type { Readable, Writable } from 'svelte/store';

export interface Options {
  onChange: (_value: string) => void;
  updater?: Readable<any> | Array<Readable<any>>;
  store?: Writable<any>;
  defaultValue?: Readable<boolean> | (() => boolean);
  label?: any;
}
