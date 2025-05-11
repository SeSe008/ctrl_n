<script lang="ts">
  import type { Element } from '$lib/types/settings';
  import { elementComponents } from '$lib/constants/settings';
  
  interface Props {
    settingsEnabled?: boolean;
    elements: Element[];
  }

  let { settingsEnabled = $bindable(), elements }: Props = $props();
</script>

<aside id="settings">
  <div id="elements">
    {#each elements as element, i (i)}
      {#if elementComponents[element.elementType]}
        {@const Comp = elementComponents[element.elementType]}
        <Comp options={element.elementOptions} /> 
      {/if}
    {/each}
  </div>
  <div id="closeControls">
    <button onclick={() => settingsEnabled = false}>
      Close
    </button>
  </div>
</aside>

<style>
  #settings {
    position: fixed;
    overflow: hidden;

    inset: 5%;
    width: 90%;
    height: 90%;

    display: flex;
    flex-direction: column;
    
    background-color: rgba(var(--c1), .9);
    color: rgb(var(--c2));
    border: 1px solid rgb(var(--c2));
    border-radius: 1rem;
    
    z-index: 100;
  }

  :global {
    #settings button {
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

    #settings button:hover {
      opacity: .7;
    }

    #settings select {
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

    #settings select::picker(select) {
      appearance: base-select;

      color: inherit;
      background-color: inherit;
    }

    #settings span {
      color: inherit;
      font-size: calc(8px + 1vmin);
    }

    #settings input[type="range"] {
      -webkit-appearance: none;
      appearance: none;
      width: 6rem;
      height: 1.2rem;
      padding: 0;
      margin: 0;
      background: transparent;
      cursor: pointer;
    }

    #settings input[type="range"]::-webkit-slider-runnable-track {
      height: .4rem;
      background-color: rgb(var(--c1));
      border: 1px solid rgb(var(--c2));
      border-radius: .3rem;
    }

    #settings input[type="range"]::-moz-range-track {
      height: .4rem;
      background-color: rgb(var(--c1));
      border: 1px solid rgb(var(--c2));
      border-radius: .3rem;
    }

    #settings input[type="range"]::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 1rem;
      height: 1rem;
      margin-top: -.35rem;
      background-color: rgb(var(--c2));
      border: 1px solid rgb(var(--c2));
      border-radius: 50%;
    }

    #settings input[type="range"]::-moz-range-thumb {
      width: 1rem;
      height: 1rem;
      background-color: rgb(var(--c2));
      border: 1px solid rgb(var(--c2));
      border-radius: 50%;
    }

    #settings input[type="range"]:focus {
      outline: none;
    }
  }

  #elements {
    flex-grow: 1;
    width: 100%;

    display: flex;
    flex-direction: column;

    padding: 1rem;
    box-sizing: border-box;
  }

  #closeControls {
    align-self: flex-end;
    justify-self: stretch;
    width: 100%;
    
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;

    padding: .5rem;
    box-sizing: border-box;

    background-color: rgb(var(--c1));
    border-top: 1px solid rgb(var(--c2));
  }
</style>
