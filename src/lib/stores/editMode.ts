import { writable } from 'svelte/store';

export const editMode = writable<boolean>(false);

export function toggleEditMode() {
  editMode.update((curr) => !curr);
}
