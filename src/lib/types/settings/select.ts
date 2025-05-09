interface SelectOption {
  label: string;
  icon?: string;
  value?: any;
}

export interface Options {
  selectOptions: SelectOption[];
  changeFunction: (_value: any, _: HTMLSelectElement) => void;
  defaultValue?: () => any;
  label?: string;
}

