import type {
  TextProps,
  SelectProps,
  ButtonProps,
  RangeProps,
  TextInputProps,
  ColorInputProps,
  CheckboxProps,
  ImageProps,
  GroupProps,
  GridProps,
  CustomHTMLProps
} from '$lib/types/settings/elements';

import type { Component } from 'svelte';
import type { Readable } from 'svelte/store';

export interface Settings {
  enabled: boolean;
  selectedManager: number;
  selectedTile: number;
}

export type ElementProps =
  | TextProps
  | SelectProps
  | ButtonProps
  | RangeProps
  | TextInputProps
  | ColorInputProps
  | CheckboxProps
  | ImageProps
  | GroupProps
  | GridProps
  | CustomHTMLProps;

export interface Element {
  elementType: string;
  elementOptions: ElementProps;
  condition?: Readable<boolean> | (() => boolean);
  updater?: Readable<any> | Array<Readable<any>>
}

export interface ElementComponents {
  [key: string]: Component<any>;
}
