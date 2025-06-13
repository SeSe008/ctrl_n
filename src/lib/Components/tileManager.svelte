<script lang="ts">
  import TileElement from './tileElement.svelte';
  import { globalTiles } from '$lib/stores/tiles';
  import type { TileManager } from '$lib/types/tiles';

  interface Props {
    id: number;
    inSettings?: boolean;
  }

  let { id, inSettings }: Props = $props();

  let manager = $state<TileManager>();

  $effect(() => {
    if ($globalTiles && $globalTiles[id]) manager = $globalTiles[id];
  });

  let tileManager: HTMLDivElement;

  $effect(() => {
    if (manager && tileManager)
      tileManager.style.gridTemplateColumns = `repeat(${manager.tiles.length}, 1fr)`;
  });
</script>

<div class="tile_manager" bind:this={tileManager}>
  {#if manager}
    {#each manager.tiles as _, i (i)}
      <TileElement managerId={id} tileId={i} {inSettings} />
    {/each}
  {/if}
</div>

<style>
  .tile_manager {
    display: grid;
    grid-template-rows: 1fr;
    gap: 1rem;

    height: 100%;
    width: 100%;
    overflow: hidden;
  }
</style>
