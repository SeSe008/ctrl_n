<script lang="ts">
  import type { Options } from '$lib/types/settings/elements/range';
  import { get } from 'svelte/store';

  interface Props {
    options: Options;
  }
  
  const { options }: Props = $props();
  const { min, max, step, store, onInput, defaultValue, specialValues, valueLabel, unit, label } = options;

  let rangeValue: number = $state(defaultValue ? get(defaultValue) : 0);

  $effect(() => {
    if (store) store.update(() => rangeValue);
  });
</script>

<div class="settings_range">
  <span>{label}</span>
  <input type="range" bind:value={rangeValue} min={min} max={max} step={step} oninput={() => onInput?.(rangeValue)} />
  <div>
    {valueLabel}
    <span>
      {#if specialValues && specialValues[rangeValue]}
	{specialValues[rangeValue]}
      {:else}
	  {rangeValue}
          {unit}
      {/if}
    </span>
  </div>
</div>

<style>
  .settings_range {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    gap: .5rem;
  }
  
  span {
    gap: 0;
  }
</style>
