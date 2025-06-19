import type { Readable, Writable } from 'svelte/store';

export interface SelectOption {
  label: string;
  icon?: string;
  value?: any;
}

export interface Options {
  selectOptions: SelectOption[] | (() => SelectOption[]);
  onChange?: (_value: any) => void;
  store?: Writable<any>;
  defaultValue?: Readable<any> | (() => any);
  label?: string;
}
