import type { Readable, Writable } from 'svelte/store';

export interface Options {
  min: number;
  max: number;
  step: number;
  store?: Writable<any>;
  onInput?: (_value: number) => void;
  defaultValue?: Readable<number> | (() => number);
  specialValues?: Record<number, string>;
  valueLabel?: string;
  unit?: string;
  label?: string;
}
