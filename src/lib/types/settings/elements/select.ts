import type { Readable, Writable } from 'svelte/store';

export interface SelectOption {
  label: string;
  icon?: string;
  value?: any;
}

export interface Options {
  selectOptions: SelectOption[] | (() => SelectOption[]);
  store?: Writable<any>;
  updater?: Readable<any> | Array<Readable<any>>;
  onChange?: (_value: any) => void;
  defaultValue?: Readable<any> | (() => any);
  label?: string;
}
