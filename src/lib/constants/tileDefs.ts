import { get } from 'svelte/store';

import type { TileDef } from '$lib/types/tiles';
import { tileMetadata } from '$lib/constants/tileMetadata';
import { createNewTileSettings } from '$lib/classes/settings';

import SearchBar from '$lib/Components/Widgets/searchBar.svelte';
import Clock from '$lib/Components/Widgets/clock.svelte';
import RssFeed from '$lib/Components/Widgets/rssFeed.svelte';
import Weather from '$lib/Components/Widgets/weather.svelte';
import Calculator from '$lib/Components/Widgets/calculator.svelte';
import Bookmarks from '$lib/Components/Widgets/bookmarks.svelte';

import { searchEngineName } from '$lib/stores/widgets/searchEngine';
import type { SearchEngines } from '$lib/types/widgets/searchEngines';
import { searchEngines } from '$lib/constants/searchEngines';

import { clockType } from '$lib/stores/widgets/clockType';

import { newRssUrl } from '$lib/stores/settings/elements/newRssUrl';
import { setRssUrl } from '$lib/stores/widgets/rssUrl';

import { newWeatherLocation } from '$lib/stores/settings/elements/newWeatherLocation';
import { setWeatherLocation } from '$lib/stores/widgets/weatherLocation';
import { newBookmarkName, newBookmarkUrl } from '$lib/stores/settings/elements/newBookmark';
import { addBookmark } from '$lib/stores/widgets/bookmarks';

export const tileDefs: TileDef[] = tileMetadata.map((m) => {
  switch (m.name) {
    case 'search_bar':
      return {
        ...m,
        component: SearchBar,
        tileProps: createNewTileSettings()
	  .appendElement(
	    'text',
	    {
              text: 'Search-Options',
              classes: ['big', 'center', 'strong', 'margin_vert'],
            },
          )
	  .appendElement(
	    'select',
            {
              selectOptions: Object.entries(searchEngines as SearchEngines).map(
                ([value, { name: label, icon }]) => ({ label, icon, value })
              ),
              store: searchEngineName,
              defaultValue: searchEngineName,
              label: 'Search Engine:',
            }
          )
      };

    case 'clock':
      return {
        ...m,
        component: Clock,
        tileProps: createNewTileSettings()
	  .appendElement(
	    'text',
            {
              text: 'Clock-Options',
              classes: ['big', 'center', 'strong', 'margin_vert'],
            },
          )
	  .appendElement(
	    'select',
            {
              selectOptions: [
                { label: 'Digital', value: 'digital' },
                { label: 'Analog', value: 'analog' },
              ],
              store: clockType,
              defaultValue: clockType,
              label: 'Clock-Type:',
            }
	  ),
      };

    case 'rss_feed':
      return {
	...m,
	component: RssFeed,
	tileProps: createNewTileSettings()
	  .appendElement(
            'text',
            {
              text: 'RSS-Options',
              classes: ['big', 'center', 'strong', 'margin_vert'],
            }
	  )
	  .appendElement(
	    'group',
	    {
	      elements: [
		{
		  elementType: 'textInput',
		  elementOptions: {
		    placeholder: 'RSS-Url',
		    store: newRssUrl,
		    label: 'Set RSS Url:'
		  }
		},
		{
		  elementType: 'buttons',
		  elementOptions: {
		    buttons: [
		      {
			text: 'Change',
			onClick: () => setRssUrl(get(newRssUrl))
		      }
		    ],
		  },
		},
	      ],
	    },
	  ),
      };

    case 'weather':
      return {
	...m,
	component: Weather,
	tileProps: createNewTileSettings()
	  .appendElement(
	    'text',
            {
              text: 'Weather-Options',
              classes: ['big', 'center', 'strong', 'margin_vert'],
            }
	  ).
	  appendElement(
	    'group',
	    {
	      elements: [
		{
		  elementType: 'textInput',
		  elementOptions: {
		    placeholder: 'Location',
		    store: newWeatherLocation,
		    label: 'Set Weather location:'
		  }
		},
		{
		  elementType: 'buttons',
		  elementOptions: {
		    buttons: [
		      {
			text: 'Change',
			onClick: () => setWeatherLocation(get(newWeatherLocation))
		      }
		    ],
		  },
		},
	      ],
	    },
	  ),
      };

    case 'calculator':
      return { ...m, component: Calculator, tileProps: createNewTileSettings() };

    case 'bookmarks':
      return {
	...m,
	component: Bookmarks,
	tileProps: createNewTileSettings()
	  .appendElement(
            'text',
            {
              text: 'Bookmarks-Options',
              classes: ['big', 'center', 'strong', 'margin_vert'],
            },
	  )
	  .appendElement(
	    'group',
	    {
	      elements: [
		{
		  elementType: 'text',
		  elementOptions: {
		    text: 'Add new bookmark:'
		  }
		},
		{
		  elementType: 'textInput',
		  elementOptions: {
		    placeholder: 'Name',
		    store: newBookmarkName,
		  }
		},
		{
		  elementType: 'textInput',
		  elementOptions: {
		    placeholder: 'Url',
		    store: newBookmarkUrl,
		  }
		},
		{
		  elementType: 'buttons',
		  elementOptions: {
		    buttons: [
		      {
			text: 'Add Bookmark',
			onClick: () => {
			  addBookmark(get(newBookmarkName), get(newBookmarkUrl));
			  newBookmarkName.set('');
			  newBookmarkUrl.set('');
			},
		      }
		    ],
		  },
		},
	      ],
	    },
	  ),
      };

    default:
      return { ...m, tileProps: createNewTileSettings() };
  }
});
