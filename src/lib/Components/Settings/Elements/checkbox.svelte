<script lang="ts">
  import type { Options } from '$lib/types/settings/elements/checkbox';
  import { get } from 'svelte/store';
  import { onMount, onDestroy } from 'svelte';

  interface Props {
    options: Options;
  }

  const { options }: Props = $props();
  const { onChange, store, updater, defaultValue, label } = options;

  function getDefault(): boolean {
    if (defaultValue === undefined) return true;

    if (typeof defaultValue === 'function') {
      return defaultValue();
    } else {
      return get(defaultValue);
    }
  }

  let checkboxValue: any = $state(getDefault());

  $effect(() => {
    if (store) store.update(() => checkboxValue);
  });

  let unsubscribes: Array<() => void> = [];
  onMount(() => {
    if (updater && defaultValue) {
      const updaters = Array.isArray(updater) ? updater : [updater];

      unsubscribes = updaters.map((u) =>
        u.subscribe(async () => {
          checkboxValue = getDefault();
        })
      );
    }
  });

  onDestroy(() => {
    unsubscribes?.forEach((unsub) => unsub());
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
