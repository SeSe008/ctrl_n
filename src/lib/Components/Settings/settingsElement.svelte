<script lang="ts">
  import { elementComponents } from "$lib/constants/settings";
  import type { Element } from "$lib/types/settings/settings";
  import { onDestroy } from "svelte";

  interface Props {
    element: Element;
  }

  let { element }: Props = $props();

  let enabled = $state<boolean>(true);
  let unsubscribe: Function;
  
  if (typeof element.condition === 'function') {
    enabled = element.condition();
  } else if (element.condition !== undefined) {
    unsubscribe = element.condition.subscribe(cond => {
      enabled = cond;
    });
  }

  onDestroy(() => unsubscribe?.());
</script>

{#if elementComponents[element.elementType] && enabled}
  {@const Comp = elementComponents[element.elementType]}
  <Comp options={element.elementOptions} />
{/if}
