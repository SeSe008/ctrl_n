<script lang="ts">
  import { globalSettings } from '$lib/constants/settings';
  import {
    getSelectedManagerId,
    getSelectedTileId,
    setSelectedTile,
    settings,
    toggleSettings
  } from '$lib/stores/settings/settings';

  import { getTile, globalTiles } from '$lib/stores/tiles';
  import { tileDefs } from '$lib/constants/tileDefs';

  import type { Element } from '$lib/types/settings/settings';
  import SettingsElement from './settingsElement.svelte';

  function getElements(): Array<Element> {
    const mgr = getSelectedManagerId();
    const tle = getSelectedTileId();
    const def = tileDefs[getTile(mgr, tle)?.element ?? 0];
    return def.tileProps.elements;
  }
</script>

<aside id="settings">
  <div id="settings_elements">
    {#if $settings.selectedTile === -1}
      <div class="settings_section">
        {#each globalSettings.elements as element, i (i)}
          <div class="element"><SettingsElement {element} /></div>
        {/each}
      </div>
    {:else if $globalTiles.managers[$settings.selectedManager] && $globalTiles.managers[$settings.selectedManager].tiles[$settings.selectedTile]}
      {#key $globalTiles.managers[getSelectedManagerId()].tiles[getSelectedTileId()].element}
        <div class="settings_section">
          {#each getElements() as element, i (`${element.elementType}-${i}`)}
            <div class="element"><SettingsElement {element} /></div>
          {/each}
        </div>
      {/key}
    {/if}
  </div>
  <div id="close_controls">
    <button
      onclick={() => {
        toggleSettings();
        setSelectedTile(-1);
      }}
    >
      Close
    </button>
    {#if $settings.selectedTile !== -1}
      <button onclick={() => setSelectedTile(-1)}>
        <b>Home</b>
      </button>
    {/if}
  </div>
</aside>

<style>
  @import url(/styles/settingsElements.css);

  #settings {
    overflow: hidden;

    top: 0;
    height: 100%;
    width: 500px;

    display: grid;
    grid-template-rows: minmax(0, 1fr) auto;

    background-color: rgba(var(--c1), 0.9);
    color: rgb(var(--c5));
    border-left: 1px solid rgb(var(--c2));

    z-index: 10;

    animation: settingsIn forwards 0.5s;
  }

  @media only screen and (min-width: 1200px) {
    #settings {
      grid-area: aside;
    }
  }

  @media only screen and (max-width: 1200px) {
    #settings {
      position: fixed;
      width: min(600px, 100%);
      right: 0;
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

  #settings_elements {
    overflow-y: auto;
  }

  .settings_section {
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
