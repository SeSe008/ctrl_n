interface SelectOptions {
  label: string;
  icon?: string;
  value?: any;
}

export interface Options {
  selectOptions: SelectOptions[];
  changeFunction: (_value: any, _: HTMLSelectElement) => void;
  defaultValue?: () => any;
  label?: string;
}

