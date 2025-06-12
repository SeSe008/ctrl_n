<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import type { Options } from '$lib/types/settings/elements/image';
  import type { Image } from '$lib/types/backgroundImage';
  import { getImageCategories, getImageCategory } from '$lib/stores/backgroundImage';

  interface Props {
    options: Options;
  }
  
  const { options }: Props = $props();
  const { image, updater, toggle, onToggle, label } = options;

  let img = $state<Image>('');

  // when the component mounts, await the images and assign them
  onMount(async () => {
    img = await image();
  });

  let unsubscribes: Array<() => void> = [];
  onMount(() => {
    if (updater) {
      const updaters = Array.isArray(updater) ? updater : [updater];

      unsubscribes = updaters.map((u) =>
        u.subscribe(async () => {
          img = await image();
        })
      );
    }
  });

  onDestroy(() => {
    unsubscribes?.forEach(unsub => unsub());
  });
</script>

<div
  class="settings_image"
  >
  <img src={typeof img === 'string' ? img : img[0]} alt="Background" />
  {#if toggle}
    <div>
      <input type="checkbox" checked={typeof img === 'string' ? true : img[1]} onclick={() => onToggle?.()} />
      <span>{label}</span>
    </div>
  {:else}
    <div>{label}</div>
  {/if}
</div>

<style>
  .settings_image {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: .5rem;
    width: auto;
  }  

  .settings_image img {
    width: 100%;
    height: auto;
    display: block;
    box-sizing: border-box;
    border-radius: .5rem;
  }

  .settings_image div {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
</style>
