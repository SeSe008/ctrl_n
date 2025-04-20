<script lang="ts">
  import { onMount } from 'svelte';

  import Icon from "@iconify/svelte";

  interface RecentlySearched {
    query: string;
    amount: number;
  }

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

  function isUrl(str: string) {
   const regUrl = /(?:localhost:\d{1,5}|[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6})(\b[-a-zA-Z0-9()@:%_+.~#?&//=]*)/gi;
   return !!str.match(regUrl);
  }

  function makeExternal(url: string) {
    if (!/^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//i.test(url)) {
      url = 'http://' + url;
    }
    return url;
  }
  
  function search(text: string) {
    const recentSearch: RecentlySearched | undefined = recentSearches.find(search => search.query.startsWith(text))

    if (recentSearch) {
      recentSearch.amount++;
      window.localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
    } else if (!recentSearch && recentSearches.length < 50) {
      recentSearches.push({
	query: text,
	amount: 1
      });
      window.localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
    }
    
    if (isUrl(text)) {
      window.location.href = makeExternal(text);
      return;
    }
    
    const searchEngine: SearchEngine = searchEngines[searchEngineName];

    const query: string = `${searchEngine.searchParam}${encodeURIComponent(text)}`;
   
    const extras: string = searchEngine.extras.join('&');
    
    window.location.href = `${searchEngine.url}?${query}&${extras}`
  }

  let recentSearches: RecentlySearched[];
  
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

  function getRecentSearches() {
    if (searchBar.value === '') return;

    // Find search having max amound and starting with query
    const recentSearch: RecentlySearched | undefined = recentSearches.reduce<RecentlySearched | undefined>(
      (max, curr) => {
	return curr.query.startsWith(searchBar.value) && (max === undefined || curr.amount > max.amount)
	  ? curr
	  : max;
      },
      undefined
    );

    
    if (recentSearch) {
      suggestions.pop();
      suggestions.unshift(recentSearch.query);

      // Trigger svelte reactivity
      suggestions = [...suggestions];

      selectedSuggestion = 0;
      searchBar.value = suggestions[selectedSuggestion];
      searchBar.focus();
      searchBar.setSelectionRange(originalText.length, searchBar.value.length);
      
      changeSuggestionStyle();
    }
  }

  function changeSuggestionStyle() {
    document.getElementsByClassName('selected_suggestion')[0]?.classList.remove('selected_suggestion');
    document.getElementsByClassName('suggestion')[selectedSuggestion]?.classList.add('selected_suggestion');
  }

  function selectSuggestion(e: KeyboardEvent) {
    const key = e.key;
    if (key === 'ArrowUp' && selectedSuggestion > -2) {
      e.preventDefault();
      selectedSuggestion--;

      if (selectedSuggestion > -1) {
	searchBar.value = suggestions[selectedSuggestion]

	changeSuggestionStyle();
      } else if (selectedSuggestion == -1) {
	searchBar.value = originalText;
	changeSuggestionStyle();
      } else if (selectedSuggestion < -1) {
	suggestions = [];
	selectedSuggestion = -1;
      }
    } else if (key === 'ArrowDown' && selectedSuggestion < suggestions.length - 1) {
      e.preventDefault();
      selectedSuggestion++;
      searchBar.value = suggestions[selectedSuggestion];

      changeSuggestionStyle();
    }
  }

  let lastKey: string;

  function handleKeydown(e: KeyboardEvent) {
    lastKey = e.key;
    
    if (e.key === 'Enter') {
      search(searchBar.value);
    } else {
      selectSuggestion(e);
    }
  }

  function isControlKey(key: string) {
    return key.length > 1;
  }


  async function handleInput() {
    originalText = searchBar.value;
    await fetchSuggestions();
    if (!isControlKey(lastKey)) getRecentSearches();
  }

  let searchBar: HTMLInputElement;
  
  onMount(() => {
    searchBar.focus();

    searchEngineName = localStorage.getItem('defaultSearchEngine') || defaultSearchEngine;

    try {
      recentSearches = JSON.parse(window.localStorage.getItem('recentSearches') || '');
    } catch {
      recentSearches = [];
    }
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
    {#each suggestions as suggestion, i (i)}
      <span class="suggestion">{suggestion}</span>
    {/each}
  </div>
</div>

<style>
  #search {
    position: relative;
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
    position: absolute;
    top: 100%;
    width: calc(100% - .75rem);
    display: flex;
    flex-direction: column;
    text-align: left;
    color: rgb(var(--c2));
    border-radius: 0 0 .5rem .5rem;
    background-color: rgb(var(--c3));
    overflow: hidden;
    z-index: 10;
  }

  .suggestion {
    width: 100%;
    height: min-content;
    padding: .5rem;
    box-sizing: border-box;
  }

  :global(.selected_suggestion) {
    background-color: rgba(var(--c1), .3);
  }
</style>
