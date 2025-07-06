<script lang="ts">
  import ColorThief from 'colorthief';
  import Icon from '@iconify/svelte';
  import { onMount } from 'svelte';

  import TileManager from '$lib/Components/tileManager.svelte';
  import Settings from '$lib/Components/Settings/settings.svelte';

  import { fetchAndApplyImage } from '$lib/utils/fetchAndApplyImage';
  import { imageCredits, imageLoading } from '$lib/stores/backgroundImage';
  import { initializeTiles } from '$lib/stores/tiles';
  import { globalTiles } from '$lib/stores/tiles';

  import {
    settings,
    toggleSettings,
    isSelectingTile,
    toggleSelectingTile
  } from '$lib/stores/settings/settings';

  import { backgroundImage, getImageCategory, initBgImages } from '$lib/stores/backgroundImage';

  import { applyCssVars } from '$lib/utils/applyCssVars';

  let colorThief: ColorThief;

  const defaultCategory = 0; // Default category when none is set
  const defaultApiKeyWord = 'Sunsets'; // Default api keyword for bg-img

  const imageInterval = 5 * 60 * 1000; // When image changes - Make Customizable?
  const colors: number = 5; // Amount of colors for palette

  function nextImage() {
    fetchAndApplyImage(getImageCategory(), colors, colorThief);
  }

  let tileGrid: HTMLDivElement;
  globalTiles.subscribe((gTls) => {
    if (tileGrid) {
      const rows = gTls.managers
        .map((m) => (m.height === 0 ? 'max-content' : `${m.height}fr`))
        .join(' ');
      tileGrid.style.gridTemplateRows = rows;
    }
  });

  function stopSelectingTile(e: Event) {
    if (e.target && (e.target as HTMLElement).tagName === 'MAIN' && isSelectingTile()) {
      toggleSelectingTile();
    }
  }

  onMount(async () => {
    colorThief = new ColorThief();

    initBgImages(defaultCategory, defaultApiKeyWord, imageInterval, colors, colorThief);

    initializeTiles();
  });
</script>

<svelte:window on:click={stopSelectingTile} />

<main use:applyCssVars={$globalTiles.cssVars}>
  <img id="bg_img" alt="bg img" src={$backgroundImage} />

  <div bind:this={tileGrid} id="tiles">
    {#each $globalTiles.managers as _, i (i)}
      <TileManager id={i} />
    {/each}
  </div>
</main>

<footer>
  <div>
    {#if $imageCredits}
      <a target="_blank" href={$imageCredits.creatorUrl}>{$imageCredits.creator}</a>
      <a target="_blank" href={$imageCredits.licenseUrl}>{$imageCredits.license}</a>
    {/if}
  </div>
  <div>
    <button onclick={nextImage}>
      {#if !$imageLoading}
        <Icon icon="mdi:image-outline" />
      {:else}
        <Icon icon="line-md:loading-alt-loop" />
      {/if}
    </button>
    <button onclick={() => toggleSettings(0, 0)}>
      <Icon icon="mdi:settings-outline" />
    </button>
  </div>
  <div><a target="_blank" href="privacy">Privacy and Credit</a></div>
</footer>

{#if $settings.enabled}
  <Settings />
{/if}

<style>
  :global {
    :root {
      /* Global Page Vars */
      --c1: 255, 255, 255;
      --c2: 0, 0, 0;
      --c3: 150, 150, 150;
      --c4: 100, 100, 100;
      --c5: 50, 50, 50, 50;

      --tileContainerPadding: 0rem;

      /* Tile-Specific Vars */
      --o1: 0.3;
      --o2: 0.7;

      --tileBorder: unset;
      --tileBorderRadius: 0.5rem;

      --tileWidth: 100%;
      --tileHorPos: center;

      --tileHeight: 100%;
      --tileVerPos: flex-start;
    }

    html,
    body {
      height: 100%;
      width: 100%;
      margin: 0;
      padding: 0;
      overflow: hidden;
    }

    body {
      position: absolute;
      inset: 0;

      display: grid;
      grid-template-areas:
        'main aside'
        'footer aside';
      grid-template-columns: 1fr auto;
      grid-template-rows: auto min-content;
      grid-auto-flow: column;

      box-sizing: border-box;
      gap: 0.5rem;
      padding: 0.5rem 1rem;

      font-family: 'Quicksand', sans-serif;

      background-color: rgb(var(--c1));

      transition:
        background-image 1s ease-in-out,
        background-size 0s;
    }

    body * {
      font-family: inherit;
    }

    ::-moz-selection {
      color: rgb(var(--c1));
      background-color: rgb(var(--c4));
    }

    ::selection {
      color: rgb(var(--c1));
      background-color: rgb(var(--c4));
    }

    *::-webkit-scrollbar {
      width: 8px;
    }

    *::-webkit-scrollbar-track {
      background: transparent;
      box-shadow: none;
    }

    *::-webkit-scrollbar-corner {
      background-color: transparent;
    }

    *::-webkit-scrollbar-thumb {
      background-color: rgba(var(--c2), 0.5);
      border-radius: 4px;
      border: 2px solid transparent;
      background-clip: content-box;
    }
  }

  main {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;

    width: 100%;
    height: 100%;

    box-sizing: border-box;
    overflow: hidden;
  }

  #bg_img {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;

    object-fit: cover;
    object-position: center;

    z-index: -100;
  }

  #tiles {
    height: 100%;
    width: 100%;
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.5rem;

    overflow: hidden;

    pointer-events: none;

    padding: var(--tileContainerPadding, 0);
    box-sizing: border-box;
  }

  footer {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: minmax(max-content, 1fr);
    gap: 0.25rem;

    justify-items: center;
    align-items: stretch;

    font-size: 0.75em;
    font-weight: bold;
  }

  footer div:first-child {
    justify-self: flex-start;
  }

  footer div:last-child {
    justify-self: flex-end;
  }

  footer div {
    display: flex;
    align-items: center;
    gap: 0.2em;

    color: rgba(var(--c5), 0.7);

    padding: 0;
    overflow: hidden;
    height: 100%;

    background-color: rgba(var(--c1), var(--o2));
    border-radius: 0.25rem;
  }

  footer a {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.25rem;
    height: 100%;

    border-radius: 0.25rem;

    background-color: transparent;
    color: inherit;

    text-decoration: none;
    font-size: calc(8px + 0.75vmin);

    cursor: pointer;

    transition: background-color 0.2s linear;
  }

  footer a:hover {
    background-color: rgb(var(--c1));
  }

  footer button {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;

    border: none;
    border-radius: 0.25rem;
    background-color: transparent;
    color: inherit;

    font-size: calc(8px + 0.75vmin);
    aspect-ratio: 1 / 1;

    cursor: pointer;

    transition: background-color 0.2s linear;
  }

  footer button:hover {
    background-color: rgb(var(--c1));
  }
</style>
