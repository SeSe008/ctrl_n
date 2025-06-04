<script lang="ts">
  import { globalTiles } from '$lib/stores/tiles';
  import { tileDefs } from '$lib/constants/tileDefs';
  import { toggleSettings } from '$lib/stores/settings/settings';
  import { editMode } from '$lib/stores/editMode';
  import type { Tile } from '$lib/types/tiles';
  import { settings } from '$lib/stores/settings/settings';
  
  import Icon from '@iconify/svelte';
  import type { Component } from 'svelte';
  
  interface Props {
    managerId: number;
    tileId: number;
    inSettings?: boolean;
  }
  
  let { managerId, tileId, inSettings }: Props = $props();

  let tile = $state<Tile>();
  let SelectedComponent = $state<Component | null>();
  let cssVars = $state<Record<string, string>>();

  globalTiles.subscribe(tiles => {
    tile = tiles[managerId]?.tiles[tileId];
    SelectedComponent = tile && tile.element != null ? tileDefs[tile.element]?.component : null;
    cssVars = tile?.cssVars ?? {};
  });

  function applyVars(
    node: HTMLElement,
    vars: Record<string, string> | undefined
  ) {
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
</script>

<div use:applyVars={cssVars} class="tile_element {(inSettings === false && $settings.enabled && $settings.selectedTile === tileId) ? 'settings_selected_tile' : ''}">
  {#if SelectedComponent }
    <SelectedComponent />
  {:else}
    <div id="spacer"></div>
  {/if}

  {#if $editMode}
    <div id="inputs">
      <button onclick={() => toggleSettings(managerId, tileId)}><Icon icon="lucide:settings" /></button>
    </div>
  {/if}
</div>

<style>
  .tile_element {
    position: relative;
    display: grid;
    grid-template-rows: minmax(0, 1fr) auto;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .settings_selected_tile {
    border: 2px dotted white;
  }
  
  #inputs {
    justify-self: center;
    display: flex;
    flex-direction: row;
    margin: .25rem;
    height: 2rem;
  }
  
  #inputs button {
    outline: none;
    justify-self: flex-end;
    font-size: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: .3rem;
    border: 1px solid rgb(var(--c2));
    background-color: rgb(var(--c1));
    color: rgb(var(--c2));
    cursor: pointer;
  }
</style>
