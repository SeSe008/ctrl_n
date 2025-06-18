import type { Readable } from "svelte/store";

export interface Options {
  html: string | (() => string);
  css?: string | (() => string);
  updater?: Readable<any> | Array<Readable<any>>;
}
