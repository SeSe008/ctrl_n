<script lang="ts">
  import { globalTiles } from '$lib/stores/tiles';
  import { tileDefs } from '$lib/constants/tileDefs';
  import { toggleSettings } from '$lib/stores/settings/settings';
  import { editMode } from '$lib/stores/editMode';
  
  import Icon from '@iconify/svelte';
  import type { Component } from 'svelte';
  
  interface Props {
    managerId: number;
    tileId: number;
  }
  
  let { managerId, tileId }: Props = $props();

  let selectedTile = $globalTiles[managerId]?.tiles[tileId]?.element;
  let SelectedComponent = $state<Component>();
  globalTiles.subscribe(tile => {
    SelectedComponent = tileDefs[tile[managerId]?.tiles[tileId]?.element]?.component;
  });
</script>

<div class="tile-element">
  {#if selectedTile !== 0 && SelectedComponent }
    <SelectedComponent />
  {:else}
    <div id="spacer"></div>
  {/if}

  {#if $editMode && selectedTile !== -1}
    <div id="inputs">
      <button onclick={() => toggleSettings(managerId, tileId)}><Icon icon="lucide:settings" /></button>
    </div>
  {/if}
</div>

<style>
  .tile-element {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  
  #inputs {
    display: flex;
    flex-direction: row;
    margin: .25rem;
  }
  
  #inputs button {
    outline: none;
    justify-self: flex-end;
    font-size: 1rem;
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
