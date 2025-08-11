<script lang="ts">
  import TileElement from './tileElement.svelte';
  import { globalTiles } from '$lib/stores/tiles';
  import type { TileManager } from '$lib/types/tiles';
  import { settings } from '$lib/stores/settings/settings';

  interface Props {
    id: number;
  }

  let { id }: Props = $props();

  let manager = $state<TileManager>();

  $effect(() => {
    if ($globalTiles && $globalTiles.managers[id]) manager = $globalTiles.managers[id];
  });

  let tileManager: HTMLDivElement;

  $effect(() => {
    if (manager && tileManager)
      tileManager.style.gridTemplateColumns = `repeat(${manager.tiles.length}, 1fr)`;
  });
</script>

<div bind:this={tileManager} class="tile_manager">
  {#if manager}
    {#each manager.tiles as _, i (i)}
      <TileElement managerId={id} tileId={i} />
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

    box-sizing: border-box;
  }
</style>
