<script lang="ts">
  import type { Options } from '$lib/types/settings/elements/group';
  import SettingsElement from '$lib/Components/Settings/settingsElement.svelte';

  interface Props {
    options: Options;
  }

  const { options }: Props = $props();
  const { objects, layout, wrap, center, background, border } = options;

  let elements = $derived(typeof objects === 'function' ? objects().elements : objects.elements);
</script>

<div
  class="settings_group {layout === 'vert' || layout === 'vertical' ? 'vert' : 'hor'}"
  style="
	       --wrap: {wrap === false ? 'nowrap' : 'wrap'};
         --center: {center ? 'center' : 'flex-start'};
         --background: {background ? 'rgb(var(--c1))' : 'transparent'};
         --border: {border ? '1px solid rgb(var(--c2))' : 'transparent'};
         --padding: {border ? '0.5em' : 0};"
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

    background-color: var(--background);

    box-sizing: border-box;
    border: var(--border);
    border-radius: 0.5em;
    padding: var(--padding);

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
