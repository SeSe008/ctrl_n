import type { Options as TextProps } from '$lib/types/settings/elements/text';
import type { Options as SelectProps } from '$lib/types/settings/elements/select';
import type { Options as ButtonsProps } from '$lib/types/settings/elements/buttons';
import type { Options as RangeProps } from '$lib/types/settings/elements/range';
import type { Options as TextInputProps } from '$lib/types/settings/elements/textInput';
import type { Options as GroupProps } from '$lib/types/settings/elements/group';
import type { Options as ImageGridProps } from '$lib/types/settings/elements/imageGrid';

import type { Component } from 'svelte';

export interface Settings {
  enabled: boolean;
  selectedManager?: number;
  selectedTile?: number;
}

export type ElementProps = TextProps | SelectProps | ButtonsProps | RangeProps | TextInputProps | GroupProps | ImageGridProps;

export interface Element {
  elementType: string;
  elementOptions: ElementProps;
}

export interface ElementComponents {
  [key: string]: Component<any>;
}
