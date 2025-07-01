<script lang="ts">
  import type { Options } from '$lib/types/settings/elements/group';
  import SettingsElement from '$lib/Components/Settings/settingsElement.svelte';

  interface Props {
    options: Options;
  }

  const { options }: Props = $props();
  const { objects, layout, wrap, center } = options;
  
  let elements = $derived(
    typeof objects === 'function' ? objects().elements : objects.elements
  );
</script>

<div
  class="settings_group {layout === 'vert' || layout === 'vertical'
    ? 'vert'
    : 'hor'}"
  style="--wrap: {wrap === false ? 'nowrap' : 'wrap'}; --center: {center
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
    gap: 0.25rem;

    flex-wrap: var(--wrap);
    justify-content: var(--center);
    align-items: var(--center);

    font-size: inherit;
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
