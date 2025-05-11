export interface Options {
  min: number;
  max: number;
  step: number;
  onInput: (_value: number) => void;
  defaultValue?: () => number;
  specialValues?: Record<number, string>;
  valueLabel?: string;
  unit?: string;
  label?: string;
}

