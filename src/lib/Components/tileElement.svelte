<script lang='ts'>
  import Clock from '$lib/Components/Widgets/clock.svelte';
  import SearchBar from '$lib/Components/Widgets/searchBar.svelte';
  import RssFeed from '$lib/Components/Widgets/rssFeed.svelte';
  import WeatherWidget from '$lib/Components/Widgets/weatherWidget.svelte';
  import Calculator from '$lib/Components/Widgets/calculator.svelte';
  import Bookmarks from '$lib/Components/Widgets/bookmarks.svelte';
  import Settings from './Settings/settings.svelte';

  import { setClockType, clockType } from '$lib/stores/clockType';
  
  import { changeTile } from '$lib/stores/tiles';
  import type { Tile } from '$lib/stores/tiles';
   
  import { editMode } from '$lib/stores/editMode';
  import type { Element } from '$lib/Components/Settings/settings.svelte'; 
  
  import Icon from '@iconify/svelte';
  import type { Component } from 'svelte';
  
  interface Props {
    managerId: number;
    tileId: number;
    tile: Tile
  }
  
  let { managerId, tileId, tile }: Props = $props();

  interface TileDef {
    name: string;
    label: string;
    icon: string;
    component?: Component;
  }

  const tileDefs: TileDef[] = [
    { name: "none", label: 'None', icon: '' },
    { name: "search_bar", label: 'Search Bar', icon: 'mdi:search', component: SearchBar },
    { name: "clock", label: 'Clock', icon: 'mdi:clock-outline', component: Clock },
    { name: "rss_feed", label: 'Rss-Feed',  icon: 'material-symbols:news', component: RssFeed },
    { name: "weather", label: 'Weather', icon: 'ph:cloud-sun-fill', component: WeatherWidget },
    { name: "calculator", label: 'Calculator', icon: 'iconamoon:calculator', component: Calculator },
    { name: "bookmarks", label: 'Bookmarks', icon: 'material-symbols:bookmarks', component: Bookmarks },
  ];
  
  let selectedTile = $state<number>(tile.element);
  let SelectedComponent = $state<Component>();
  $effect(() => {
    SelectedComponent = tileDefs[selectedTile]?.component;
  });

  let settingsEnabled = $state<boolean>(false);

  const tileSettings: Element[] = [
    {
      elementType: "text",
      elementOptions: {
	text: "Tile Settings",
	classes: ["large", "center", "strong"]
      }
    },
    {
      elementType: "select",
      elementOptions: {
	selectOptions: tileDefs.map(({ label, icon }) => { return { label, icon }; }),	
	changeFunction: (value: number) => {
	  selectedTile = value;
	  changeTile(managerId, tileId, selectedTile);
	},
	defaultValue: () => selectedTile,
	label: "Widget-Type:"
      }
    }
  ];
  
  interface SettingElements {
    [key: string]: Element[];
  }

  const defaultWidgetsProps: SettingElements = {
    search_bar: [],
    clock: [
      {
	elementType: "text",
	elementOptions: {
	  text: "Clock-Options",
	  classes: ["big", "center", "strong", "margin_vert"]
	}
      },
      {
	elementType: "select",
	elementOptions: {
	  selectOptions: [
	    { label: "Digital", value: "digital" },
	    { label: "Analog", value: "analog" }
	  ],
	  changeFunction: (value: string) => {
	    setClockType(value);
	  },
	  defaultValue: () => $clockType,
	  label: "Clock-Type:"
	}
      }
    ],
    rss_feed: [],
    weather: [],
    calculator: [],
    bookmarks: []
  };

  const elementPropsList = Object.fromEntries(
    Object.entries(defaultWidgetsProps).map(
      ([key, elems]) => [key, [...tileSettings, ...elems]] as [string, Element[]]
    )
  );
</script>

<div class="tile-element">
  {#if selectedTile !== 0 && SelectedComponent }
    <SelectedComponent />
  {:else}
    <div id="spacer"></div>
  {/if}

  {#if $editMode && selectedTile !== -1}
    <div id="inputs">
      <button onclick={() => settingsEnabled = !settingsEnabled}><Icon icon="lucide:settings" /></button>
    </div>

    {#if settingsEnabled}
      <Settings elements={elementPropsList[tileDefs[selectedTile].name]} bind:settingsEnabled={settingsEnabled} />
    {/if}
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
  #inputs {
    display: flex;
    flex-direction: row;
    margin-bottom: .25rem;
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
