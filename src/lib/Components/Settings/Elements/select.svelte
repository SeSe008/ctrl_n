<script lang="ts">
  import Icon from '@iconify/svelte';
  import type { Options, SelectOption } from '$lib/types/settings/elements/select';
  import { get } from 'svelte/store';
  import { onMount, onDestroy } from 'svelte';

  interface Props {
    options: Options;
  }

  const { options }: Props = $props();
  const { selectOptions, store, updater, onChange, defaultValue, label } = options;

  function initOptions() {
    if (typeof selectOptions === 'function') {
      return selectOptions();
    } else {
      return selectOptions;
    }
  }

  function getDefault(): any {
    if (defaultValue === undefined) return 0;

    if (typeof defaultValue === 'function') {
      return defaultValue();
    } else {
      return get(defaultValue);
    }
  }

  let optionsList: Array<SelectOption> = $state(initOptions());

  let selectValue: any = $state(getDefault());

  $effect(() => {
    if (store) store.update(() => selectValue);
  });

  let unsubscribes: Array<() => void> = [];
  onMount(() => {
    if (updater) {
      const updaters = Array.isArray(updater) ? updater : [updater];

      unsubscribes = updaters.map((u) =>
        u.subscribe(async () => {
          optionsList = initOptions();
          if (defaultValue) selectValue = getDefault();
        })
      );
    }
  });

  onDestroy(() => {
    unsubscribes?.forEach((unsub) => unsub());
  });
</script>

<div class="settings_select">
  {#if label}
    <span>{label}</span>
  {/if}

  <select bind:value={selectValue} onchange={() => onChange?.(selectValue)}>
    {#each optionsList as selectOption, i (i)}
      <option value={selectOption.value ? selectOption.value : i}>
        {#if selectOption.icon}
          <Icon icon={selectOption.icon} />
        {/if}
        {selectOption.label}
      </option>
    {/each}
  </select>
</div>

<style>
  .settings_select {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;

    stroke-width: 3px;
  }
</style>
