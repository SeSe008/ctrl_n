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
  let searchEngineName: string = defaultSearchEngine;
  
  const searchEngines: SearchEngines = {
    'ecosia': {
      name: 'Ecosia',
      url: 'https://ecosia.org/search',
      searchParam: 'q=',
      suggestions: {
	endpoint: 'https://ac.ecosia.org/autocomplete',
	searchParam: 'q=',
	extras: []
      },
      extras: ['addon=opensearch']
    },
    'ekuro': {
      name: 'Ekuro',
      url: 'https://www.ekoru.org/',
      searchParam: 'q=',
      suggestions: {
	endpoint: 'https://api.oceanhero.today/suggestions',
	searchParam: 'q=',
	extras: []
      },
      extras: []
    },
    'duckduckgo': {
      name: 'DuckDuckGo',
      url: 'https://duckduckgo.com/',
      searchParam: 'q=',
      suggestions: {
	endpoint: 'https://ac.duckduckgo.com/ac/',
	searchParam: 'q=',
	extras: ['type=list']
      },
      extras: []
    },
    'startpage': {
      name: 'Startpage',
      url: 'https://www.startpage.com/sp/search',
      searchParam: 'query=',
      suggestions: {
	endpoint: 'https://ac.duckduckgo.com/ac/',
	searchParam: 'q=',
	extras: ['type=list']
      },
      extras: []
    },
    'google': {
      name: 'Google',
      url: 'https://www.google.com/search',
      searchParam: 'q=',
      suggestions: {
	endpoint: 'https://suggestqueries.google.com/complete/search',
	searchParam: 'q=',
	extras: ['client=firefox']
      },
      extras: []
    },
    'microsoft-bing': {
      name: 'Bing',
      url: 'https://www.bing.com/search',
      searchParam: 'q=',
      suggestions: {
	endpoint: 'https://api.bing.com/osjson.aspx',
	searchParam: 'query=',
	extras: []
      },
      extras: []
    }
  };

  function storeEngine() {
    localStorage.setItem('defaultSearchEngine', searchEngineName);
  }

  function search(text: string) {
    const searchEngine: SearchEngine = searchEngines[searchEngineName];

    const query: string = `${searchEngine.searchParam}${encodeURIComponent(text)}`;
   
    const extras: string = searchEngine.extras.join('&');
    
    window.location.href = `${searchEngine.url}?${query}&${extras}`
  }

  let suggestions: string[] = [];
  let selectedSuggestion: number = -1;
  let originalText = '';
  
  async function fetchSuggestions() {
    if (searchBar.value === '') {
      suggestions = [];
      return;
    }
    
    const searchEngine: SearchEngine = searchEngines[defaultSearchEngine];
    const suggestionEndpoint: SuggestionEndpoint = searchEngine.suggestions;
    
    const response = await fetch('/api/suggestions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        suggestionEndpoint: suggestionEndpoint,
        queryText: searchBar.value
      })
    });

    const result: Suggestion = await response.json();
    
    suggestions = result.suggestions;
 }

  function selectSuggestion(e: KeyboardEvent) {
    const key = e.key;
    if (key === 'ArrowUp' && selectedSuggestion > -1) {
      e.preventDefault();
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
      e.preventDefault();
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

    searchEngineName = localStorage.getItem('defaultSearchEngine') || defaultSearchEngine;
  });
</script>

<div id="search">
  <div id="inputs">
    <select bind:value={searchEngineName} on:change={storeEngine}>
      {#each Object.entries(searchEngines) as [searchEngineKey, searchEngine] (searchEngineKey)}
	<option value={searchEngineKey}>
	  <Icon icon={"arcticons-" + searchEngineKey} />
	  {searchEngine.name}
	</option>
      {/each}
    </select>
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

  #inputs > select {
    grid-column: 1 / 3;
    min-width: 30%;
    outline: none;
    color: rgb(var(--c1));
    border: 1px solid rgb(var(--c2));
    background-color: rgb(var(--c4));
    border-radius: .5rem;
    padding: .75rem 2rem;
    margin: 1rem 0;
    justify-self: center;
    font-size: calc(10px + 1vmin);
    font-weight: bold;
  }

  #inputs > select::picker(select) {
    background-color: rgb(var(--c4));
    color: rgb(var(--c1));
  }

  :global(#inputs > select .iconify--arcticons) {
    font-size: calc(10px + 2vmin);
    stroke-width: 2px;
  }

  #inputs > select, #inputs > select::picker(select) {
    appearance: base-select;
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
