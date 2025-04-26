<script lang="ts">
  import { onMount } from 'svelte';
  import Icon from '@iconify/svelte';

  interface Bookmark {
    name: string;
    url: string;
  }

  type Bookmarks = {
    [key: string]: Bookmark;
  }

  let bookmarks: Bookmarks = {};
  let newBookmarkName: HTMLInputElement;
  let newBookmarkUrl: HTMLInputElement;

  function addBookmark() {
    bookmarks[newBookmarkName.value] = {
      name: newBookmarkName.value,
      url: newBookmarkUrl.value
    };

    window.localStorage.setItem('savedBookmarks', JSON.stringify(bookmarks));

    newBookmarkName.value = '';
    newBookmarkUrl.value = '';
  }

  function deleteBookmark(key: string) {
    delete bookmarks[key];
    bookmarks = { ...bookmarks };
    window.localStorage.setItem('savedBookmarks', JSON.stringify(bookmarks));
  }
  
  onMount(() => {
    const raw = window.localStorage.getItem('savedBookmarks');
    let parsed: unknown;
    try {
      parsed = raw ? JSON.parse(raw) : {};
    } catch {
      parsed = {};
    }

    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      bookmarks = parsed as Bookmarks;
    } else {
      bookmarks = {};
      window.localStorage.removeItem('savedBookmarks');
    }
  }); 
</script>

<div id="bookmarks">
  <h2><Icon icon="material-symbols:bookmarks" /> Bookmarks</h2>
  {#if bookmarks}
    {#each Object.entries(bookmarks) as [bookmarkKey, bookmark] (bookmarkKey) }
      <div class="bookmark">
	<a href={bookmark.url} target="_blank" rel="noopener noreferrer">
	  <Icon icon="mdi:link" />
	  {bookmark.name}
	</a>
	<button on:click={() => deleteBookmark(bookmarkKey)}><Icon icon="mdi:delete" /></button>
      </div>
    {/each}
  {/if}
  <div id="inputs">
    <input bind:this={newBookmarkName} type="text" placeholder="Bookmark Name" />
    <input bind:this={newBookmarkUrl} type="text" placeholder="Bookmark Url" />
    <button on:click={addBookmark}>Add</button>
  </div>
</div>

<style>
  #bookmarks {
    display: flex;
    flex-direction: column;
    gap: .5rem;
    overflow: auto;

    height: 100%;
    max-height: 100%;
    width: 100%;

    background-color: rgba(var(--c1), .3);
    border: 1px solid rgb(var(--c2));
    border-radius: 1rem;
    box-sizing: border-box;
    padding: 1rem;
  }

  #bookmarks h2 {
    align-self: center;
    margin: 0;
    margin-bottom: 1vmin;
    
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: .5rem;

    width: max-content;
    padding: .5rem;
    box-sizing: border-box;
    border-radius: 1vmin;
    
    color: rgb(var(--c2));
    background-color: rgba(var(--c1), .7);
  }

  .bookmark {
    display: flex;
    flex-direction: row;

    font-size: 2vmin;
    padding: 0 .25rem;

    background-color: rgba(var(--c1), .7);
    color: rgb(var(--c2));

    border: 1px solid rgb(var(--c2));
    border-radius: 1vmin;

    transition: transform .2s ease-in-out;
  }

  .bookmark:hover {
    transform: scale(1.01);
  }

  .bookmark  a {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: .5rem;

    text-decoration: none;
    word-break: break-all;
    
    width: 100%;
    color: inherit;
  }

  .bookmark button {
    display: flex;
    flex-direction: row;
    align-items: center;
    outline: none;
    border: none;
    background-color: transparent;
    color: rgb(var(--c2));
    font-size: inherit;
    cursor: pointer;
  }

  #inputs {
    display: flex;
    flex-direction: row;
    
    height: min-content;
    width: 100%;
  }

  #inputs > input {
    outline: none;
    font-size: calc(5px + .75vmin);

    width: 100%;
    justify-self: stretch;

    border: 1px solid rgb(var(--c2));
    border-right: none;
    padding: .25rem;

    color: rgb(var(--c2));
    background-color: rgb(var(--c1));
  }

  #inputs > input::placeholder {
    color: rgb(var(--c2));
  }

  #inputs > input:first-child {
    border-radius: .5rem 0 0 .5rem;
  }

  #inputs > button {
    border-radius: 0 .5rem .5rem 0;
    border: 1px solid rgb(var(--c2));
    border-left: none;
    outline: none;
    color: rgb(var(--c2));
    background-color: rgb(var(--c3));
    cursor: pointer;
    font-size: calc(5px + .75vmin);
    padding: 0 .25rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    white-space: nowrap;
  }
</style>

