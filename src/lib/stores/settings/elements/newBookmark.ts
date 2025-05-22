import { writable } from "svelte/store";

export const newBookmarkName = writable<string>();
export const newBookmarkUrl = writable<string>();
