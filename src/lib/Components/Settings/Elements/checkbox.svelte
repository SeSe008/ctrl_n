<script lang="ts">
  import type { Options } from '$lib/types/settings/elements/checkbox';
  import { get } from 'svelte/store';

  interface Props {
    options: Options;
  }

  const { options }: Props = $props();
  const { onChange, store, defaultValue, label } = options;

  function getDefault(): boolean {
    if (defaultValue === undefined) return true;

    if (typeof defaultValue === 'function') {
      return defaultValue();
    } else {
      return get(defaultValue);
    }
  }

  let checkboxValue: boolean = $state(getDefault());

  $effect(() => {
    if (store) store.update(() => checkboxValue);
  });
</script>

<label class="settings_checkbox">
  <input type="checkbox" bind:checked={checkboxValue} onchange={() => onChange?.(checkboxValue)} />
  {label}
</label>

<style>
  .settings_checkbox {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    stroke-width: 3px;
  }
</style>
