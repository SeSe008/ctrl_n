import { get, writable } from 'svelte/store';

type Errors = Array<{
  code: string;
  message: string;
}>;

export const errors = writable<Errors>([]);

export function setErrors(errorsResp: Errors) {
  errors.set(errorsResp);
}

export function getErrors(): Errors {
  return get(errors);
}

export function clearErrors() {
  errors.set([]);
}

export function addError(code: string, message: string) {
  errors.update((current) => [...current, { code, message }]);

  setTimeout(() => errors.update((current) => current.slice(1)), 5_000);
}
