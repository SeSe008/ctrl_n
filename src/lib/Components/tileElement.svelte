<script lang='ts'>
  import RssFeed from '$lib/Components/rssFeed.svelte';
  import WeatherWidget from './weatherWidget.svelte';
  import Calculator from './calculator.svelte';
  
  import Icon from '@iconify/svelte';
  import { onMount } from 'svelte';
  
  export let id: number = 0;
  
  const tiles: string[][] = [
    ['', 'None'],
    ['material-symbols:news', 'RSS-Feed'],
    ['ph:cloud-sun-fill', 'Weather'],
    ['iconamoon:calculator', 'Calculator']
  ];

  let selectedTile: number = -1;

  onMount(() => {
    const selectedTileUnsafe: number = parseInt(window.localStorage.getItem(`tile${id}`)!);
    selectedTile = isNaN(selectedTileUnsafe) ? -1 : selectedTileUnsafe;
  });
</script>

<div id='tile-element'>
  {#if selectedTile === -1 || selectedTile > tiles.length}
    <h2>Select Tile</h2>
    <select bind:value={selectedTile} on:change={() => window.localStorage.setItem(`tile${id}`, selectedTile.toString())}>
      {#each tiles as tile, i (tile)}
	<option value={i}>
	  <Icon icon={tile[0]} />
	  {tile[1]}
	</option>
      {/each}
    </select>
  {:else if selectedTile === 1}
    <RssFeed />
  {:else if selectedTile === 2}
    <WeatherWidget />
  {:else if selectedTile === 3}
    <Calculator />
  {/if}

  <div id='spacer'></div>
  
  {#if  selectedTile !== -1}
    <button on:click={() => selectedTile = -1}><Icon icon="lucide:edit" /></button>
  {/if}
</div>

<style>
  #tile-element {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: .5rem;
    align-items: center;
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  h2 {
    background-color: rgb(var(--c2));
    color: rgb(var(--c1));
    border: 1px solid rgb(var(--c1));
    padding: .5rem;
    border-radius: .5rem;
  }
  
  select {
    grid-column: 1 / 3;
    min-width: 20%;
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

  select::picker(select) {
    background-color: rgb(var(--c4));
    color: rgb(var(--c1));
  }

  select, select::picker(select) {
    appearance: base-select;
  }

  #spacer {
    flex-grow: 1;
  }

  button {
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
