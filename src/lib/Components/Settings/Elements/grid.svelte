<script lang="ts">
  import type { Options } from '$lib/types/settings/elements/grid';
  import { elementComponents } from '$lib/constants/settings';
  import { onDestroy, onMount } from 'svelte';

  interface Props {
    options: Options;
  }

  const { options }: Props = $props();
  const { columns, rows, objects, updater } = options;

  let elements = $state(typeof objects === 'function' ? objects().elements : objects.elements);

  let unsubscribes: Array<() => void> = [];
  onMount(() => {
    if (updater && typeof objects === 'function') {
      const updaters = Array.isArray(updater) ? updater : [updater];

      unsubscribes = updaters.map((u) =>
        u.subscribe(() => {
          elements = objects().elements;
        })
      );
    }
  });

  onDestroy(() => {
    unsubscribes?.forEach((unsub) => unsub());
  });
</script>

<div class="settings_grid" style="--columns: {columns}; --rows: {rows};">
  {#each elements as element, i (i)}
    {#if elementComponents[element.elementType]}
      {@const Comp = elementComponents[element.elementType]}
      <Comp options={element.elementOptions} />
    {/if}
  {/each}
</div>

<style>
  .settings_grid {
    display: grid;
    grid-template-columns: repeat(var(--columns), 1fr);
    grid-template-rows: repeat(var(--rows), 1fr);
    gap: 0.5rem;
    max-width: 100%;
    overflow: hidden;
  }
</style>
