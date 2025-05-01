<script lang="ts">
  import Icon from "@iconify/svelte";  

  import TileElement from "./tileElement.svelte";
  import { globalTiles, updateManager } from "$lib/stores/tiles";
  import type { TileManager } from "$lib/stores/tiles";
  import { editMode } from "$lib/stores/editMode";
  
  export let id: number;

  let manager: TileManager;

  $: if ($globalTiles && $globalTiles[id]) {
    manager = $globalTiles[id];
  }
  
  let tileManager: HTMLDivElement;
  
  $: if (tileManager) tileManager.style.gridTemplateColumns = `repeat(${manager.tiles.length}, 1fr)`;
  
  function removeTile() {
    if (manager.tiles.length > 1) {
      manager.tiles.pop();

      updateManager(manager, id);
    }
  }

  function addTile() {
    manager.tiles.push({
      pos: manager.tiles.length + 1,
      element: -1
    });
    
    updateManager(manager, id);
  }
</script>

<div class="tile-manager" bind:this={tileManager}>
  {#each manager.tiles as tile, i (i)}
    <TileElement managerId={id} tileId={i} tile={tile} />
  {/each}
  {#if $editMode}
    <div id="inputs">
      <button on:click={addTile}><Icon icon="gg:add" /></button>
      <button on:click={removeTile}><Icon icon="gg:remove" /></button>
      <button on:click={() => {manager.height = 1; updateManager(manager, id);}}>Reset Height</button>
      <input type='range' min='0' max='5' step='0.01' bind:value={manager.height} on:input={() => updateManager(manager, id)} />
      <span>
	Preferred Height:
	{#if manager.height !== 0}
	  {manager.height}fr
	{:else}
	  Fit Content
	{/if}
      </span>
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
    align-items: center;
    gap: .25rem;
  }

  #inputs button {
    outline: none;

    height: min-content;
    align-self: flex-end;
    justify-self: flex-start;

    display: flex;
    align-items: center;
    justify-content: center;

    font-size: .8rem;
    padding: .125rem;

    border: 1px solid rgb(var(--c2));
    border-radius: .3rem;
    background-color: rgb(var(--c1));
    color: rgb(var(--c2));
    cursor: pointer;
  }

  #inputs input[type="range"] {
    -webkit-appearance: none;
    appearance: none;
    width: 6rem;
    height: 1.2rem;
    padding: 0;
    margin: 0;
    background: transparent;
    cursor: pointer;
    align-self: flex-end;
  }

  #inputs input[type="range"]::-webkit-slider-runnable-track {
    height: .4rem;
    background-color: rgb(var(--c1));
    border: 1px solid rgb(var(--c2));
    border-radius: .3rem;
  }

  #inputs input[type="range"]::-moz-range-track {
    height: .4rem;
    background-color: rgb(var(--c1));
    border: 1px solid rgb(var(--c2));
    border-radius: .3rem;
  }

  #inputs input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 1rem;
    height: 1rem;
    margin-top: -.35rem;
    background-color: rgb(var(--c2));
    border: 1px solid rgb(var(--c2));
    border-radius: 50%;
  }

  #inputs input[type="range"]::-moz-range-thumb {
    width: 1rem;
    height: 1rem;
    background-color: rgb(var(--c2));
    border: 1px solid rgb(var(--c2));
    border-radius: 50%;
  }

  #inputs input[type="range"]:focus {
    outline: none;
  }

  #inputs span {
    color: rgb(var(--c2));
    background-color: rgb(var(--c1));
    border: 1px solid rgb(var(--c2));
    border-radius: .3rem;
    
    padding: .3rem;
    font-size: .8rem;
  }
</style>
