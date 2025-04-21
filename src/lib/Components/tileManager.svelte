<script lang="ts">
  import { onMount } from "svelte";

  import ColorThief from "colorthief";
  import Icon from "@iconify/svelte";
  import TileElement from "./tileElement.svelte";
  import { applyImage } from "$lib/Utils/useImage";

  export let colorThief: ColorThief;
  export let images: string[];
  export let colors: number;
  
  let tiles: number = 1;
  let tileManager: HTMLDivElement;

  $: if (tileManager) tileManager.style.gridTemplateColumns = `repeat(${tiles}, 1fr)`;

  function removeTile() {
    if (tiles > 1) {
      window.localStorage.removeItem(`tile${tiles - 1}`);
      tiles--;
    }
  }
  
  onMount(() => {
    const tilesUnsafe = parseInt(window.localStorage.getItem('tiles')!);
    tiles = isNaN(tilesUnsafe) ? 1 : tilesUnsafe;
  });
</script>

<div id="tile-manager" bind:this={tileManager}>
  {#each { length: tiles } as _, id (id)} <!-- eslint-disable-line @typescript-eslint/no-unused-vars -->
    <TileElement id={id} />
  {/each}
  <div id="inputs">
    <button on:click={() => tiles++}><Icon icon="gg:add" /></button>
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

  button {
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
</style>
