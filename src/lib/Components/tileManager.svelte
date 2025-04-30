<script lang="ts">
  import Icon from "@iconify/svelte";  

  import TileElement from "./tileElement.svelte";
  import { globalTiles, updateGlobalTiles } from "$lib/stores/tiles";
  import type { Tiles } from "$lib/stores/tiles";
  import { editMode } from "$lib/stores/editMode";
  
  export let id: number;

  let tiles: Tiles = [];
  $: if ($globalTiles && $globalTiles[id]) {
    tiles = $globalTiles[id];
  }
  let tileManager: HTMLDivElement;
  
  $: if (tileManager) tileManager.style.gridTemplateColumns = `repeat(${tiles.length}, 1fr)`;
  
  function removeTile() {
    if (tiles.length > 1) {
      tiles.pop();

      updateGlobalTiles(tiles, id);
    }
  }

  function addTile() {
    tiles.push({
      pos: tiles.length + 1,
      element: -1
    });
    
    updateGlobalTiles(tiles, id);
  }
</script>

<div class="tile-manager" bind:this={tileManager}>
  {#each tiles as tile, i (i)}
    <TileElement managerId={id} tileId={i} tile={tile} />
  {/each}
  {#if $editMode}
    <div id="inputs">
      <button on:click={addTile}><Icon icon="gg:add" /></button>
      <button on:click={removeTile}><Icon icon="gg:remove" /></button>
    </div>
  {/if}
</div>

<style>
  .tile-manager {
    display: grid;
    grid-template-rows: 1fr min-content;
    gap: 0 1rem;
    height: 100%;
    width: 100%;
  }

  /* Custom element rules */
  :global{
    .tile-manager:not(:has(#search)) {
      overflow: hidden;
    }
  }

  #inputs {
    display: flex;
    flex-direction: row;
    gap: .25rem;
  }

  #inputs button {
    outline: none;
    height: min-content;
    align-self: flex-end;
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
