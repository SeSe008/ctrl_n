<script lang="ts">
  import type { Options } from '$lib/types/settings/elements/grid';
  import { elementComponents } from '$lib/constants/settings';
  import { onDestroy, onMount } from 'svelte';

  interface Props {
    options: Options;
  }

  const { options }: Props = $props();
  const { columns, objects, updater } = options;

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

<div class="settings_grid" style="--columns: {columns};">
  {#each elements as element, i (i)}
    {#if elementComponents[element.elementType]}
      {@const Comp = elementComponents[element.elementType]}
      <Comp options={element.elementOptions} />
    {/if}
  {/each}
</div>

<style>
  .settings_grid {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    max-width: 100%;
    overflow: hidden;
  }

  :global(.settings_grid > *) {
    flex-basis: calc(100% / var(--columns));
    flex-grow: 0;
  }
</style>
