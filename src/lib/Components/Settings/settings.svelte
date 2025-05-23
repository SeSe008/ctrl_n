<script lang="ts">
  import { elementComponents } from '$lib/constants/settings';
  import { settings, toggleSettings } from '$lib/stores/settings/settings';
  import { globalTiles } from '$lib/stores/tiles';
  import { tileDefs } from '$lib/constants/tileDefs';
  import TileElement from '$lib/Components/tileElement.svelte';
</script>

{#if $settings.enabled}
  <aside id="settings">
    {#if $settings.selectedManager !== undefined && $settings.selectedTile !== undefined && $globalTiles[$settings.selectedManager].tiles[$settings.selectedTile].element !== undefined}
      <div id="elements">
	{#each tileDefs[$globalTiles[$settings.selectedManager].tiles[$settings.selectedTile].element].tileProps as element, i (i)}
	  {#if elementComponents[element.elementType]}
            {@const Comp = elementComponents[element.elementType]}
            <div class="element"><Comp options={element.elementOptions} /></div>
	  {/if}
	{/each}
        <h2>Tile Preview</h2>
	<div id="tile_preview" inert>
	  <TileElement managerId={$settings.selectedManager} tileId={$settings.selectedTile} />
	</div>
      </div>
    {/if}
    <div id="close_controls">
      <button onclick={() => toggleSettings()}>
	Close
      </button>
    </div>
  </aside>
{/if}
  
<style>
  #settings {
    position: fixed;
    overflow: hidden;

    inset: 5%;
    width: 90%;
    height: 90%;

    display: grid;
    grid-template-rows: minmax(0, 1fr) auto;
    
    background-color: rgba(var(--c1), .9);
    color: rgb(var(--c2));
    border: 1px solid rgb(var(--c2));
    border-radius: 1rem;
    
    z-index: 100;
  }

  #elements {
    flex-grow: 1;
    width: 100%;

    display: flex;
    flex-direction: column;
    gap: .5rem;

    padding: 1rem;
    box-sizing: border-box;

    overflow-y: auto;
  }

  #elements h2 {
    font-size: 2em;
    font-weight: bold;
    align-self: center;
  }

  #tile_preview {
    display: flex;
    flex-direction: column;
    align-items: center;

    width: 100%;
    min-height: 50%;
    max-height: 50%;

    padding-bottom: 1rem;
  }

  :global {
    #tile_preview .tile_element {
      max-width: 75% !important;
      pointer-events: none !important;
      cursor: not-allowed !important;
    }
    
    #tile_preview .tile_element > #inputs {
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

    .element span {
      color: inherit;
      font-size: calc(8px + 1vmin);
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
