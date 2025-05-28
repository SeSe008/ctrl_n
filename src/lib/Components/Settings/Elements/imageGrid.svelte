<script lang="ts">
  import { onMount } from 'svelte';
  import type { Options } from '$lib/types/settings/elements/imageGrid';

  interface Props {
    options: Options;
  }
  
  const { options }: Props = $props();
  const { images, columns, updater } = options;

  let imgs = $state<string[]>([]);

  // when the component mounts, await the images and assign them
  onMount(async () => {
    imgs = await images();
  });

  if (updater) updater.subscribe(async () => {
    imgs = await images();
  });
</script>

<div
  id="settings_image_grid"
  style="--columns: {columns};"
  >
  {#each imgs as src, i (i)}
    <img src="{src}" alt="Background" />
  {/each}
</div>

<style>
  #settings_image_grid {
    display: grid;
    grid-template-columns: repeat(var(--columns), 1fr);
    gap: .5rem;
    max-width: 75%;
    margin: auto;
  }

  #settings_image_grid img {
    width: 100%;
    height: auto;
    display: block;
    box-sizing: border-box;
  }
</style>
