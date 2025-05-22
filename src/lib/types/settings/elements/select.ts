import type { Readable, Writable } from "svelte/store";

interface SelectOption {
  label: string;
  icon?: string;
  value?: any;
}

export interface Options {
  selectOptions: SelectOption[];
  store?: Writable<any>;
  onChange?: (_value: any) => void;
  defaultValue?: Readable<any>;
  label?: string;
}

