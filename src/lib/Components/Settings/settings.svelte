<script lang="ts">
  import { onMount } from 'svelte';
  import { addError } from '$lib/stores/errors';
  import { globalSettings } from '$lib/constants/globalSettings';
  import {
    getSelectedManagerId,
    getSelectedTileId,
    setSelectedTile,
    settings,
    toggleSettings
  } from '$lib/stores/settings/settings';

  import { getTile, globalTiles, getTiles, setTiles } from '$lib/stores/tiles';
  import { StoreGlobalTiles } from '$lib/classes/tile';
  import { tileDefs } from '$lib/constants/tileDefs';

  import type { Element } from '$lib/types/settings/settings';
  import SettingsElement from './settingsElement.svelte';

  // Key for tiles in local storage
  const STORAGE_KEY = 'tiles';

  function getElements(): Array<Element> {
    const mgr = getSelectedManagerId();
    const tle = getSelectedTileId();
    const def = tileDefs[getTile(mgr, tle)?.widgetType ?? 0];
    return def.tileProps.elements;
  }

  function serializeTiles(): string {
    return JSON.stringify(getTiles().toJSON());
  }

  function readSaved(): string | null {
    try {
      return window.localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      addError('localstorage-read', 'Could not read tiles from localStorage.');
      return null;
    }
  }

  function saveTiles(): boolean {
    try {
      window.localStorage.setItem(STORAGE_KEY, serializeTiles());
      return true;
    } catch (e) {
      addError('localstorage-write', 'Could not save tiles to localStorage.');
      return false;
    }
  }

  function revertTiles(): void {
    const raw = readSaved();
    if (!raw) {
      addError('no-saved-state', 'No saved tiles found to revert to.');
      return;
    }
    try {
      const parsed = JSON.parse(raw);
      setTiles(new StoreGlobalTiles().fromJSON(parsed));
    } catch (e) {
      addError('parse-error', 'Saved layout is corrupted and cannot be loaded.');
    }
  }

  function saveAndClose(): void {
    if (saveTiles()) {
      toggleSettings();
      setSelectedTile(-1);
    }
  }

  let hasSaved = $state<boolean>(false);
  let isDirty = $state<boolean>(false);

  function recomputeFlags() {
    const saved = readSaved();
    hasSaved = !!saved;
    isDirty = saved !== null ? saved !== serializeTiles() : true;
    console.log(isDirty);
  }

  onMount(() => {
    recomputeFlags();

    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 's' || e.key === 'S') && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        saveTiles();
        recomputeFlags();
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        saveAndClose();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    const gSub = globalTiles.subscribe(() => recomputeFlags());

    return () => {
      gSub();
      window.removeEventListener('keydown', onKeyDown);
    };
  });
</script>

<aside id="settings">
  <div id="settings_elements">
    {#if $settings.selectedTile === -1}
      <div class="settings_section">
        {#each globalSettings.elements as element, i (i)}
          <div class="element"><SettingsElement {element} /></div>
        {/each}
      </div>
    {:else if $globalTiles.getManager($settings.selectedManager)?.getTile($settings.selectedTile)}
      {#key $globalTiles
        .getManager(getSelectedManagerId())
        ?.getTile(getSelectedTileId())?.widgetType}
        <div class="settings_section">
          {#each getElements() as element, i (`${element.elementType}-${i}`)}
            <div class="element"><SettingsElement {element} /></div>
          {/each}
        </div>
      {/key}
    {/if}
  </div>

  <!-- Controls -->
  <div id="close_controls" role="toolbar" aria-label="Settings actions">
    <button
      type="button"
      title="Save changes and close settings (Esc)"
      onclick={() => saveAndClose()}
    >
      Save & Close
    </button>

    <button
      type="button"
      title="Save changes (Ctrl/⌘+S)"
      onclick={() => {
        if (saveTiles()) recomputeFlags();
      }}
      disabled={!isDirty}
      aria-disabled={!isDirty}
    >
      Save
    </button>

    <button
      type="button"
      title={hasSaved ? 'Revert to last saved layout' : 'No saved layout'}
      onclick={() => {
        revertTiles();
        recomputeFlags();
      }}
      disabled={!hasSaved || !isDirty}
      aria-disabled={!hasSaved || !isDirty}
    >
      Revert
    </button>

    {#if $settings.selectedTile !== -1}
      <button type="button" title="Go to Home" onclick={() => setSelectedTile(-1)}>
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
