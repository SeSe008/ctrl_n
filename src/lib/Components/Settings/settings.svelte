<script lang="ts">
  import { elementComponents, globalSettings, tileManagerSettings } from '$lib/constants/settings';
  import {
    getSelectedManagerId,
    getSelectedTileId,
    settings,
    toggleSettings
  } from '$lib/stores/settings/settings';
  import { getManager, globalTiles } from '$lib/stores/tiles';
  import { tileDefs } from '$lib/constants/tileDefs';
  import TileElement from '$lib/Components/tileElement.svelte';
  import TileManager from '$lib/Components/tileManager.svelte';
  import { onMount } from 'svelte';
  import { toggleEditMode } from '$lib/stores/editMode';

  let selectedTab = $state<number>(2);

  let settingsContainer: HTMLElement;
  const sideOptions: [string, string] = ['settingsLeft', 'settingsRight'];
  const defaultSide: number = 0;

  function checkOverlap(): number | undefined {
    if (!settingsContainer) return;

    const managerId = getSelectedManagerId();
    const tileId = getSelectedTileId();
    if (managerId === undefined || tileId === undefined) return;

    const manager = getManager(managerId);
    if (!manager || manager.tiles.length <= 1) return;

    const selectedTile = document.getElementById(`tile_element_${managerId}${tileId}`);
    if (!selectedTile) return;

    const selectedTileRect = selectedTile.getBoundingClientRect();
    const settingsContainerRect = settingsContainer.getBoundingClientRect();

    if (selectedTileRect.left > settingsContainerRect.right) {
      return 0;
    } else {
      return 1;
    }
  }

  onMount(() => {
    toggleEditMode();

    settingsContainer.classList.add(sideOptions[checkOverlap() || defaultSide]);

    window.addEventListener('resize', () => {
      settingsContainer.classList.replace(
        sideOptions[((checkOverlap() || defaultSide) + 1) % 2],
        sideOptions[checkOverlap() || defaultSide]
      );
    });
  });
</script>

