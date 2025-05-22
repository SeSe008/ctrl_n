<script lang="ts">
  import { elementComponents } from "$lib/constants/settings";
  import type { Options } from "$lib/types/settings/elements/group";
  
  interface Props {
    options: Options;
  }
  
  const { options }: Props = $props();
</script>

<div class={`settings_group ${options.layout === 'vert' || options.layout === 'vertical' ? 'vert' : 'hor'}`}>
  {#each options.elements as element, i (i) }
    {#if elementComponents[element.elementType]}
      {@const Comp = elementComponents[element.elementType]}
      <Comp options={element.elementOptions} /> 
    {/if}
  {/each}
</div>

<style>
  .settings_group {
    display: flex;
    gap: .5rem;
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
