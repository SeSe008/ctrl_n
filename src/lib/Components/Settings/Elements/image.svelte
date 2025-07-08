<script lang="ts">
  import { onMount } from 'svelte';
  import type { Options } from '$lib/types/settings/elements/image';

  interface Props {
    options: Options;
  }

  const { options }: Props = $props();
  const { image, label, alt, width, height } = options;

  let img = $state<string>('');

  // when the component mounts, await the images and assign them
  onMount(async () => {
    img = await image();
  });
</script>

<div class="settings_image">
  {label}
  <img
    src={typeof img === 'string' ? img : img[0]}
    alt={alt ?? 'settings-image'}
    style="--width: {width ?? '100%'}; --height: {height ?? 'auto'}"
    />
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
    width: var(--width);
    height: var(--height);

    display: block;
    box-sizing: border-box;
    border-radius: 0.5rem;
  }
</style>
