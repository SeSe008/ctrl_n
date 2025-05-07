<script lang="ts">
  import type { Component } from "svelte";

  import Text from "$lib/Components/Settings/Elements/text.svelte";
  import Select from "$lib/Components/Settings/Elements/select.svelte";

  import type { Options as TextProps } from "$lib/Components/Settings/Elements/text.svelte";
  import type { Options as SelectProps } from "$lib/Components/Settings/Elements/select.svelte";

  type ElementProps = TextProps | SelectProps;
  
  export interface Element {
    elementType: string;
    elementOptions: ElementProps;
    changeFunction?: () => void;
  }
  
  interface Props {
    settingsEnabled?: boolean;
    elements: Element[];
  }

  let { settingsEnabled = $bindable(), elements }: Props = $props();

  interface ElementComponents {
    [key: string]: Component<any>;
  }
  
  const elementComponents: ElementComponents = {
    "text": Text,
    "select": Select,
  };
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
