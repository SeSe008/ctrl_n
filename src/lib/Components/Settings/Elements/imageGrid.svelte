<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import type { Options } from '$lib/types/settings/elements/imageGrid';
  import type { Images } from '$lib/types/backgroundImage';

  interface Props {
    options: Options;
  }
  
  const { options }: Props = $props();
  const { images, columns, updater, toggle, onToggle, label } = options;

  let imgs = $state<Images>([]);

  // when the component mounts, await the images and assign them
  onMount(async () => {
    imgs = await images();
  });

  
  let unsubscribes: Array<() => void> = [];
  onMount(() => {
    if (updater) {
      const updaters = Array.isArray(updater) ? updater : [updater];

      unsubscribes = updaters.map((u) =>
        u.subscribe(async () => {
          imgs = await images();
        })
      );
    }
  });

  onDestroy(() => {
    unsubscribes?.forEach(unsub => unsub());
  });
</script>

<div
  id="settings_image_grid"
  style="--columns: {columns};"
  >
  {#each imgs as img, i (i)}
    <div class="image">
      <img src={typeof img === 'string' ? img : img[0]} alt="Background" />
      {#if toggle}
	<div>
	  <input id='img_gri_{i}' type="checkbox" checked={typeof img === 'string' ? true : img[1]} onclick={() => onToggle?.(i)} />
	  <label for='img_gri_{i}'>{label}</label>
	</div>
      {:else}
	<div>{label}</div>
      {/if}
    </div>
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

  .image {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: auto;
  }

  .image img {
    width: 100%;
    height: auto;
    display: block;
    box-sizing: border-box;
    border-radius: .5rem;
  }

  .image div {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
</style>
