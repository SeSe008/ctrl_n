<script lang="ts">
  import { elementComponents } from '$lib/constants/settings';
  import type { Element } from '$lib/types/settings/settings';

  import { onDestroy } from 'svelte';
  import { derived } from 'svelte/store';

  interface Props {
    element: Element;
  }

  let { element }: Props = $props();

  let enabled = $state<boolean>(true);
  let unsubscribe: Function;

  if (typeof element.condition === 'function') {
    enabled = element.condition();
  } else if (element.condition !== undefined) {
    unsubscribe = element.condition.subscribe((cond) => {
      enabled = cond;
    });
  }

  onDestroy(() => unsubscribe?.());

  const updaters = Array.isArray(element.updater)
    ? element.updater
    : element.updater
      ? [element.updater]
      : [];

  const keyStore = derived(updaters, (values) => JSON.stringify(values));
</script>

{#if elementComponents[element.elementType] && enabled}
  {@const Comp = elementComponents[element.elementType]}
  {#key $keyStore}
    <Comp options={element.elementOptions} />
  {/key}
{/if}
