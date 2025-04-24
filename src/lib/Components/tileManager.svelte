<script lang="ts">
  import { onMount } from "svelte";

  import ColorThief from "colorthief";
  import Icon from "@iconify/svelte";
  import TileElement from "./tileElement.svelte";
  import { applyImage, useImage } from "$lib/Utils/useImage";
  import { fetchImages } from "$lib/Utils/fetchImages";
  
  export let colorThief: ColorThief;
  export let images: string[];
  export let changeInterval: number;
  export let colors: number;
  export let defaultCategory: string;
  
  const imageCategories: [string, string, string][] = [
    ['Animals', 'lucide:squirrel', 'backgrounds/animals'],
    ['Space', 'material-symbols:planet-outline', 'backgrounds/space']
  ];
  let selectedImageCategory: string = defaultCategory;
  $: selectedImageCategory = defaultCategory;

  async function changeImageCategory() {
    images = await fetchImages(selectedImageCategory);
    useImage(images, changeInterval, colors, colorThief);
    window.localStorage.setItem('imageCategory', selectedImageCategory);
  }
  
  function getTiles() {
    const tilesUnsafe = parseInt(window.localStorage.getItem('tiles')!);
    tiles = isNaN(tilesUnsafe) ? 1 : tilesUnsafe;
  }
  
  let tiles: number;
  let tileManager: HTMLDivElement;

  $: if (tileManager) tileManager.style.gridTemplateColumns = `repeat(${tiles}, 1fr)`;

  function removeTile() {
    if (tiles > 1) {
      window.localStorage.removeItem(`tile${tiles - 1}`);
      tiles--;
      window.localStorage.setItem(`tiles`, tiles.toString());
    }
  }

  function addTile() {
    tiles++;
    window.localStorage.setItem(`tiles`, tiles.toString());
  }

  onMount(() => {
    getTiles();
  });
</script>

<div id="tile-manager" bind:this={tileManager}>
  {#each { length: tiles } as _, id (id)} <!-- eslint-disable-line @typescript-eslint/no-unused-vars -->
    <TileElement id={id} />
  {/each}
  <div id="inputs">
    <button on:click={addTile}><Icon icon="gg:add" /></button>
    <button on:click={removeTile}><Icon icon="gg:remove" /></button>
    <button on:click={() => applyImage(
      images,
      getComputedStyle(document.body).backgroundImage.match(/url\("(?:https?:\/\/[^/]+)?(\/.*)"\)/)?.[1] || '',
      colors,
      colorThief
      )}
      >
      <Icon icon="gg:image" />
    </button>
    <select bind:value={selectedImageCategory} on:change={changeImageCategory}>
      {#each imageCategories as category (category[2])}
	<option value={category[2]}>
	  <Icon icon={category[1]} />
	  {category[0]}
	</option>
      {/each}
    </select>
  </div>
</div>

<style>
  #tile-manager {
    display: grid;
    grid-template-rows: 1fr min-content;
    gap: 0 1rem;
    width: 100%;
    height: 100%;
    overflow: hidden;
    padding: 0 3rem;
    box-sizing: border-box;
  }

  #inputs {
    display: flex;
    flex-direction: row;
    gap: .25rem;
  }

  #inputs button {
    outline: none;
    justify-self: flex-start;
    font-size: .8rem;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: .125rem;
    border-radius: .3rem;
    border: 1px solid rgb(var(--c2));
    background-color: rgb(var(--c1));
    color: rgb(var(--c2));
    cursor: pointer;
  }

  
  #inputs select {
    display: flex;
    align-items: center;
    grid-column: 1 / 3;
    min-width: 20%;
    outline: none;
    color: rgb(var(--c2));
    border: 1px solid rgb(var(--c2));
    background-color: rgb(var(--c1));
    border-radius: .5rem;
    padding: 0 .5rem;
    justify-self: center;
    font-size: calc(5px + .5vmin);
    font-weight: bold;
    cursor: pointer;
  }

  #inputs select::picker(select) {
    background-color: rgb(var(--c4));
    color: rgb(var(--c1));
  }

  #inputs select, select::picker(select) {
    appearance: base-select;
  }
</style>
