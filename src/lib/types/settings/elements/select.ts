interface SelectOption {
  label: string;
  icon?: string;
  value?: any;
}

export interface Options {
  selectOptions: SelectOption[];
  onChange: (_value: any) => void;
  defaultValue?: () => any;
  label?: string;
}

