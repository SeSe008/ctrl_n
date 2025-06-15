<script lang="ts">
  import { elementComponents } from '$lib/constants/settings';
  import type { Options } from '$lib/types/settings/elements/group';

  interface Props {
    options: Options;
  }

  const { options }: Props = $props();
  const { objects, layout, wrap, center } = options;

  let flexWrap = $state(true);
  if (wrap !== undefined && !wrap) flexWrap = false;
</script>

<div class={`settings_group ${layout === 'vert' || layout === 'vertical' ? 'vert' : 'hor'}`}
     style="
	    --wrap: {flexWrap ? 'wrap' : 'nowrap'};
	    --center: {center ? 'center' : 'flex-start'};
	    ">
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
