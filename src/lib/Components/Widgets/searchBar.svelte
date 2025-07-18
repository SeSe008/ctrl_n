<script lang="ts">
  import { onMount } from 'svelte';
  import Icon from '@iconify/svelte';
  import { parse } from 'mathjs';

  import { searchEngines } from '$lib/constants/searchEngines';
  import type { SearchEngine, SuggestionEndpoint } from '$lib/types/widgets/searchEngines';

  import { resize } from '$lib/utils/resize';
  import { addError } from '$lib/stores/errors';
  import { getTileWidgetOptions } from '$lib/stores/tiles';

  const { tileId, managerId } = $props();
  const options = getTileWidgetOptions(managerId, tileId);

  let searchEngine = $state<SearchEngine>(searchEngines['ecosia']);

  if (
    options &&
    typeof options.searchEngineName === 'string' &&
    searchEngines[options.searchEngineName]
  ) {
    searchEngine = searchEngines[options.searchEngineName];
  }

  interface RecentlySearched {
    query: string;
    amount: number;
  }

  type Suggestion = [string, string[]];

  function isUrl(str: string) {
    const urlRe =
      /^(?:https?:\/\/)?(?:localhost:\d{1,5}|(?:[A-Za-z0-9-]+\.)+[A-Za-z]{2,})(?:\/\S*)?$/;
    return urlRe.test(str);
  }

  function makeExternal(url: string) {
    if (!/^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//i.test(url)) {
      url = 'http://' + url;
    }
    return url;
  }

  function search(text: string) {
    if (text === '') return;

    saveRecentSearch(text);

    if (isUrl(text)) {
      window.location.href = makeExternal(text);
      return;
    }

    const query: string = `${searchEngine.searchParam}${encodeURIComponent(text)}`;

    const extras: string = searchEngine.extras.join('&');

    window.location.href = `${searchEngine.url}?${query}&${extras}`;
  }

  const MAX_RECENT = 50;
  let recentCache: Map<string, RecentlySearched>;
  let suggestions = $state<string[]>([]);
  let selectedSuggestion: number = -1;
  let originalText = '';

  async function fetchSuggestions() {
    if (searchBar.value === '') {
      suggestions = [];
      return;
    }

    const suggestionEndpoint: SuggestionEndpoint = searchEngine.suggestions;

    const response = await fetch('/api/suggestions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        suggestionEndpoint: suggestionEndpoint,
        queryText: searchBar.value
      })
    });

    if (!response.ok) {
      addError('suggestions', (await response.json()).error);
      return;
    }

    const result: Suggestion = await response.json();

    suggestions = result[1];
  }

  function testExpression(expression: string) {
    try {
      const node = parse(expression);

      if (node.type == 'ConstantNode') return;

      const result = node.evaluate();
      return result;
    } catch {
      return;
    }
  }

  function evalMathSuggestion() {
    const text: string = searchBar.value;
    const res: number | undefined = testExpression(text);

    if (res) {
      suggestions = [`${text} = ${res}`, ...suggestions.splice(-1)];
    }
  }

  function saveRecentSearch(text: string) {
    if (recentCache.has(text)) {
      const searchEntry = recentCache.get(text)!;
      searchEntry.amount++;
      recentCache.delete(text);
      recentCache.set(text, searchEntry);
    } else {
      if (recentCache.size >= MAX_RECENT) {
        const oldestEntry = recentCache.keys().next().value!;
        recentCache.delete(oldestEntry);
      }

      recentCache.set(text, { query: text, amount: 1 });
    }

    window.localStorage.setItem('recentSearches', JSON.stringify(Array.from(recentCache.values())));
  }

  function getRecentSearches() {
    if (searchBar.value === '') return;

    // Get array from map
    const recentSearches = Array.from(recentCache.values());

    // Find search having max amound and starting with query
    const recentSearch: RecentlySearched | undefined = recentSearches.reduce<
      RecentlySearched | undefined
    >((max, curr) => {
      return curr.query.startsWith(searchBar.value) &&
        (max === undefined || curr.amount > max.amount)
        ? curr
        : max;
    }, undefined);

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
    document
      .getElementsByClassName('selected_suggestion')[0]
      ?.classList.remove('selected_suggestion');
    document
      .getElementsByClassName('suggestion')
      [selectedSuggestion]?.classList.add('selected_suggestion');
  }

  function selectSuggestion(e: KeyboardEvent) {
    const key = e.key;
    if (key === 'ArrowUp' && selectedSuggestion > -2) {
      e.preventDefault();
      selectedSuggestion--;

      if (selectedSuggestion > -1) {
        searchBar.value = suggestions[selectedSuggestion];

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
    if (!isControlKey(lastKey)) {
      getRecentSearches();
      evalMathSuggestion();
    }
  }

  let searchBar: HTMLInputElement;
  let searchInputs: HTMLDivElement;

  let suggestionsLeft = $state<number>();
  let suggestionsWidth = $state<number>();

  function setSuggestionStyle(left: number, width: number) {
    suggestionsLeft = left;
    suggestionsWidth = width;
  }

  function searchBarResizeListener(entry: ResizeObserverEntry) {
    const { width } = entry.contentRect;
    const left = entry.target.getBoundingClientRect().left;

    setSuggestionStyle(left, width);
  }

  onMount(() => {
    const recentEntries: [string, RecentlySearched][] = JSON.parse(
      window.localStorage.getItem('recentSearches') || '[]'
    ).map((item: RecentlySearched) => [item.query, item]);

    recentCache = new Map<string, RecentlySearched>(recentEntries);

    let searchInputsRect = searchInputs.getBoundingClientRect();
    setSuggestionStyle(searchInputsRect.left, searchInputsRect.width);
  });
</script>

<div id="search">
  <div id="inputs" bind:this={searchInputs} use:resize={searchBarResizeListener}>
    <input
      onkeydown={handleKeydown}
      oninput={handleInput}
      type="text"
      placeholder="Search"
      bind:this={searchBar}
    />
    <button
      onclick={() => {
        search(searchBar.value);
      }}><Icon icon="mdi:search" /></button
    >
  </div>
  <div id="suggestions" style="--left: {suggestionsLeft}; --width: {suggestionsWidth}">
    {#each suggestions as suggestion, i (i)}
      <button onclick={() => search(suggestion)} class="suggestion">{suggestion}</button>
    {/each}
  </div>
</div>

<style>
  #search {
    position: relative;
    width: 100%;
    height: min-content;
  }

  #inputs {
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: row;
  }

  #inputs > input {
    outline: none;
    padding: 0.5rem;
    font-size: calc(10px + 1vmin);

    border: var(--tileBorder, 1px solid rgb(var(--c2)));
    border-right: none;
    border-radius: var(--tileBorderRadius) 0 0 var(--tileBorderRadius);

    color: rgb(var(--c2));
    background-color: rgba(var(--c1), var(--o1));
    transition: background-color 0.2s;
    flex-grow: 1;
  }

  #inputs > input:focus {
    background-color: rgba(var(--c1));
  }

  #search:focus-within #suggestions {
    display: flex;
  }

  #inputs > button {
    display: flex;
    flex-direction: row;
    align-items: center;

    border: var(--tileBorder, 1px solid rgb(var(--c2)));
    border-left: none;
    border-radius: 0 var(--tileBorderRadius) var(--tileBorderRadius) 0;
    outline: none;

    color: rgb(var(--c5));
    background-color: rgb(var(--c3));

    cursor: pointer;

    font-size: calc(10px + 2vmin);

    padding: 0 1rem;
  }

  #suggestions {
    position: fixed;
    display: none;
    flex-direction: column;
    text-align: left;

    left: calc(var(--left) * 1px + 0.5rem);
    width: calc(var(--width) * 1px - 1rem);

    overflow: hidden;

    color: rgb(var(--c1));
    background-color: rgb(var(--c3));
    border-radius: 0 0 0.5rem 0.5rem;

    z-index: 10;
  }

  #search:has(#inputs > input:focus) #suggestions {
    display: flex;
  }

  .suggestion {
    width: 100%;

    height: min-content;
    padding: 0.5rem;
    box-sizing: border-box;

    color: inherit;
    background-color: rgb(var(--c3));

    border: none;
    outline: none;

    font-size: inherit;
    text-align: inherit;
  }

  .suggestion:hover,
  :global(.selected_suggestion) {
    background-color: rgba(var(--c1), 0.3) !important;
  }
</style>
