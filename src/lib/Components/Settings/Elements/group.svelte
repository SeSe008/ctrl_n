<script lang="ts">
  import { elementComponents } from '$lib/constants/settings';
  import type { Options } from '$lib/types/settings/elements/group';

  interface Props {
    options: Options;
  }

  const { options }: Props = $props();
  const { objects, layout } = options;
</script>

<div class={`settings_group ${layout === 'vert' || layout === 'vertical' ? 'vert' : 'hor'}`}>
  {#each objects.elements as element, i (i)}
    {#if elementComponents[element.elementType]}
      {@const Comp = elementComponents[element.elementType]}
      <Comp options={element.elementOptions} />
    {/if}
  {/each}
</div>

<style>
  .settings_group {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .vert {
    flex-direction: column;
  }

  .hor {
    flex-direction: row;
    align-items: center;
  }

  :global(.hor > *) {
    width: max-content !important;
  }
</style>
