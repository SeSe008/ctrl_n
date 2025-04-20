
<script lang="ts"> 
  import ColorThief from 'colorthief';

  import Clock from '$lib/Components/clock.svelte';
  import SearchBar from '$lib/Components/searchBar.svelte';
  import RssFeed from '$lib/Components/rssFeed.svelte';
  
  import { onMount } from 'svelte';
  import { useImage } from '$lib/Utils/useImage';
  
  let images: string[] = [];
  const path: string = 'backgrounds' // Dir-name of the image folder 
  const colors: number = 5; // Amount of colors for palette
  const changeInterval: number = 5 * 60 * 1000; // Interval of change of bg-image
  
  async function loadImages(path: string, colorThief: ColorThief) {
    // Fetch images
    const res = await fetch('/api/images', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subdir: path })
    });

    if (res.ok) {
      images = await res.json();
    } else {
      images = [];
    }

    useImage(images, changeInterval, colors, colorThief);
  }

  onMount(() => {
    const colorThief = new ColorThief();
    
    loadImages(path, colorThief);
  });
</script>

<Clock />
<SearchBar />
<RssFeed />
<div id='credit'>Search Suggestions provided by <a href='https://github.com/searxng/searxng'>SearXNG</a></div>

<style>
  #credit {
    color: rgb(var(--c1));
    padding: .25rem;
    background-color: rgba(var(--c2), .7);
    border-radius: .25rem;
    font-size: .75rem;
  }

  #credit a {
    color: inherit;
  }
</style>
