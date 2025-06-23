<script lang="ts">
  import ColorThief from 'colorthief';
  import Icon from '@iconify/svelte';
  import { onMount } from 'svelte';

  import TileManager from '$lib/Components/tileManager.svelte';
  import Settings from '$lib/Components/Settings/settings.svelte';

  import { applyImage } from '$lib/utils/useImage';
  import { exifData } from '$lib/stores/exif';
  import { initializeTiles } from '$lib/stores/tiles';
  import { globalTiles } from '$lib/stores/tiles';
  import { settings, toggleSettings } from '$lib/stores/settings/settings';

  import {
    backgroundImage,
    getBackgroundImage,
    getImageCategories,
    getImageCategory,
    initBgImages
  } from '$lib/stores/backgroundImage';
  import type { BgImageCategory } from '$lib/types/backgroundImage';

  let colorThief: ColorThief;

  const defaultCategory = 0; // Default category when none is set
  const defaultCategories: Array<BgImageCategory> = [
    {
      label: 'Animals',
      icon: 'lucide:squirrel',
      path: 'backgrounds/animals'
    },
    {
      label: 'Space',
      icon: 'lucide:rocket',
      path: 'backgrounds/space'
    }
  ];
  const imageInterval = 5 * 60 * 1000; // When image changes - Make Customizable?
  const colors: number = 5; // Amount of colors for palette

  function nextImage() {
    applyImage(
      getImageCategories()[getImageCategory()].images,
      getBackgroundImage(),
      colors,
      colorThief
    );
  }

  let tileGrid: HTMLDivElement;
  globalTiles.subscribe((managers) => {
    if (tileGrid) {
      const rows = managers
        .map((m) => (m.height === 0 ? 'max-content' : `${m.height}fr`))
        .join(' ');
      tileGrid.style.gridTemplateRows = rows;
    }
  });

  onMount(async () => {
    colorThief = new ColorThief();

    initBgImages(defaultCategory, defaultCategories, imageInterval, colors, colorThief);

    initializeTiles();
  });
</script>

<main>
  <img id="bg_img" alt="bg img" src={$backgroundImage} />

  <div bind:this={tileGrid} id="tiles">
    {#each { length: $globalTiles.length } as _, i (i)}
      <TileManager id={i} />
    {/each}
  </div>

  <div id="page_info">
    {#if $exifData}
      <div>
        <a target="_blank" href={$exifData.artist[1]}>{$exifData.artist[0]}</a>
        <a target="_blank" href={$exifData.copyright[1]}>{$exifData.copyright[0]}</a>
        <a target="_blank" href={$exifData.description[1]}>{$exifData.description[0]}</a>
      </div>
    {/if}
    <div>
      <button onclick={nextImage}>
        <Icon icon="mdi:image-outline" />
      </button>
      <button onclick={() => toggleSettings(0, 0)}>
        <Icon icon="mdi:settings-outline" />
      </button>
    </div>
    <div><a target="_blank" href="privacy">Privacy and Credit</a></div>
  </div>
</main>

{#if $settings.enabled}
  <Settings />
{/if}

<style>
  :global {
    :root {
      --c1: 255, 255, 255;
      --c2: 0, 0, 0;
      --c3: 150, 150, 150;
      --c4: 100, 100, 100;
      --c5: 50, 50, 50, 50;

      /* Tile-Specific vars */
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
    xc body {
      height: 100%;
      width: 100%;
      margin: 0;
      padding: 0;
    }

    body {
      display: flex;
      flex-direction: row;
      position: absolute;
      inset: 0;

      margin: 0;
      padding: 0;
      box-sizing: border-box;
      overflow: hidden;

      font-family: 'Quicksand', sans-serif;

      background-color: rgb(var(--c1));

      transition:
        background-image 1s ease-in-out,
        background-size 0s;
    }

    body > * {
      flex-grow: 1;
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

    padding: 0.5rem 1rem;
    box-sizing: border-box;
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
    overflow-x: hidden;
    overflow-y: visible;
  }

  #page_info {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: minmax(max-content, 1fr);
    gap: 0.25rem;

    font-size: 0.75em;
    font-weight: bold;

    justify-items: center;
    align-items: stretch;
  }

  #page_info div:first-child {
    justify-self: flex-start;
  }

  #page_info div:last-child {
    justify-self: flex-end;
  }

  #page_info div {
    display: flex;
    align-items: center;
    gap: 0.2em;

    color: rgb(var(--c1));
    padding: 0;

    background-color: rgba(var(--c2), var(--o2));
    border-radius: 0.25rem;
  }

  #page_info a {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 0.25rem;
    height: 100%;

    border-radius: 0.25rem;

    background-color: transparent;
    color: rgb(var(--c1));

    text-decoration: none;
    font-size: calc(8px + 0.75vmin);

    cursor: pointer;

    transition: background-color 0.2s linear;
  }

  #page_info a:hover {
    background-color: rgb(var(--c2));
  }

  #page_info button {
    display: flex;
    align-items: center;
    justify-content: center;

    border: none;
    border-radius: 0.25rem;
    background-color: transparent;

    color: rgb(var(--c1));

    font-size: calc(8px + 0.75vmin);
    aspect-ratio: 1 / 1;

    cursor: pointer;

    transition: background-color 0.2s linear;
  }

  #page_info button:hover {
    background-color: rgb(var(--c2));
  }
</style>
