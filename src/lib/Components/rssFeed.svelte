<script lang="ts">
  import parse from "rss-to-json";
  import DOMPurify from "dompurify";

  import { onMount } from "svelte";

  interface Article {
    title: string;
    description: string;
    link: string;
    published: number;
    created: number;
    content: string;
  };
  
  let articles: Article[] = [];

  async function parseRss() {
    const url = window.localStorage.getItem('rssURL') || 'https://www.tagesschau.de/infoservices/alle-meldungen-100~rss2.xml'; 
    var rss = await parse(url);
    
    articles = rss.items;
  }

  let rssURL: HTMLInputElement;
  
  function changeRss() {
    window.localStorage.setItem('rssURL', rssURL.value);

    parseRss();
  }

  onMount(() => {
    parseRss()
  });
</script>

<div id="rss_feed">
  <div id="articles">
    <h2>RSS Feed</h2>
    {#each articles as article (article)}
      <a href={article.link}>
	<div class="article">
	  <h3>{article.title}</h3>
	  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
	  <div>{@html DOMPurify.sanitize(article.content)}</div>
	</div>
      </a>
   {/each}
   <div id='inputs'>
     <input bind:this={rssURL} type="text" placeholder="New RSS Url" />
     <button on:click={changeRss}>Change</button>
   </div>
 </div>
</div>

<style>
  #rss_feed {
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    max-height: 40vmin;
    max-width: 66%;
    overflow: hidden;
    background-color: rgba(var(--c1), .3);
    border: 1px solid rgb(var(--c2));
    border-radius: 1rem;
  }

  #articles {
    display: grid;
    gap: .3rem;
    grid-template-columns: repeat(3, 33.3%);
    overflow-x: hidden;
    overflow-y: auto;
    padding: 1rem;
    box-sizing: border-box;
  }

  @media screen and (max-width: 1024px) {
    #articles {
      grid-template-columns: repeat(2, 50%) !important;
    }

    #articles h2 {
      grid-column: 1 / 3 !important;
    }

    #articles #inputs {
      grid-column: 1 / 3 !important;
    }
  }

  #articles h2 {
    justify-self: center;
    width: max-content;
    padding: .5rem;
    border-radius: .25rem;
    background-color: rgb(var(--c1));
    color: rgb(var(--c2));
    grid-column: 1 / 4;
  }

  #articles a {
    position: relative;
    display: block;
    text-decoration: none;
    color: inherit;
  }

  .article {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: rgb(var(--c4));
    height: 100%;
    color: rgb(var(--c2));
    border-radius: .5rem;
    padding: .5rem;
    box-sizing: border-box;
  }
  
  :global(.article > div > p) {
    width: 100%;
    text-align: justify;
  }
  
  :global(.article > div > p > a > img) {
    max-width: 75%;
    display: inline-block;
    border-radius: .5rem;
    border: 1px solid rgb(var(--c2));
    margin: 0 auto;
    display: block;
  }

  :global(.article > div > p > a) {
    text-decoration: none;
    color: rgb(var(--c2));
  }

  .article h3 {
    text-align: center;
  }

  #inputs {
    grid-column: 1 / 4;
    display: flex;
    flex-direction: row;
    justify-content: stretch;
    width: 100%;
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
</style>
