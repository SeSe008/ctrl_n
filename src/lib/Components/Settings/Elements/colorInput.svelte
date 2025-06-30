<script lang='ts'>
  import type { Options } from "$lib/types/settings/elements/colorInput";
  import { get } from "svelte/store";

  interface Props {
    options: Options;
  }
  
  const { options }: Props = $props();
  const { label, onInput, onChange, store, defaultValue } = options;

  
  function getDefault(): string {
    if (defaultValue === undefined) return '#FFFFFF';

    if (typeof defaultValue === 'function') {
      return defaultValue();
    } else {
      return get(defaultValue);
    }
  }

  let colorValue: string = $state(getDefault());

  $effect(() => {
    if (store) store.update(() => colorValue);
  });
</script>

<label class="settings_color_input">
  {label}
  <input type="color" bind:value={colorValue} oninput={() => onInput?.(colorValue)} onchange={() => onChange?.(colorValue)} />
</label>

<style>
  .settings_color_input {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 0.25rem;
  }
</style>
