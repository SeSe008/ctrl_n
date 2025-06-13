<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import type { Options } from '$lib/types/settings/elements/image';
  import type { Image } from '$lib/types/backgroundImage';

  interface Props {
    options: Options;
  }

  const { options }: Props = $props();
  const { image, updater, label } = options;

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
    unsubscribes?.forEach((unsub) => unsub());
  });
</script>

<div class="settings_image">
  {label}
  <img src={typeof img === 'string' ? img : img[0]} alt="Background" />
</div>

<style>
  .settings_image {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    width: auto;
  }

  .settings_image img {
    width: 100%;
    height: auto;
    display: block;
    box-sizing: border-box;
    border-radius: 0.5rem;
  }
</style>
