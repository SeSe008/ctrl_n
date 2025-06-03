import type { Images } from "$lib/types/backgroundImage";
import type { Readable } from "svelte/store";

export interface Options {
  images: () => Images | Promise<Images>;
  columns: number;
  updater?: Readable<any> | Array<Readable<any>>;
  toggle?: boolean;
  onToggle?: (_value: any) => any;
  label?: string;
}
