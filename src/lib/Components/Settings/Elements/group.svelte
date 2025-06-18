<script lang="ts">
  import type { Options } from '$lib/types/settings/elements/group';
  import SettingsElement from '$lib/Components/Settings/settingsElement.svelte';
  import { onDestroy, onMount } from 'svelte';
  import type { SettingsSection } from '$lib/classes/settings';

  interface Props {
    options: Options;
  }

  let { options }: Props = $props();

  let elements = $derived(
    typeof options.objects === 'function' ? options.objects().elements : options.objects.elements
  );

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

<div
  class="settings_group {options.layout === 'vert' || options.layout === 'vertical'
    ? 'vert'
    : 'hor'}"
  style="--wrap: {options.wrap === false ? 'nowrap' : 'wrap'}; --center: {options.center
    ? 'center'
    : 'flex-start'};"
>
  {#each elements as element, i (i)}
    <SettingsElement {element} />
  {/each}
</div>

<style>
  .settings_group {
    display: flex;
    width: 100%;
    gap: 0.5rem;

    flex-wrap: var(--wrap);
    justify-content: var(--center);
    align-items: var(--center);
  }

  :global(.settings_group > *) {
    justify-content: var(--center);
    align-items: var(--center);
  }

  .vert {
    flex-direction: column;
  }

  .hor {
    flex-direction: row;
  }

  :global(.hor > *) {
    width: max-content !important;
  }
</style>
