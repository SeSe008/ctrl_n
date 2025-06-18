<script lang="ts">
  import type { Options } from '$lib/types/settings/elements/group';
  import SettingsElement from '$lib/Components/Settings/settingsElement.svelte';

  interface Props {
    options: Options;
  }

  const { options }: Props = $props();
</script>

<div
  class="settings_group {options.layout === 'vert' || options.layout === 'vertical'
    ? 'vert'
    : 'hor'}"
  style="--wrap: {options.wrap === false ? 'nowrap' : 'wrap'}; --center: {options.center
    ? 'center'
    : 'flex-start'};"
>
  {#each options.objects.elements as element, i (i)}
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
