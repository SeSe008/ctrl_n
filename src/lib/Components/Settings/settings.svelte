<script lang="ts">
  import { elementComponents, globalSettings, tileManagerSettings } from '$lib/constants/settings';
  import { settings, toggleSettings } from '$lib/stores/settings/settings';
  import { globalTiles } from '$lib/stores/tiles';
  import { tileDefs } from '$lib/constants/tileDefs';
  import TileElement from '$lib/Components/tileElement.svelte';
  import TileManager from '$lib/Components/tileManager.svelte';
  import { onMount } from 'svelte';
  import { toggleEditMode } from '$lib/stores/editMode';

  let selectedTab = $state<number>(2);

  onMount(() => {
    toggleEditMode();
  });
</script>

<aside id="settings">
  <div id="tab_cont">
    <div id="tab_nav">
      <button class={selectedTab === 0 ? 'active' : ''} onclick={() => selectedTab = 0}>Global Settings</button>
      <button class={selectedTab === 1 ? 'active' : ''} onclick={() => selectedTab = 1}>Row Settings</button>
      <button class={selectedTab === 2 ? 'active' : ''} onclick={() => selectedTab = 2}>Tile Settings</button>
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
	<div class="preview" inert>
	  <TileManager id={$settings.selectedManager} />
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
	<div class="preview" inert>
	  <TileElement managerId={$settings.selectedManager} tileId={$settings.selectedTile} />
	    </div>
      </div>
    {/if}
  </div>
  </div>
  <div id="close_controls">
    <button onclick={() => toggleSettings()}>
      Close
    </button>
  </div>
</aside>
  
<style>
  #settings {
    position: fixed;
    overflow: hidden;

    left: 0;
    top: 0;
    height: 100%;
    width: min(30rem, 100%);

    display: grid;
    grid-template-rows: minmax(0, 1fr) auto;
    
    background-color: rgba(var(--c1), .9);
    color: rgb(var(--c2));
    border-right: 1px solid rgb(var(--c2));
    
    z-index: 100;

    animation: settingsIn forwards .5s;
  }

  @keyframes settingsIn {
    from {
      width: 0;
    }
    to {
      width: min(30rem, 100%);
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
    gap: .25rem;
    
    border-bottom: 1px solid rgb(var(--c2));

    padding-top: .25rem;
    padding-left: .5rem;
  }

  #tab_nav button {
    display: flex;
    align-items: center;
    justify-content: center;
    
    border: 1px solid rgb(var(--c2));
    border-bottom: none;
    outline: none;

    font-size: calc(8px + 1.5vmin);
    padding: .25rem .5rem;
    border-radius: .25rem .25rem 0 0;

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
    gap: .5rem;

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

    width: 100%;
    min-height: 50vh;
    max-height: 50vh;

    padding-bottom: 1rem;
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

    padding: .5rem;
    box-sizing: border-box;
    
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;

    background-color: rgb(var(--c1));
    border-top: 1px solid rgb(var(--c2));

    z-index: 200;
  }

  :global {
    .element button, #close_controls button {
      width: max-content;
      height: min-content;

      outline: none;
      border: 1px solid rgb(var(--c2));
      border-radius: .5vmin;
      background-color: rgb(var(--c1));
      color: inherit;

      font-size: calc(8px + 1vmin);
      cursor: pointer;

      transition: .2s opacity;
    }

    .element button:hover {
      opacity: .7;
    }

    .element select { 
      appearance: base-select;
      
      width: max-content;
      height: min-content;

      outline: none;
      border: 1px solid rgb(var(--c2));
      border-radius: .5vmin;
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

    .element span, .element div, .element label {
      color: inherit;
      font-size: calc(8px + 1.25\vmin);
    }

    .element label {
      user-select: none;
      cursor: pointer;
    }

    .element input[type="range"] {
      -webkit-appearance: none;
      appearance: none;
      width: 6rem;
      height: 1.2rem;
      padding: 0;
      margin: 0;
      background: transparent;
      cursor: pointer;
    }

    .element input[type="range"]::-webkit-slider-runnable-track {
      height: .4rem;
      background-color: rgb(var(--c1));
      border: 1px solid rgb(var(--c2));
      border-radius: .3rem;
    }

    .element input[type="range"]::-moz-range-track {
      height: .4rem;
      background-color: rgb(var(--c1));
      border: 1px solid rgb(var(--c2));
      border-radius: .3rem;
    }

    .element input[type="range"]::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 1rem;
      height: 1rem;
      margin-top: -.35rem;
      background-color: rgb(var(--c2));
      border: 1px solid rgb(var(--c2));
      border-radius: 50%;
    }

    .element input[type="range"]::-moz-range-thumb {
      width: 1rem;
      height: 1rem;
      background-color: rgb(var(--c2));
      border: 1px solid rgb(var(--c2));
      border-radius: 50%;
    }

    .element input[type="range"]:focus {
      outline: none;
    }

    .element input[type="text"] {
      appearance: base-select;
      
      width: max-content;
      height: min-content;

      outline: none;
      border: 1px solid rgb(var(--c2));
      border-radius: .5vmin;
      background-color: rgb(var(--c1));
      color: inherit;

      font-size: calc(8px + 1vmin);
    }

    .element input[type="text"]::placeholder {
      color: inherit;
      opacity: .7;
    }
  }
</style>
