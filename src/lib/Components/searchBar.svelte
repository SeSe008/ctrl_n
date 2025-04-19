<script lang="ts">
  import { onMount } from 'svelte';

  import Icon from "@iconify/svelte";

  interface Suggestion {
    query: string;
    suggestions: string[];
  }
  
  interface SuggestionEndpoint {
    endpoint: string;
    searchParam: string;
    extras: string[];
  };
  
  interface SearchEngine {
    name: string;
    url: string;
    searchParam: string;
    suggestions: SuggestionEndpoint;
    extras: string[];
  }

  type SearchEngines = {
    [key: string]: SearchEngine;
  }

  const defaultSearchEngine: string = 'ecosia';
  
  const searchEngines: SearchEngines = {
    'ecosia': {
      name: 'ecosia',
      url: 'https://ecosia.org/search',
      searchParam: 'q=',
      suggestions: {
	endpoint: 'https://ac.ecosia.org/autocomplete',
	searchParam: 'q=',
	extras: []
      },
      extras: ['addon=opensearch']
    }
  };

  function search(text: string) {
    const searchEngine: SearchEngine = searchEngines[defaultSearchEngine];

    const query: string = `${searchEngine.searchParam}${encodeURIComponent(text)}`;
   
    const extras: string = searchEngine.extras.join('&');
    
    window.location.href = `${searchEngine.url}?${query}&${extras}`
  }

  let suggestions: string[] = [];
  let selectedSuggestion: number = -1;
  let originalText = '';
  
  function fetchSuggestions() {
    if (searchBar.value === '') {
      suggestions = [];
      return;
    }
    
    const searchEngine: SearchEngine = searchEngines[defaultSearchEngine];
    const suggestionsEndpoint: SuggestionEndpoint = searchEngine.suggestions;
    
    const query: string = `${suggestionsEndpoint.searchParam}${encodeURIComponent(searchBar.value)}`;
   
    const extras: string = suggestionsEndpoint.extras.join('&');

    const url: string = `${suggestionsEndpoint.endpoint}?${query}&${extras}`
    
    fetch(url)
      .then(response => {
	if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
	}
	return response.json() as Promise<Suggestion>;
      })
      .then(data => {
	suggestions = data.suggestions;
      })
      .catch(error => {
	console.error('Error fetching suggestions:', error);
      });
  }

  function selectSuggestion(e: KeyboardEvent) {
    const key = e.key;
    if (key === 'ArrowUp' && selectedSuggestion > -1) {
      selectedSuggestion--;

      if (selectedSuggestion > -1) {
	searchBar.value = suggestions[selectedSuggestion]

	document.getElementsByClassName('selected_suggestion')[0]?.classList.remove('selected_suggestion');
	document.getElementsByClassName('suggestion')[selectedSuggestion]?.classList.add('selected_suggestion');
      } else {
	searchBar.value = originalText;
	document.getElementsByClassName('selected_suggestion')[0]?.classList.remove('selected_suggestion');
      }
    } else if (key === 'ArrowDown' && selectedSuggestion < suggestions.length - 1) {
      selectedSuggestion++;
      searchBar.value = suggestions[selectedSuggestion];

      document.getElementsByClassName('selected_suggestion')[0]?.classList.remove('selected_suggestion');
      document.getElementsByClassName('suggestion')[selectedSuggestion]?.classList.add('selected_suggestion');
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      search(searchBar.value);
    } else {
      selectSuggestion(e);
    }
  }

  function handleInput() {
    originalText = searchBar.value;
    fetchSuggestions();
  }
  
  let searchBar: HTMLInputElement;

  
  onMount(() => {
    searchBar.focus();
  });
</script>

<div id="search">
  <div id="inputs">
    <input on:keydown={handleKeydown} on:input={handleInput} type="text" placeholder="Search" bind:this={searchBar} />
    <button on:click={() => {search(searchBar.value)}}><Icon icon="line-md:search-twotone" /></button>
  </div>
  <div id="suggestions">
    {#each suggestions as suggestion (suggestion)}
      <span class="suggestion">{suggestion}</span>
    {/each}
  </div>
</div>

<style>
  #search {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 75%;
  }

  #inputs {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr min-content;
  }

  #inputs > input {
    outline: none;
    padding: .5rem;
    font-size: calc(10px + 1vmin);
    border-radius: .5rem 0 0 .5rem;
    border: 1px solid rgb(var(--c2));
    border-right: none;
    color: rgb(var(--c2));
    background-color: rgb(var(--c1));
  }

  #inputs > input::placeholder {
    color: rgb(var(--c4));
  }

  #inputs > button {
    border-radius: 0 .5rem .5rem 0;
    border: 1px solid rgb(var(--c2));
    border-left: none;
    outline: none;
    color: rgb(var(--c2));
    background-color: rgb(var(--c3));
    cursor: pointer;
    font-size: calc(10px + 2vmin);
    padding: 0 1rem;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  #suggestions {
    display: none;
  }

  #search:has(#inputs > input:focus) #suggestions {
    width: calc(100% - .75rem);
    display: flex;
    flex-direction: column;
    text-align: left;
    color: rgb(var(--c2));
    border-radius: 0 0 .5rem .5rem;
    overflow: hidden;
  }

  .suggestion {
    width: 100%;
    height: min-content;
    opacity: .7;
    padding: .5rem;
    background-color: rgb(var(--c3));
    box-sizing: border-box;
  }

  :global(.selected_suggestion) {
    opacity: 1 !important;
  }
</style>
