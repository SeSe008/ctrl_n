import type { Readable, Writable } from 'svelte/store';

export interface Options {
  label: any;
  onChange?: (_value: boolean) => void;
  store?: Writable<any>;
  defaultValue?: Readable<boolean> | (() => boolean);
}
