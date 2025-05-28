import type { Readable } from "svelte/store";

export interface Options {
  images: () => string[] | Promise<string[]>;
  columns: number;
  updater?: Readable<any>;
  toggle?: boolean;
  onToggle?: (_value: string) => any;
}
