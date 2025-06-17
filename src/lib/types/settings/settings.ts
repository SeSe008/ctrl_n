import type {
  TextProps,
  SelectProps,
  ButtonProps,
  RangeProps,
  TextInputProps,
  CheckboxProps,
  ImageProps,
  GroupProps,
  GridProps
} from '$lib/types/settings/elements';

import type { Component } from 'svelte';

export interface Settings {
  enabled: boolean;
  selectedManager?: number;
  selectedTile?: number;
}

export type ElementProps =
  | TextProps
  | SelectProps
  | ButtonProps
  | RangeProps
  | TextInputProps
  | ImageProps
  | CheckboxProps
  | GroupProps
  | GridProps;

export interface Element {
  elementType: string;
  elementOptions: ElementProps;
}

export interface ElementComponents {
  [key: string]: Component<any>;
}
