import { writable } from "svelte/store";

export const newImageUrl = writable<string>();

export const newImageCategoryName = writable<string>();
