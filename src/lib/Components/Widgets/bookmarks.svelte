<script lang="ts">
  import Icon from '@iconify/svelte';
  import { getTileWidgetOptions } from '$lib/stores/tiles';
  import type { Bookmarks } from '$lib/types/widgets/bookmarks';
  import type { TileProps } from '$lib/types/tiles';
  
  const { tileId, managerId }: TileProps = $props();
  const options = getTileWidgetOptions(managerId, tileId);

  let bookmarks = $state<Bookmarks>([]);
  let bookmarksLinkTarget = $state<boolean>(true);
  
  if (options) {
    if (typeof options.bookmarksLinkTarget === 'boolean') {
      bookmarksLinkTarget = options.bookmarksLinkTarget;
    }
    if (Array.isArray(options.bookmarks) && typeof options.bookmarks[0] === 'object') {
      bookmarks = options.bookmarks;
    }
  }
</script>

<div id="bookmarks">
  <h2><Icon icon="mdi:bookmark-multiple" /> Bookmarks</h2>

  <div id="bookmark_list">
    {#each bookmarks as { name, url }, i (i)}
      <div class="bookmark">
        <a href={url} target={bookmarksLinkTarget ? '_blank' : '_self'} rel="noopener noreferrer">
          <img alt="Favicon" src={`https://icons.duckduckgo.com/ip3/${url.split('/')[2]}.ico`} />
          <span>{name}</span>
        </a>
      </div>
    {/each}
  </div>
</div>

<style>
  #bookmarks {
    display: grid;
    grid-template-rows: min-content 1fr;
    grid-template-columns: 1fr;
    gap: 0.5rem;
    overflow-y: auto;
    overflow-x: hidden;

    height: 100%;
    max-height: 100%;
    width: 100%;

    background-color: rgba(var(--c1), var(--o1));

    border: var(--tileBorder, 1px solid rgb(var(--c2)));
    border-radius: var(--tileBorderRadius);

    box-sizing: border-box;
    padding: 1rem;
  }

  #bookmarks h2 {
    display: var(--tileTitle, flex);

    justify-self: center;
    margin: 0;
    margin-bottom: 1vmin;
    grid-column: 1 / -1;

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

  #bookmark_list {
    display: flex;
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .bookmark {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    width: 5rem;
    overflow: hidden;
  }

  .bookmark a {
    position: relative;
    z-index: 0;
    display: inline-block;

    display: flex;
    flex-direction: column;
    align-items: stretch;
    width: 100%;

    overflow: hidden;
    box-sizing: border-box;
    padding: 0.25rem 0.5rem;
    border-radius: 1vmin;

    background-color: rgba(var(--c2), var(--o2));
    color: rgb(var(--c5));

    text-decoration: none;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: calc(8px + 1vmin);

    transition: color 0.6s ease-in-out;
  }

  .bookmark a span {
    display: block;
    width: 100%;

    overflow: hidden;

    white-space: nowrap;
    text-overflow: ellipsis;
    text-align: center;
    font-size: calc(8px + 1vmin);
  }

  .bookmark a::before {
    content: '';

    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;

    background: white;
    clip-path: circle(0 at 50% 25%);

    transition: clip-path 0.6s ease-out;
    z-index: -1;
  }

  .bookmark a:hover::before {
    clip-path: circle(150% at 50% 25%);
  }

  .bookmark a:hover {
    color: black;
  }

  .bookmark img {
    box-sizing: border-box;
    background-color: white;
    padding: 0.5rem;
    border-radius: 10%;
    width: 100%;
  }
</style>
