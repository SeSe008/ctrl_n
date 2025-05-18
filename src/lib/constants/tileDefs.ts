import type { TileDef } from '$lib/types/tiles';
import { tileMetadata } from '$lib/constants/tileMetadata';
import { createNewTileSettings } from '$lib/utils/settings';

import SearchBar from '$lib/Components/Widgets/searchBar.svelte';
import Clock from '$lib/Components/Widgets/clock.svelte';
import RssFeed from '$lib/Components/Widgets/rssFeed.svelte';
import Weather from '$lib/Components/Widgets/weather.svelte';
import Calculator from '$lib/Components/Widgets/calculator.svelte';
import Bookmarks from '$lib/Components/Widgets/bookmarks.svelte';

import { setSearchEngineName, searchEngineName } from '$lib/stores/widgets/searchEngine';
import type { SearchEngines } from '$lib/types/widgets/searchEngines';
import { searchEngines } from '$lib/constants/searchEngines';

import { clockType, setClockType } from '$lib/stores/widgets/clockType';

export const tileDefs: TileDef[] = tileMetadata.map((m) => {
  switch (m.name) {
    case 'search_bar':
      return {
        ...m,
        component: SearchBar,
        tileProps: createNewTileSettings([
          {
            elementType: 'text',
            elementOptions: {
              text: 'Search-Options',
              classes: ['big', 'center', 'strong', 'margin_vert'],
            },
          },
          {
            elementType: 'select',
            elementOptions: {
              selectOptions: Object.entries(searchEngines as SearchEngines).map(
                ([value, { name: label, icon }]) => ({ label, icon, value })
              ),
              onChange: (value: string) => setSearchEngineName(value),
              defaultValue: searchEngineName,
              label: 'Search Engine:',
            },
          },
        ]),
      };

    case 'clock':
      return {
        ...m,
        component: Clock,
        tileProps: createNewTileSettings([
          {
            elementType: 'text',
            elementOptions: {
              text: 'Clock-Options',
              classes: ['big', 'center', 'strong', 'margin_vert'],
            },
          },
          {
            elementType: 'select',
            elementOptions: {
              selectOptions: [
                { label: 'Digital', value: 'digital' },
                { label: 'Analog', value: 'analog' },
              ],
              onChange: (value: string) => setClockType(value),
              defaultValue: clockType,
              label: 'Clock-Type:',
            },
          },
        ]),
      };

    case 'rss_feed':
      return { ...m, component: RssFeed, tileProps: createNewTileSettings() };

    case 'weather':
      return { ...m, component: Weather, tileProps: createNewTileSettings() };

    case 'calculator':
      return { ...m, component: Calculator, tileProps: createNewTileSettings() };

    case 'bookmarks':
      return { ...m, component: Bookmarks, tileProps: createNewTileSettings() };

    default:
      return { ...m, tileProps: createNewTileSettings() };
  }
});
