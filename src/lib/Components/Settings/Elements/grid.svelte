<script lang="ts">
  import type { Options } from '$lib/types/settings/elements/grid';
  import SettingsElement from '$lib/Components/Settings/settingsElement.svelte';

  interface Props {
    options: Options;
  }

  let { options }: Props = $props();

  let elements = $derived(
    typeof options.objects === 'function'
      ? options.objects().elements
      : options.objects.elements
  );
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

    font-size: inherit;
  }

  :global(.settings_grid > *) {
    flex-basis: calc(100% / var(--columns));
    flex-grow: 0;
  }
</style>
