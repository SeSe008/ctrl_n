<script lang="ts">
  import { globalSettings } from '$lib/constants/settings';
  import {
    getSelectedManagerId,
    getSelectedTileId,
    selectingTile,
    setSelectingTile,
    settings,
    toggleSelectingTile,
    toggleSettings
  } from '$lib/stores/settings/settings';

  import { getTile, globalTiles } from '$lib/stores/tiles';
  import { tileDefs } from '$lib/constants/tileDefs';

  import type { Element } from '$lib/types/settings/settings';
  import SettingsElement from './settingsElement.svelte';

  import { onDestroy } from 'svelte';
  import { derived } from 'svelte/store';

  let selectedTab = $state<number>(1);

  let settingsElements: Element[] = $state([]);

  function getElements() {
    const mgr = getSelectedManagerId() ?? 0;
    const tle = getSelectedTileId() ?? 0;
    const def = tileDefs[getTile(mgr, tle)?.element ?? 0];
    settingsElements = def.tileProps.elements;
  }

  let unsubscribes = $state<Array<() => void>>([]);

  // On selected settings element change
  unsubscribes.push(settings.subscribe(() => getElements()));

  // On widget change
  unsubscribes.push(globalTiles.subscribe(() => getElements()));

  const keyStore = derived([globalTiles, settings], ([$globalTiles, $settings]) => {
    const mgr = $settings.selectedManager;
    const tle = $settings.selectedTile;
    return $globalTiles.managers[mgr] && $globalTiles.managers[mgr].tiles[tle]
      ? JSON.stringify(`${$globalTiles.managers[mgr].tiles[tle].element}:${$settings}`)
      : $settings;
  });

  onDestroy(() => {
    unsubscribes.forEach((unsub) => unsub());
  });
</script>

<aside id="settings" class={$selectingTile ? 'selecting' : ''}>
  <div id="tab_cont">
    <div id="tab_nav">
      <button class={selectedTab === 0 ? 'active' : ''} onclick={() => (selectedTab = 0)}>
        Global Settings
      </button>
      <button class={selectedTab === 1 ? 'active' : ''} onclick={() => (selectedTab = 1)}>
        Element Settings
      </button>
    </div>
    <div id="tab_elements">
      {#if selectedTab === 0}
        <div class="settings_tab">
          {#each globalSettings.elements as element, i (i)}
            <div class="element"><SettingsElement {element} /></div>
          {/each}
        </div>
      {:else if selectedTab === 1 && $globalTiles.managers[$settings.selectedManager] && $globalTiles.managers[$settings.selectedManager].tiles[$settings.selectedTile]}
        {#key $keyStore}
          <div class="settings_tab">
            {#each settingsElements as element, i (`${element.elementType}-${i}`)}
              <div class="element"><SettingsElement {element} /></div>
            {/each}
          </div>
        {/key}
      {/if}
    </div>
  </div>
  <div id="close_controls">
    <button onclick={() => toggleSelectingTile()} class={$selectingTile ? 'active' : ''}>
      <b>Select Tile</b>
    </button>
    <button
      onclick={() => {
        toggleSettings();
        setSelectingTile(false);
      }}
    >
      Close
    </button>
  </div>
</aside>

<style>
  @import url(/styles/settingsElements.css);

  #settings {
    overflow: hidden;

    top: 0;
    height: 100%;
    width: 800px;

    display: grid;
    grid-template-rows: minmax(0, 1fr) auto;

    background-color: rgba(var(--c1), 0.9);
    color: rgb(var(--c5));
    border-left: 1px solid rgb(var(--c2));

    z-index: 100;

    animation: settingsIn forwards 0.5s;
  }

  @media only screen and (max-width: 1200px) {
    #settings {
      position: fixed;
      width: min(600px, 100%);
      right: 0;
    }

    #settings.selecting {
      display: none;
    }
  }

  @keyframes settingsIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  #tab_cont {
    display: grid;
    grid-template-rows: min-content 1fr;
    grid-template-columns: 1fr;
    overflow: hidden;
  }

  #tab_nav {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.25rem;

    border-bottom: 1px solid rgb(var(--c2));

    padding-top: 0.25rem;
    padding-left: 0.5rem;
  }

  #tab_nav button {
    display: flex;
    align-items: center;
    justify-content: center;

    border: 1px solid rgb(var(--c2));
    border-bottom: none;
    outline: none;

    font-size: calc(8px + 1.5vmin);
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem 0.25rem 0 0;

    color: inherit;
    background-color: transparent;

    cursor: pointer;

    transition: background-color 0.2s linear;
  }

  #tab_nav button.active {
    background-color: rgb(var(--c2));
  }

  #tab_elements {
    overflow-y: auto;
  }

  .settings_tab {
    flex-grow: 1;
    width: 100%;

    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    padding: 1rem;
    box-sizing: border-box;
  }

  #close_controls {
    align-self: flex-end;
    justify-self: stretch;
    width: 100%;
    height: min-content;

    padding: 0.5rem;
    box-sizing: border-box;

    display: flex;
    align-items: flex-end;
    justify-content: space-between;

    background-color: rgb(var(--c1));
    border-top: 1px solid rgb(var(--c2));

    z-index: 200;
  }

  .element {
    max-width: 100%;
    height: auto;
    overflow: hidden;

    font-size: inherit;
  }
</style>
