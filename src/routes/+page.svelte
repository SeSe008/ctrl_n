
<script lang="ts"> 
  import ColorThief from 'colorthief';

  import Clock from '$lib/Components/clock.svelte';
  import SearchBar from '$lib/Components/searchBar.svelte';
  import TileManager from '$lib/Components/tileManager.svelte';
  
  import { onMount } from 'svelte';
  import { useImage } from '$lib/Utils/useImage';

  let colorThief: ColorThief;
  
  let images: string[] = [];
  const path: string = 'backgrounds'; // Dir-name of the image folder 
  const colors: number = 5; // Amount of colors for palette
  const changeInterval: number = 5 * 60 * 1000; // Interval of change of bg-image
  
  async function loadImages(path: string, colorThief: ColorThief) {
    // Fetch images
    const res = await fetch('/api/images', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subdir: path })
    });

    if (res.ok) {
      images = await res.json();
    } else {
      images = [];
    }

    useImage(images, changeInterval, colors, colorThief);
  }

  onMount(() => {
    colorThief = new ColorThief();
    
    loadImages(path, colorThief);
  });
</script>

<Clock />
<SearchBar />
<TileManager colorThief={colorThief} images={images} colors={colors} />
<div id='credit'>
  Animal Pictures, made by <a target="_blank" href="https://finnbear.com/">Finn Bear</a>, published on <a target="_blank" href="https://squirrelwatching.com">SquirrelWatching</a>, are licensed under <a target="_blank" href="https://creativecommons.org/licenses/by-sa/4.0/deed.en">CC-BY-SA 4.0</a><br/>
  <a target="_blank" href="privacy">Privacy and Credit</a>
</div>


<style>
  :global {
    :root {
      --c1: 255, 255, 255;
      --c2: 0, 0, 0;
      --c3: 150, 150, 150;
      --c4: 100, 100, 100;
      --c5: 50, 50, 50, 50;
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
      grid-template-rows: minmax(25%, max-content) min-content 1fr min-content;
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
      background-image: url(""); /* managed by TS */
      background-repeat: no-repeat;
      background-attachment: fixed;
      background-position: center center;
      background-size: cover;
      
      transition-property: background-image;
      transition-duration: 1s;
      transition-timing-function: ease-in-out;
    }

    body * {
      transition: background-color .2s;
    }

    body > div > * {
      justify-self: center;
    }

    input, button, select {
      font-family: "Quicksand", sans-serif;
    }


    ::-moz-selection {
      color: rgb(var(--c1));
      background-color: rgb(var(--c4));
    }

    ::selection {
      color: rgb(var(--c1));
      background-color: rgb(var(--c4));
    }
  }

  #credit {
    color: rgb(var(--c1));
    padding: .25rem;
    background-color: rgba(var(--c2), .7);
    border-radius: .75rem;
    font-size: .75rem;
    text-align: center;
  }

  #credit a {
    color: inherit;
  }
</style>
