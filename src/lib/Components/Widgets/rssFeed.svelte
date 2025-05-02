<script lang="ts">
  import DOMPurify from "dompurify";
  import { onMount } from "svelte";

  import { editMode } from "$lib/stores/editMode";
  import type { Article } from "$lib/types/rss";
	import errorMap from "zod/locales/en.js";

  let articles: Article[] = [];
  let error: string;

  async function parseRss() {
    const url = window.localStorage.getItem('rssURL') || ''; 
    
    const resp = await fetch('/api/rss', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: url })
    });

    if (resp.ok) {
      articles = await resp.json();
      error = "";
    } else {
      articles = [];
      error = (await resp.json()).error;
    }
  }

  let rssURL: HTMLInputElement;
  
  function changeRss() {
    window.localStorage.setItem('rssURL', rssURL.value);

    parseRss();
  }

  onMount(() => {
    parseRss();
  });
</script>

<div id="rss-feed">
  {#if $editMode}
    <h2>Rss Feed</h2>
    <div id='inputs'>
      <input bind:this={rssURL} type="text" placeholder="New RSS Url" />
      <button on:click={changeRss}>Change</button>
    </div>
  {:else}
    <div id="articles">
      <h2>Rss Feed</h2>
      {#each articles as article (article)}
	<a href={article.link} target="_blank">
	  <div class="article">
	    <h3>{article.title}</h3>
	    {#if article.imageUrl}
	      <img src={article.imageUrl} alt={article.title} />
	    {/if}
	    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
	    <div>{@html DOMPurify.sanitize(article.desc)}</div>
	  </div>
	</a>
      {/each}
    </div>
  {/if}
  {#if error}
    <div class="error">Error parsing RSS: {error}</div>
  {/if}
</div>

<style>
  #rss-feed {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    background-color: rgba(var(--c1), .3);
    border: 1px solid rgb(var(--c2));
    border-radius: 1rem;
    container-type: inline-size;
    box-sizing: border-box;
  }

  #rss-feed h2 {
    justify-self: center;
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

  #rss-feed > h2 {
    margin-top: 1rem;
  }
  
  #articles {
    display: grid;
    gap: .3rem;
    grid-template-columns: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 1rem;
    box-sizing: border-box;
  }
  
  @container (min-width: 512px) {
    #articles {
      grid-template-columns: repeat(2, 50%) !important;
    }
  }
  
  @container (min-width: 1024px) {
    #articles {
      grid-template-columns: repeat(3, 33.33%) !important;
    }
  }

  #articles > h2 {
    grid-column: 1 / -1;
  }

  #articles > a {
    position: relative;
    display: block;
    text-decoration: none;
    color: inherit;
  }
  
  .article {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: rgba(var(--c1), .5);
    border: 1px solid rgb(var(--c2));
    height: 100%;
    color: rgb(var(--c2));
    border-radius: .5rem;
    padding: .5rem;
    box-sizing: border-box;
    transition: transform .2s, filter .5s;
  }

  .article h3 {
    font-size: calc(6px + 1.5vmin);
  }

  .article:hover {
    transform: scale(1.01);
    filter: drop-shadow(0 0 1rem rgb(var(--c2)));
  }
  
  .article > div {
    width: 100%;
    text-align: justify;
  }
  
  .article img {
    max-width: 75%;
    display: inline-block;
    border-radius: .5rem;
    border: 1px solid rgb(var(--c2));
    margin: 0 auto;
    display: block;
  }

  .article h3 {
    text-align: center;
  }

  #inputs {
    display: flex;
    flex-direction: row;
    justify-content: stretch;
    width: 100%;
    padding: 1rem;
    box-sizing: border-box;
  }

  #inputs > input {
    outline: none;
    width: 100%;
    padding: .25rem;
    font-size: calc(5px + .75vmin);
    border-radius: .5rem 0 0 .5rem;
    border: 1px solid rgb(var(--c2));
    border-right: none;
    color: rgb(var(--c2));
    background-color: rgb(var(--c1));
  }

  #inputs > input::placeholder {
    color: rgb(var(--c2));
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
  }

  .error {
    background-color: rgb(var(--c1));
    color: rgb(var(--c2));
    border: 1px solid rgb(var(--c2));
    border-radius: .3rem;
    
    width: max-content;
    align-self: center;
    padding: .5rem;
  }
</style>