<aside id="settings" bind:this={settingsContainer}>
  <div id="tab_cont">
    <div id="tab_nav">
      <button class={selectedTab === 0 ? 'active' : ''} onclick={() => (selectedTab = 0)}
        >Global Settings</button
      >
      <button class={selectedTab === 1 ? 'active' : ''} onclick={() => (selectedTab = 1)}
        >Row Settings</button
      >
      <button class={selectedTab === 2 ? 'active' : ''} onclick={() => (selectedTab = 2)}
        >Tile Settings</button
      >
    </div>
    <div id="tab_elements">
      {#if selectedTab === 0}
        <div class="settings_tab">
          {#each globalSettings.elements as element, i (i)}
            {@const Comp = elementComponents[element.elementType]}
            <div class="element"><Comp options={element.elementOptions} /></div>
          {/each}
        </div>
      {:else if selectedTab === 1 && $settings.selectedManager !== undefined}
        <div class="settings_tab">
          {#each tileManagerSettings.elements as element, i (i)}
            {@const Comp = elementComponents[element.elementType]}
            <div class="element"><Comp options={element.elementOptions} /></div>
          {/each}
          <h2>Row preview</h2>
          <div class="preview" id="group_preview" inert>
            <TileManager id={$settings.selectedManager} inSettings={true} />
          </div>
        </div>
      {:else if selectedTab === 2 && $settings.selectedManager !== undefined && $settings.selectedTile !== undefined && $globalTiles[$settings.selectedManager].tiles[$settings.selectedTile].element !== undefined}
        <div class="settings_tab">
          {#each tileDefs[$globalTiles[$settings.selectedManager].tiles[$settings.selectedTile].element].tileProps.elements as element, i (i)}
            {#if elementComponents[element.elementType]}
              {@const Comp = elementComponents[element.elementType]}
              <div class="element"><Comp options={element.elementOptions} /></div>
            {/if}
          {/each}
          <h2>Tile Preview</h2>
          <div class="preview" id="tile_preview" inert>
            <TileElement
              managerId={$settings.selectedManager}
              tileId={$settings.selectedTile}
              inSettings={true}
            />
          </div>
        </div>
      {/if}
    </div>
  </div>
  <div id="close_controls">
    <button onclick={() => toggleSettings()}> Close </button>
  </div>
</aside>

<style>
  #settings {
    position: fixed;
    overflow: hidden;

    top: 0;
    height: 100%;
    width: min(30rem, 100%);

    display: grid;
    grid-template-rows: minmax(0, 1fr) auto;

    background-color: rgba(var(--c1), 0.9);
    color: rgb(var(--c2));

    z-index: 100;

    animation: settingsIn forwards 0.5s;
  }

  :global {
    #settings.settingsLeft {
      left: 0;
      border-right: 1px solid rgb(var(--c2));
    }

    #settings.settingsRight {
      right: 0;
      border-left: 1px solid rgb(var(--c2));
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

    color: rgb(var(--c2));
    background-color: transparent;

    cursor: pointer;
  }

  #tab_nav button.active {
    color: rgb(var(--c1));
    background-color: rgb(var(--c2));
  }

  #tab_elements {
    overflow-y: scroll;
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

  .settings_tab h2 {
    font-size: 2em;
    font-weight: bold;
    align-self: center;
  }

  .preview {
    display: flex;
    flex-direction: column;
    align-items: center;

    min-height: 50vh;
    max-height: 50vh;

    padding-bottom: 1rem;
  }

  #group_preview {
    width: 100vw;
  }

  #tile_preview {
    width: 100%;
  }

  :global {
    .preview > * {
      pointer-events: none !important;
      cursor: not-allowed !important;
      max-width: 90% !important;
    }

    .preview .tile_element > #inputs {
      display: none;
    }
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
    justify-content: flex-end;

    background-color: rgb(var(--c1));
    border-top: 1px solid rgb(var(--c2));

    z-index: 200;
  }

  .element {
    max-width: 100%;
    height: auto;
    overflow: hidden;
  }

  :global {
    .element button,
    #close_controls button {
      width: max-content;
      height: min-content;

      outline: none;
      border: 1px solid rgb(var(--c2));
      border-radius: 0.5vmin;
      background-color: rgb(var(--c1));
      color: inherit;

      font-size: calc(8px + 1vmin);
      cursor: pointer;

      transition: 0.2s opacity;
    }

    .element button:hover {
      opacity: 0.7;
    }

    .element select {
      appearance: base-select;

      width: max-content;
      height: min-content;

      outline: none;
      border: 1px solid rgb(var(--c2));
      border-radius: 0.5vmin;
      background-color: rgb(var(--c1));
      color: inherit;

      font-size: calc(8px + 1vmin);
      cursor: pointer;
    }

    .element select::picker(select) {
      appearance: base-select;

      color: inherit;
      background-color: inherit;
    }

    .element span,
    .element div,
    .element label {
      color: inherit;
      font-size: calc(8px + 1.25\vmin);
    }

    .element label {
      user-select: none;
      cursor: pointer;
    }

    .element input[type='range'] {
      -webkit-appearance: none;
      appearance: none;
      width: 6rem;
      height: 1.2rem;
      padding: 0;
      margin: 0;
      background: transparent;
      cursor: pointer;
    }

    .element input[type='range']::-webkit-slider-runnable-track {
      height: 0.4rem;
      background-color: rgb(var(--c1));
      border: 1px solid rgb(var(--c2));
      border-radius: 0.3rem;
    }

    .element input[type='range']::-moz-range-track {
      height: 0.4rem;
      background-color: rgb(var(--c1));
      border: 1px solid rgb(var(--c2));
      border-radius: 0.3rem;
    }

    .element input[type='range']::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 1rem;
      height: 1rem;
      margin-top: -0.35rem;
      background-color: rgb(var(--c2));
      border: 1px solid rgb(var(--c2));
      border-radius: 50%;
    }

    .element input[type='range']::-moz-range-thumb {
      width: 1rem;
      height: 1rem;
      background-color: rgb(var(--c2));
      border: 1px solid rgb(var(--c2));
      border-radius: 50%;
    }

    .element input[type='range']:focus {
      outline: none;
    }

    .element input[type='text'] {
      appearance: base-select;

      width: max-content;
      height: min-content;

      outline: none;
      border: 1px solid rgb(var(--c2));
      border-radius: 0.5vmin;
      background-color: rgb(var(--c1));
      color: inherit;

      font-size: calc(8px + 1vmin);
    }

    .element input[type='text']::placeholder {
      color: inherit;
      opacity: 0.7;
    }

    .element input[type='checkbox'] {
      appearance: none;
      -webkit-appearance: none;

      position: relative;

      display: inline-block;
      width: 1em;
      height: 1em;
      cursor: pointer;

      outline: none;

      border: 1px solid rgb(var(--c2));
      border-radius: 0.25em;
      background-color: rgb(var(--c1));
    }

    .element input[type='checkbox']::before {
      content: '';
      position: absolute;
      inset: 0.125em;
      width: calc(100%-0.125em);
      height: calc(100%-0.125em);

      background-color: transparent;
      border-radius: 0.125em;

      transition: background-color 0.2s ease-in-out;
    }

    .element input[type='checkbox']:checked::before {
      background-color: rgb(var(--c2));
    }
  }
</style>
