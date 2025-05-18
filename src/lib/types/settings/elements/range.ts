import type { Readable } from "svelte/store";

export interface Options {
  min: number;
  max: number;
  step: number;
  onInput: (_value: number) => void;
  defaultValue?: Readable<any>;
  specialValues?: Record<number, string>;
  valueLabel?: string;
  unit?: string;
  label?: string;
}

