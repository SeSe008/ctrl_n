<script lang="ts">
  import { getTile, globalTiles } from '$lib/stores/tiles';
  import { tileDefs } from '$lib/constants/tileDefs';
  import {
    settings,
  } from '$lib/stores/settings/settings';
  import { applyCssVars } from '$lib/utils/applyCssVars';

  interface Props {
    managerId: number;
    tileId: number;
  }

  let { managerId, tileId }: Props = $props();
</script>

{#key JSON.stringify($globalTiles.managers[managerId]?.tiles[tileId])}
  {@const tile = getTile(managerId, tileId)}
  {#if tile}
    <div
      use:applyCssVars={tile.cssVars}
      class="tile_element {$settings.enabled &&
      $settings.selectedManager === managerId &&
      $settings.selectedTile === tileId
        ? 'settings_selected_tile'
        : ''}
        "
      id="tile_element_{managerId}{tileId}"
    >
      {#if tileDefs[tile.element]}
        {@const SelectedComponent = tileDefs[tile.element].component}
        <div><SelectedComponent /></div>
      {:else}
        <div id="spacer"></div>
      {/if}
    </div>
  {/if}
{/key}

<style>
  .tile_element {
    position: relative;
    display: grid;
    grid-template-rows: minmax(0, 1fr) auto;
    box-sizing: border-box;

    width: var(--tileWidth);
    height: var(--tileHeight);
    max-height: 100%;

    align-self: var(--tileVerPos);
    justify-self: var(--tileHorPos);

    pointer-events: auto;
    overflow: hidden;

    transition: background-color 0.2s linear;
  }
  
  .settings_selected_tile {
    border: 2px dotted white;
  }

  #inputs {
    justify-self: center;
    display: flex;
    flex-direction: row;
    margin: 0.25rem;
    height: 2rem;
  }
</style>
