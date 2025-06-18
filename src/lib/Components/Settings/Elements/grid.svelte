<script lang="ts">
  import type { Options } from '$lib/types/settings/elements/grid';
  import type { SettingsSection } from '$lib/classes/settings';
  import SettingsElement from '$lib/Components/Settings/settingsElement.svelte';

  import { onDestroy, onMount } from 'svelte';

  interface Props {
    options: Options;
  }

  const { options }: Props = $props();

  let elements = $state(typeof options.objects === 'function' ? options.objects().elements : options.objects.elements);

  let unsubscribes: Array<() => void> = [];
  onMount(() => {
    if (options.updater && typeof options.objects === 'function') {
      const updaters = Array.isArray(options.updater) ? options.updater : [options.updater];

      unsubscribes = updaters.map((u) =>
        u.subscribe(() => {
	  elements = (options.objects as () => SettingsSection)().elements;
        })
      );
    }
  });

  onDestroy(() => {
    unsubscribes?.forEach((unsub) => unsub());
  });
</script>

<div class="settings_grid" style="--columns: {options.columns};">
  {#each elements as element, i (i)}
    <SettingsElement element={element} />
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
