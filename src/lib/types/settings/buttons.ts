interface ButtonOptions {
  text?: string;
  icon?: string;
  onClick: (_value: any) => any;
  value?: any;
}

export interface Options {
  buttons: ButtonOptions[];
  label?: string;
}
