import type { Options as TextProps } from "$lib/types/settings/elements/text";
import type { Options as SelectProps } from "$lib/types/settings/elements/select";
import type { Options as ButtonsProps } from "$lib/types/settings/elements/buttons";
import type { Options as RangeProps } from "$lib/types/settings/elements/range";

import type { Component } from "svelte";

export interface Settings {
  enabled: boolean;
  selectedManager?: number;
  selectedTile?: number;
}

type ElementProps = TextProps | SelectProps | ButtonsProps | RangeProps;

export interface Element {
  elementType: string;
  elementOptions: ElementProps;
  changeFunction?: () => void;
}

export interface ElementComponents {
  [key: string]: Component<any>;
}
