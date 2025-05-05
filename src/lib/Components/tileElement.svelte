<script lang='ts'>
  import Clock from '$lib/Components/Widgets/clock.svelte';
  import SearchBar from '$lib/Components/Widgets/searchBar.svelte';
  import RssFeed from '$lib/Components/Widgets/rssFeed.svelte';
  import WeatherWidget from '$lib/Components/Widgets/weatherWidget.svelte';
  import Calculator from '$lib/Components/Widgets/calculator.svelte';
  import Bookmarks from '$lib/Components/Widgets/bookmarks.svelte';

  import { changeTile } from '$lib/stores/tiles';
  import type { Tile } from '$lib/stores/tiles';
   
  import Icon from '@iconify/svelte';
  import { editMode } from '$lib/stores/editMode';
  import type { Component } from 'svelte';
  
  interface Props {
    managerId: number;
    tileId: number;
    tile: Tile
  }
  
  let { managerId, tileId, tile }: Props = $props();

  interface TileDef {
    label: string;
    icon: string;
    component?: Component;
  }

  const tileDefs: TileDef[] = [
    { label: 'None', icon: '' },
    { label: 'Search Bar', icon: 'mdi:search', component: SearchBar },
    { label: 'Clock', icon: 'mdi:clock-outline', component: Clock },
    { label: 'Rss-Feed',  icon: 'material-symbols:news', component: RssFeed },
    { label: 'Weather', icon: 'ph:cloud-sun-fill', component: WeatherWidget },
    { label: 'Calculator', icon: 'iconamloon:calculator', component: Calculator },
    { label: 'Bookmarks', icon: 'material-symbols:bookmarks', component: Bookmarks },
  ];
  
  let selectedTile = $state<number>(tile.element);
  let SelectedComponent = $state<Component>();
  $effect(() => {
    SelectedComponent = tileDefs[selectedTile]?.component;
  });
</script>

<div class="tile-element">
  {#if !SelectedComponent && selectedTile !== 0}
    <h2>Select Tile</h2>
    <select bind:value={selectedTile} onchange={() => changeTile(managerId, tileId, selectedTile)}>
      {#each tileDefs as def, i (i)}
	<option value={i}>
	  <Icon icon={def.icon} />
	  {def.label}
	</option>
      {/each}
    </select>
  {:else if selectedTile !== 0 }
    <SelectedComponent />
  {:else}
    <div id="spacer"></div>
  {/if}

  {#if $editMode && selectedTile !== -1}
    <button onclick={() => selectedTile = -1}><Icon icon="lucide:edit" /></button>
  {/if}
</div>

<style>
  .tile-element {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: .5rem;
    align-items: center;
    position: relative;
    max-width: 100%;
    max-height: 100%;
  }

  /* Custom Element Rules */
  :global {
    .tile-element:not(:has(#search)) {
      overflow: hidden;
    }
  }

  .tile-element h2 {
    background-color: rgb(var(--c2));
    color: rgb(var(--c1));
    border: 1px solid rgb(var(--c1));
    padding: .5rem;
    border-radius: .5rem;
  }
  
  .tile-element select {
    grid-column: 1 / 3;
    min-width: 20vmin;
    outline: none;
    color: rgb(var(--c1));
    border: 1px solid rgb(var(--c2));
    background-color: rgb(var(--c4));
    border-radius: .5rem;
    padding: .5rem .5rem;
    justify-self: center;
    font-size: calc(10px + .5vmin);
    font-weight: bold;
    cursor: pointer;
  }

  .tile-element select::picker(select) {
    background-color: rgb(var(--c4));
    color: rgb(var(--c1));
  }

  .tile-element select, select::picker(select) {
    appearance: base-select;
  }

  .tile-element button {
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
