import { writable } from "svelte/store";

export const clockType = writable<string>("digital");

export function setClockType(type: string) {
  clockType.set(type);
  window.localStorage.setItem("clockType", type);
}

export function initClockType() {
  clockType.set(window.localStorage.getItem("clockType") || "digital");
}
