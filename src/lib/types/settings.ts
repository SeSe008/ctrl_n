import type { Options as TextProps } from "$lib/types/settings/text";
import type { Options as SelectProps } from "$lib/types/settings/select";

import type { Component } from "svelte";

type ElementProps = TextProps | SelectProps;

export interface Element {
  elementType: string;
  elementOptions: ElementProps;
  changeFunction?: () => void;
}

export interface ElementComponents {
  [key: string]: Component<any>;
}
