<script lang="ts">
  import DOMPurify from 'dompurify';
  import Icon from '@iconify/svelte';

  import type { Article } from '$lib/types/widgets/rss';
  import { addError } from '$lib/stores/errors';
  import { getTileWidgetOptions } from '$lib/stores/tiles';
  import type { TileProps } from '$lib/types/tiles';

  const { tileId, managerId }: TileProps = $props();
  const options = getTileWidgetOptions(tileId, managerId);

  let rssUrl: string | undefined = undefined;
  
  if (options && typeof options.rssUrl === 'string') {
    rssUrl = options.rssUrl;
  }

  let articles = $state<Article[]>([]);
  let error = $state<string>();

  async function parseRss(url: string | undefined) {
    if (!url) {
      error = 'No RSS-URL set';
      addError('rss-feed', error);
      return;
    } else if (!url.startsWith('http')) {
      url = 'http://' + url;
    }

    const resp = await fetch('/api/rss', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: url })
    });

    if (resp.ok) {
      articles = await resp.json();
      error = '';
    } else {
      articles = [];
      error = (await resp.json()).error;
      addError('rss-feed', error!);
    }
  }

  parseRss(rssUrl);
</script>

<div id="rss-feed">
  {#if articles.length !== 0}
    <div id="articles">
      <h2><Icon icon="mdi:newspaper-variant-multiple" />Rss Feed</h2>
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
  {:else}
    <div class="info">
      {#if error}
        Error parsing RSS: {error}
      {:else}
        Unknown error on parsing RSS, check console
      {/if}
      <button onclick={() => parseRss(rssUrl)}><Icon icon="mdi:reload" /></button>
    </div>
  {/if}
</div>

<style>
  #rss-feed {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;

    box-sizing: border-box;

    background-color: rgba(var(--c1), var(--o1));
    border: var(--tileBorder, 1px solid rgb(var(--c2)));
    border-radius: var(--tileBorderRadius);

    container-type: inline-size;
  }

  #rss-feed h2 {
    display: var(--tileTitle, flex);

    justify-self: center;
    align-self: center;
    margin: 0;
    margin-bottom: 1vmin;

    flex-direction: row;
    align-items: center;
    gap: 0.5rem;

    width: max-content;
    padding: 0.5rem;
    box-sizing: border-box;
    border-radius: 1vmin;

    color: rgb(var(--c5));
    background-color: rgba(var(--c1), var(--o2));
  }

  #articles {
    display: grid;
    gap: 0.3rem;
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
    height: 100%;

    background-color: rgba(var(--c1), var(--o2));
    color: rgb(var(--c5));

    border: 1px solid rgb(var(--c2));
    border-radius: 0.5rem;

    padding: 0.5rem;
    box-sizing: border-box;

    transition:
      transform 0.2s,
      filter 0.5s;
  }

  .article h3 {
    font-size: calc(6px + 1.5vmin);
  }

  .article:hover {
    transform: scale(1.01);
    filter: drop-shadow(0 0 0.25rem rgb(var(--c2)));
  }

  .article > div {
    width: 100%;
    text-align: justify;
  }

  .article img {
    max-width: 75%;
    display: inline-block;
    border-radius: 0.5rem;
    border: 1px solid rgb(var(--c2));
    margin: 0 auto;
    display: block;
  }

  .article h3 {
    text-align: center;
  }

  :global(.article a) {
    color: inherit;
  }

  .info {
    flex-grow: 1;

    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;

    box-sizing: border-box;
    padding: 0.5rem;

    font-size: calc(8px + 1vmin);
    text-align: center;

    border-radius: 0.5rem;
    border: 1px solid rgb(var(--c2));

    color: rgb(var(--c5));
    background-color: rgba(var(--c1), var(--o2));
  }

  .info button {
    display: flex;
    align-items: center;
    justify-content: center;

    padding: 0.25rem;

    border: 1px solid rgb(var(--c2));
    border-radius: 0.25rem;

    color: inherit;
    background-color: transparent;

    cursor: pointer;

    transition:
      0.2s background-color linear,
      0.2s color linear;
  }

  .info button:hover {
    color: rgb(var(--c1));
    background-color: rgb(var(--c5));
  }
</style>
