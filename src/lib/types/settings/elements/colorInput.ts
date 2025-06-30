import type { Readable, Writable } from "svelte/store";

export interface Options {
  label: string;
  onChange?: (_value: string) => void;
  onInput?: (_value: string) => void;
  store?: Writable<any>;
  defaultValue?: Readable<string> | (() => string)
}
