import { derived, get } from 'svelte/store';

import type { TileDef } from '$lib/types/tiles';
import { tileMetadata } from '$lib/constants/tileMetadata';
import { createNewSettingsSlice, createNewSettingsSection } from '$lib/utils/settings';

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
import {
  addBookmark,
  bookmarks,
  getBookmarks,
  removeBookmark
} from '$lib/stores/widgets/bookmarks';

export const tileDefs: TileDef[] = tileMetadata.map((m) => {
  switch (m.name) {
    case 'search_bar':
      return {
        ...m,
        component: SearchBar,
        tileProps: createNewSettingsSection()
          .appendElement('text', {
            text: 'Search-Options',
            classes: ['big', 'center', 'strong', 'margin_vert']
          })
          .appendElement('select', {
            selectOptions: Object.entries(searchEngines as SearchEngines).map(
              ([value, { name: label, icon }]) => ({ label, icon, value })
            ),
            store: searchEngineName,
            defaultValue: searchEngineName,
            label: 'Search Engine:'
          })
      };

    case 'clock':
      return {
        ...m,
        component: Clock,
        tileProps: createNewSettingsSection()
          .appendElement('text', {
            text: 'Clock-Options',
            classes: ['big', 'center', 'strong', 'margin_vert']
          })
          .appendElement('select', {
            selectOptions: [
              { label: 'Digital', value: 'digital' },
              { label: 'Analog', value: 'analog' }
            ],
            store: clockType,
            defaultValue: clockType,
            label: 'Clock-Type:'
          })
      };

    case 'rss_feed':
      return {
        ...m,
        component: RssFeed,
        tileProps: createNewSettingsSection()
          .appendElement('text', {
            text: 'RSS-Options',
            classes: ['big', 'center', 'strong', 'margin_vert']
          })
          .appendElement('group', {
            layout: 'vert',
            objects: createNewSettingsSlice()
              .appendElement('textInput', {
                placeholder: 'RSS-Url',
                store: newRssUrl,
                label: 'Set RSS Url:'
              })
              .appendElement('button', {
                text: 'Change',
                onClick: () => setRssUrl(get(newRssUrl))
              })
          })
      };

    case 'weather':
      return {
        ...m,
        component: Weather,
        tileProps: createNewSettingsSection()
          .appendElement('text', {
            text: 'Weather-Options',
            classes: ['big', 'center', 'strong', 'margin_vert']
          })
          .appendElement('group', {
            layout: 'vert',
            objects: createNewSettingsSlice()
              .appendElement('textInput', {
                placeholder: 'Location',
                store: newWeatherLocation,
                label: 'Set Weather location:'
              })
              .appendElement('button', {
                text: 'Change',
                onClick: () => setWeatherLocation(get(newWeatherLocation))
              })
          })
      };

    case 'calculator':
      return { ...m, component: Calculator, tileProps: createNewSettingsSection() };

    case 'bookmarks':
      return {
        ...m,
        component: Bookmarks,
        tileProps: createNewSettingsSection()
          .appendElement('text', {
            text: 'Bookmarks-Options',
            classes: ['big', 'center', 'strong', 'margin_vert']
          })
          .appendElement('group', {
            objects: createNewSettingsSlice()
              .appendElement('text', {
                text: 'Add new bookmark:'
              })
              .appendElement('textInput', {
                placeholder: 'Name',
                store: newBookmarkName
              })
              .appendElement('textInput', {
                placeholder: 'Url',
                store: newBookmarkUrl
              })
              .appendElement('button', {
                text: 'Add Bookmark',
                onClick: () => {
                  addBookmark(get(newBookmarkName), get(newBookmarkUrl));
                  newBookmarkName.set('');
                  newBookmarkUrl.set('');
                }
              })
          })
          .appendElement(
            'text',
            {
              text: 'Bookmarks:',
              classes: ['center', 'big', 'margin_top']
            },
            derived(bookmarks, ($bookmarks) => $bookmarks.length > 0)
          )
          .appendElement('group', {
            center: true,
            objects: () =>
              createNewSettingsSlice(
                getBookmarks().map((bookmark, i) => ({
                  elementType: 'group',
                  elementOptions: {
                    layout: 'vert',
                    center: true,
                    objects: () =>
                      createNewSettingsSlice()
                        .appendElement('image', {
                          image: () =>
                            `https://icons.duckduckgo.com/ip3/${getBookmarks()[i].url.split('/')[2]}.ico`,
                          width: '2.5em',
                          updater: bookmarks
                        })
                        .appendElement('text', {
                          text: bookmark.name
                        })
                        .appendElement('button', {
                          icon: 'mdi:delete',
                          onClick: () => removeBookmark(i)
                        })
                  }
                }))
              ),
            updater: bookmarks
          })
      };

    default:
      return { ...m, tileProps: createNewSettingsSection() };
  }
});
