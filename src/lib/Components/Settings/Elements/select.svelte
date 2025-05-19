<script lang="ts">
  import Icon from '@iconify/svelte';
  import type { Options } from '$lib/types/settings/elements/select';
  import { readable, get } from 'svelte/store';
  import type { Readable } from 'svelte/store';
  
  interface Props {
    options: Options;
  }

  const { options }: Props = $props();
  const { selectOptions, onChange, defaultValue, label } = options;

  const _default: Readable<number> = defaultValue ?? readable(0);
  
  let selected: number = $state(get(_default));
</script>

<div class="settings_select">
  {#if label}
    <span>{label}</span>
  {/if}
  <select bind:value={selected} onchange={() => onChange(selected)}>
    {#each selectOptions as selectOption, i (i)}
      <option value={(selectOption.value) ? selectOption.value : i}>
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
    gap: .5rem;

    stroke-width: 3px;
  }
</style>
