import type { Options as TextProps } from "$lib/types/settings/text";
import type { Options as SelectProps } from "$lib/types/settings/select";
import type { Options as ButtonsProps } from "$lib/types/settings/buttons";
import type { Options as RangeProps } from "$lib/types/settings/range";

import type { Component } from "svelte";

type ElementProps = TextProps | SelectProps | ButtonsProps | RangeProps;

export interface Element {
  elementType: string;
  elementOptions: ElementProps;
  changeFunction?: () => void;
}

export interface ElementComponents {
  [key: string]: Component<any>;
}
