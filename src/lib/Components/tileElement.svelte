<script lang="ts">
  import { getTile, globalTiles } from '$lib/stores/tiles';
  import { tileDefs } from '$lib/constants/tileDefs';
  import {
    isSelectingTile,
    selectingTile,
    setSelectedManager,
    setSelectedTile,
    settings,
    toggleSelectingTile
  } from '$lib/stores/settings/settings';
  import { onMount } from 'svelte';

  interface Props {
    managerId: number;
    tileId: number;
  }

  let { managerId, tileId }: Props = $props();

  function applyVars(node: HTMLElement, vars: Record<string, string> | undefined) {
    if (!vars) return;

    for (const [key, value] of Object.entries(vars)) {
      node.style.setProperty(key, value);
    }
    return {
      update(newVars: Record<string, string>) {
        for (const [key, value] of Object.entries(newVars)) {
          node.style.setProperty(key, value);
        }
      }
    };
  }

  let tileElement = $state<HTMLDivElement>();

  onMount(() => {
    if (tileElement)
      tileElement.addEventListener('click', () => {
        if (isSelectingTile()) {
          setSelectedManager(managerId);
          setSelectedTile(tileId);
          toggleSelectingTile();
        }
      });
  });
</script>

{#key JSON.stringify($globalTiles[managerId]?.tiles[tileId])}
  {@const tile = getTile(managerId, tileId)}
  {#if tile}
    <div
      bind:this={tileElement}
      use:applyVars={tile.cssVars}
      class="tile_element {$settings.enabled &&
      $settings.selectedManager === managerId &&
      $settings.selectedTile === tileId
        ? 'settings_selected_tile'
        : ''}
        {$selectingTile ? 'selecting' : ''}
        "
      id="tile_element_{managerId}{tileId}"
    >
      {#if tileDefs[tile.element]}
        {@const SelectedComponent = tileDefs[tile.element].component}
        <div {...$selectingTile && { inert: true }}><SelectedComponent /></div>
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

    transition: filter 0.2s linear;
  }

  .tile_element.selecting:hover {
    filter: brightness(0.6);
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
