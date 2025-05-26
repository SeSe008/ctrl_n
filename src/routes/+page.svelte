<script lang="ts"> 
  import ColorThief from 'colorthief';
  import Icon from '@iconify/svelte';
  import { onMount } from 'svelte';
  
  import TileManager from '$lib/Components/tileManager.svelte';
  import Settings from '$lib/Components/Settings/settings.svelte';
  
  import { applyImage } from '$lib/utils/useImage';
  import { exifData } from '$lib/stores/exif';
  import { initializeTiles } from '$lib/stores/tiles';
  import { editMode, toggleEditMode } from '$lib/stores/editMode';
  import { globalTiles, addManager, removeManager } from '$lib/stores/tiles';

  import { backgroundImage, getBackgroundImage, getImages, initBgImages } from '$lib/stores/backgroundImage';
  
  let colorThief: ColorThief;
  
  const defaultCategory = 'animals'; // Default category when none is set
  const imageInterval = 5 * 60 * 1000; // When image changes - Make Customizable?
  const colors: number = 5; // Amount of colors for palette

  const imageCategories: [string, string, string][] = [
    ['Animals', 'lucide:squirrel', 'backgrounds/animals'],
    ['Space', 'material-symbols:planet-outline', 'backgrounds/space']
  ];
  
  function nextImage() {
    applyImage(
      getImages(),
      getBackgroundImage(),
      colors,
      colorThief
    );
  }

  let tileGrid: HTMLDivElement;
  globalTiles.subscribe(managers => {
    if (tileGrid) {
      const rows = managers
	    .map(m => m.height === 0 ? 'max-content' : `${m.height}fr`)
	    .join(' ');
      tileGrid.style.gridTemplateRows = rows;
    }
  });

  onMount(async () => {
    colorThief = new ColorThief();

    initBgImages(defaultCategory, imageInterval, colors, colorThief);

    initializeTiles();
  });
</script>

<img id="bg_img" alt="bg img" src={$backgroundImage} />

<div bind:this={tileGrid} id="tiles">
  {#each {length: $globalTiles.length} as _, i (i) }
    <TileManager id={i} />
  {/each}
</div>

<div id="pageControl">
  <button onclick={nextImage}>
    <Icon icon="gg:image" />
  </button>
  <button onclick={toggleEditMode}>
    <Icon icon="material-symbols:edit-outline" />
  </button>
  <select>
    {#each imageCategories as category (category[2])}
      <option value={category[2]}>
	<Icon icon={category[1]} />
	{category[0]}
      </option>
    {/each}
  </select>
  {#if $editMode}
    <button onclick={addManager}>
      <Icon icon="gg:add" />
    </button>
    <button onclick={removeManager}>
      <Icon icon="gg:remove" />
    </button>
  {/if}    
</div>

<div id="credit">
  Picture taken by <a target="_blank" href={$exifData.artist[1]}>{$exifData.artist[0]}</a>, Licensed under <a target="_blank" href={$exifData.copyright[1]}>{$exifData.copyright[0]}</a>, <a target="_blank" href={$exifData.description[1]}>{$exifData.description[0]}</a><br/>
  <a target="_blank" href="privacy">Privacy and Credit</a>
</div>
<Settings />

<style>
  :global {
    :root {
      --c1: 255, 255, 255;
      --c2: 0, 0, 0;
      --c3: 150, 150, 150;
      --c4: 100, 100, 100;
      --c5: 50, 50, 50, 50;
      --o1: .3;
      --o2: .7;
    }

    html, body {
      height: 100%;
      width: 100%;
      margin: 0;
      padding: 0;
    }

    body {
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: 1fr repeat(2, min-content);
      gap: 1rem;
      justify-content: center;
      align-items: center;
      position: absolute;
      inset: 0;
      
      margin: 0;
      padding: 1rem;
      box-sizing: border-box;
      overflow: hidden;
      
      font-family: "Quicksand", sans-serif;
      
      background-color: rgb(var(--c1));
  
      transition: background-image 1s ease-in-out, background-size 0s;
    }

    body * {
      transition: background-color .2s;
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

    *::-webkit-scrollbar-thumb {
      background-color: rgba(var(--c2), 0.5);
      border-radius: 4px;
      border: 2px solid transparent;
      background-clip: content-box;
    }
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
    gap: .5rem;
    overflow-x: hidden;
    overflow-y: visible;
  }

  #pageControl {
    display: flex;
    flex-direction: row;
    gap: .25rem;
    width: 100%;
  }
  
  #pageControl button {
    display: flex;
    align-items: center;
    justify-content: center;

    outline: none;
    border: 1px solid rgb(var(--c2));
    border-radius: .3rem;

    background-color: rgb(var(--c1));
    color: rgb(var(--c2));

    font-size: calc(5px + .75vmin);
    aspect-ratio: 1 / 1;

    cursor: pointer;
  }

  
  #pageControl select {
    display: flex;
    align-items: center;
    min-width: 20vmin;
    outline: none;
    color: rgb(var(--c2));
    border: 1px solid rgb(var(--c2));
    background-color: rgb(var(--c1));
    border-radius: .5rem;
    padding: 0 .5rem;
    font-size: calc(5px + .5vmin);
    font-weight: bold;
    cursor: pointer;
  }

  #pageControl select::picker(select) {
    background-color: rgb(var(--c4));
    color: rgb(var(--c1));
  }

  #pageControl select, select::picker(select) {
    appearance: base-select;
  }
  
  #credit {
    justify-self: center;
    color: rgb(var(--c1));
    padding: .25rem;
    background-color: rgba(var(--c2), var(--o2));
    border-radius: .75rem;
    font-size: .75rem;
    text-align: center;
  }

  #credit a {
    color: inherit;
  }
</style>
