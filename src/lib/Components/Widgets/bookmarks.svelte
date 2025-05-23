<script lang="ts">
  import { onMount } from 'svelte';
  import Icon from '@iconify/svelte';

  import { bookmarks, parseBookmarks, removeBookmark } from '$lib/stores/widgets/bookmarks';

  import { editMode } from '$lib/stores/editMode';

  function deleteBookmark(id: number) {
    removeBookmark(id);
  }
  
  onMount(() => {
    parseBookmarks();
  }); 
</script>

<div id="bookmarks">
  <h2><Icon icon="material-symbols:bookmarks" /> Bookmarks</h2>

  {#if $bookmarks}
    <div id="bookmark_list">
      {#each $bookmarks as { name, url }, i (i) }
	<div class="bookmark">
	  <a href={url} target="_blank" rel="noopener noreferrer">
	    <img alt="Favicon" src={`https://icons.duckduckgo.com/ip3/${url.split('/')[2]}.ico`} />
	    <span>{name}</span>
	  </a>
	  {#if $editMode}
	    <button onclick={() => deleteBookmark(i)}><Icon icon="mdi:delete" /></button>
	  {/if}
	</div>
      {/each}
    </div>
  {/if}
</div>
    
<style>
  #bookmarks {
    display: grid;
    grid-template-rows: min-content 1fr;
    grid-template-columns: 1fr;
    gap: .5rem;
    overflow-y: auto;
    overflow-x: hidden;

    height: 100%;
    max-height: 100%;
    width: 100%;

    background-color: rgba(var(--c1), var(--o1));
    border: 1px solid rgb(var(--c2));
    border-radius: 1rem;
    box-sizing: border-box;
    padding: 1rem;
  }

  #bookmarks h2 {
    justify-self: center;
    margin: 0;
    margin-bottom: 1vmin;
    grid-column: 1 / -1;
    
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: .5rem;

    width: max-content;
    padding: .5rem;
    box-sizing: border-box;
    border-radius: 1vmin;
    
    color: rgb(var(--c2));
    background-color: rgba(var(--c1), var(--o2));
  }

  #bookmark_list {
    display: flex;
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .bookmark {
    width: min-content;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: .5rem;
    width: calc(8px + 8vmin);
    overflow-x: hidden;
  }
  
  .bookmark a {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    width: 100%;
    
    overflow: hidden;
    box-sizing: border-box;
    padding: .25rem .5rem;
    border-radius: 1vmin;

    background-color: rgba(var(--c1), var(--o2));
    color: rgb(var(--c2));
    
    text-decoration: none;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: calc(8px + 1vmin);

    transition: transform .2s ease-in-out;
  }

  .bookmark a span {
    display: block;
    width: 100%;
    min-width: 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-align: center;
    font-size: calc(8px + 1vmin);
  }

  .bookmark a:hover {
    transform: scale(1.01);
  }

  .bookmark img {
    box-sizing: border-box;
    background-color: white;
    padding: .5rem;
    border-radius: 10%;
    width: 100%;
  }

  .bookmark button {
    display: flex;
    flex-direction: row;
    align-items: center;
    outline: none;
    border: none;
    background-color: rgba(var(--c1), var(--o2));
    color: rgb(var(--c2));
    padding: .25rem;
    border-radius: .25vmin;
    font-size: inherit;
    cursor: pointer;
  }
</style>
