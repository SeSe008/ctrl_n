import type { Readable } from "svelte/store";

interface SelectOption {
  label: string;
  icon?: string;
  value?: any;
}

export interface Options {
  selectOptions: SelectOption[];
  onChange: (_value: any) => void;
  defaultValue?: Readable<any>;
  label?: string;
}

