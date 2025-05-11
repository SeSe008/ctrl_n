<script lang="ts">
  import TileElement from "./tileElement.svelte";
  import { globalTiles } from "$lib/stores/tiles";
  import type { TileManager } from "$lib/types/tiles";
  
  let { id } = $props();

  let manager = $state<TileManager>();

  $effect(() => {
    if ($globalTiles && $globalTiles[id]) manager = $globalTiles[id];
  });
  
  let tileManager: HTMLDivElement;
  
  $effect(() => {
    if (manager && tileManager) tileManager.style.gridTemplateColumns = `repeat(${manager.tiles.length}, 1fr)`;
  });
</script>

<div class="tile-manager" bind:this={tileManager}>
  {#if manager}
    {#each manager.tiles as tile, i (i)}
      <div id="element">
	<TileElement managerId={id} tileId={i} tile={tile} />
      </div>
    {/each}
  {/if}
</div>

<style>
  .tile-manager {
    display: grid;
    grid-template-rows: 1fr;
    
    height: 100%;
    width: 100%;
  }

  #element {
    flex-grow: 1;
  }
</style>
