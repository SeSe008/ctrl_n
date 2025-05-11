<script lang='ts'>
  import { tileDefs } from '$lib/constants/tileDefs';
  import Settings from './Settings/settings.svelte';

  import { changeTile, addTile, removeTile, globalTiles, changeManagerHeight } from '$lib/stores/tiles';
  import type { Tile } from '$lib/types/tiles';

  import { editMode } from '$lib/stores/editMode';
  import type { Element } from '$lib/types/settings';
  
  import { setClockType, clockType } from '$lib/stores/clockType';

  import { setSearchEngineName, searchEngineName } from '$lib/stores/searchEngine';
  import { searchEngines } from '$lib/constants/searchEngines';
  
  import Icon from '@iconify/svelte';
  import type { Component } from 'svelte';
  
  interface Props {
    managerId: number;
    tileId: number;
    tile: Tile
  }
  
  let { managerId, tileId, tile }: Props = $props();

  let selectedTile = $state<number>(tile.element);
  let SelectedComponent = $state<Component>();
  $effect(() => {
    SelectedComponent = tileDefs[selectedTile]?.component;
  });

  let settingsEnabled = $state<boolean>(false);

  const tileSettings: Element[] = [
    {
      elementType: 'text',
      elementOptions: {
	text: 'Tile Settings',
	classes: ['large', 'center', 'strong']
      }
    },
    {
      elementType: 'select',
      elementOptions: {
	selectOptions: tileDefs.map(({ label, icon }) => { return { label, icon }; }),	
	onChange: (value: number) => {
	  selectedTile = value;
	  changeTile(managerId, tileId, selectedTile);
	},
	defaultValue: () => selectedTile,
	label: 'Widget Type:'
      }
    }
  ];

  const tileManagerSettings: Element[] = [
    {
      elementType: 'text',
      elementOptions: {
	text: 'Row Settings',
	classes: ['large', 'center', 'strong', 'margin_vert']
      }
    },
    {
      elementType: 'buttons',
      elementOptions: {
	buttons: [
	  {
	    text: 'Add Element',
	    icon: 'gg:add',
	    onClick: () => addTile(managerId)
	  },
	  {
	    text: 'Remove Element',
	    icon: 'gg:remove',
	    onClick: () => removeTile(managerId)
	  }
	]
      }
    },
    {
      elementType: 'text',
      elementOptions: {
	text: 'Row-Height:',
	classes: ['medium', 'left', 'margin_vert']
      }
    },
    {
      elementType: 'range',
      elementOptions: {
	min: 0,
	max: 5,
	step: 0.1,
	onInput: (value: number) => {
	  changeManagerHeight(managerId, value);
	},
	defaultValue: () => $globalTiles[managerId].height,
	specialValues: {
	  0: 'Fit-Content'
	},
	valueLabel: 'Preferred height:',
	unit: 'fr'
      }
    },
    {
      elementType: 'buttons',
      elementOptions: {
	buttons: [
	  {
	    onClick: () => {
	      changeManagerHeight(managerId, 1);
	    },
	    text: 'Reset Height'
	  }
	]
      }
    }
  ];
  
  interface SettingElements {
    [key: string]: Element[];
  }

  const defaultWidgetsProps: SettingElements = {
    spacer: [],
    search_bar: [
      {
	elementType: 'text',
	elementOptions: {
	  text: 'Search-Options',
	  classes: ['big', 'center', 'strong', 'margin_vert']
	}
      },
      {
	elementType: 'select',
	elementOptions: {
	  selectOptions: Object.entries(searchEngines).map(
	    ([value, { name: label, icon }]) =>
	    ({ label, icon, value })
	  ),
	  onChange: (value: string) => {
	    setSearchEngineName(value);
	  },
	  defaultValue: () => $searchEngineName,
	  label: 'Search Engine:'
	}
      }
    ],
    clock: [
      {
	elementType: 'text',
	elementOptions: {
	  text: 'Clock-Options',
	  classes: ['big', 'center', 'strong', 'margin_vert']
	}
      },
      {
	elementType: 'select',
	elementOptions: {
	  selectOptions: [
	    { label: 'Digital', value: 'digital' },
	    { label: 'Analog', value: 'analog' }
	  ],
	  onChange: (value: string) => {
	    setClockType(value);
	  },
	  defaultValue: () => $clockType,
	  label: 'Clock-Type:'
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
      ([key, elems]) => [key, [...tileSettings, ...elems, ...tileManagerSettings]] as [string, Element[]]
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
    width: 100%;
    height: 100%;
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
