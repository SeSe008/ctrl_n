import Clock from '$lib/Components/Widgets/clock.svelte';
import SearchBar from '$lib/Components/Widgets/searchBar.svelte';
import RssFeed from '$lib/Components/Widgets/rssFeed.svelte';
import WeatherWidget from '$lib/Components/Widgets/weatherWidget.svelte';
import Calculator from '$lib/Components/Widgets/calculator.svelte';
import Bookmarks from '$lib/Components/Widgets/bookmarks.svelte';

import type { TileDef } from "$lib/types/tiles";

export const tileDefs: TileDef[] = [
  { name: "none", label: 'None', icon: '' },
  { name: "search_bar", label: 'Search Bar', icon: 'mdi:search', component: SearchBar },
  { name: "clock", label: 'Clock', icon: 'mdi:clock-outline', component: Clock },
  { name: "rss_feed", label: 'Rss-Feed', icon: 'material-symbols:news', component: RssFeed },
  { name: "weather", label: 'Weather', icon: 'ph:cloud-sun-fill', component: WeatherWidget },
  { name: "calculator", label: 'Calculator', icon: 'iconamoon:calculator', component: Calculator },
  { name: "bookmarks", label: 'Bookmarks', icon: 'material-symbols:bookmarks', component: Bookmarks },
];
