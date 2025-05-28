interface ButtonOptions {
  text?: string;
  icon?: string;
  onClick: () => any;
  value?: any;
}

export interface Options {
  buttons: ButtonOptions[];
  label?: string;
}
