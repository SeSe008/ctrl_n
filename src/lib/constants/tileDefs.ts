import { derived, get } from 'svelte/store';

import type { TileDef } from '$lib/types/tiles';
import { tileMetadata } from '$lib/constants/tileMetadata';
import { createNewSettingsSlice, createNewSettingsSection } from '$lib/utils/createSettings';

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
  bookmarksLinkTarget,
  getBookmarks,
  removeBookmark,
  toggleBookmarksLinkTarget
} from '$lib/stores/widgets/bookmarks';

import { changeTileCssVar, getTileCssVar, globalTiles } from '$lib/stores/tiles';
import { getSelectedManagerId, getSelectedTileId } from '$lib/stores/settings/settings';

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
          .appendElement(
            'group',
            {
              layout: 'vert',
              objects: createNewSettingsSlice()
                .appendElement('text', {
                  text: 'Font-Options:',
                  classes: ['medium', 'left', 'margin_top']
                })
                .appendElement('select', {
                  selectOptions: [
                    'Small',
                    'Medium',
                    'Large',
                    'X-Large',
                    'XX-Large',
                    'XXX-Large',
                    'Custom'
                  ].map((val) => ({
                    value: val.toLowerCase(),
                    label: val
                  })),
                  defaultValue: () => {
                    const cssVal =
                      getTileCssVar(
                        getSelectedManagerId(),
                        getSelectedTileId(),
                        '--clockFontSize'
                      ) ?? 'xxx-large';
                    return cssVal.endsWith('em') ? 'custom' : cssVal;
                  },
                  onChange: (value: string) =>
                    changeTileCssVar(
                      getSelectedManagerId(),
                      getSelectedTileId(),
                      '--clockFontSize',
                      value === 'custom' ? '1em' : value
                    ),
                  label: 'Font-Size:'
                })
                .appendElement(
                  'range',
                  {
                    min: 1,
                    max: 10,
                    step: 0.25,
                    onInput: (value: number) => {
                      changeTileCssVar(
                        getSelectedManagerId(),
                        getSelectedTileId(),
                        '--clockFontSize',
                        `${value}em`
                      );
                    },
                    defaultValue: () =>
                      parseFloat(
                        getTileCssVar(
                          getSelectedManagerId(),
                          getSelectedTileId(),
                          '--clockFontSize'
                        ) ?? '1'
                      ),
                    label: 'Font-Size:',
                    unit: 'em'
                  },
                  derived(
                    globalTiles,
                    (_) =>
                      getTileCssVar(
                        getSelectedManagerId(),
                        getSelectedTileId(),
                        '--clockFontSize'
                      )?.endsWith('em') ?? false
                  )
                )
                .appendElement('select', {
                  selectOptions: [
                    {
                      label: 'Normal',
                      value: 'normal'
                    },
                    {
                      label: 'Italic',
                      value: 'italic'
                    }
                  ],
                  defaultValue: () =>
                    getTileCssVar(
                      getSelectedManagerId(),
                      getSelectedTileId(),
                      '--clockFontStyle'
                    ) ?? 'normal',
                  onChange: (value: string) =>
                    changeTileCssVar(
                      getSelectedManagerId(),
                      getSelectedTileId(),
                      '--clockFontStyle',
                      value
                    ),
                  label: 'Font-Style:'
                })
                .appendElement('select', {
                  selectOptions: ['Lighter', 'Normal', 'Bold'].map((val) => ({
                    value: val.toLowerCase(),
                    label: val
                  })),
                  defaultValue: () =>
                    getTileCssVar(
                      getSelectedManagerId(),
                      getSelectedTileId(),
                      '--clockFontWeight'
                    ) ?? 'bold',
                  onChange: (value: string) =>
                    changeTileCssVar(
                      getSelectedManagerId(),
                      getSelectedTileId(),
                      '--clockFontWeight',
                      value
                    ),
                  label: 'Font-Weight:'
                })
                .appendElement('checkbox', {
                  label: 'Text Border',
                  onChange: (value: boolean) =>
                    changeTileCssVar(
                      getSelectedManagerId(),
                      getSelectedTileId(),
                      '--textBorderSize',
                      value ? '3' : '0'
                    ),
                  defaultValue: derived(
                    globalTiles,
                    (_) =>
                      parseInt(
                        getTileCssVar(
                          getSelectedManagerId(),
                          getSelectedTileId(),
                          '--textBorderSize'
                        ) ?? '0'
                      ) > 0
                  )
                })
                .appendElement('group', {
                  layout: 'vert',
                  objects: createNewSettingsSlice().appendElement(
                    'range',
                    {
                      min: 1,
                      max: 10,
                      step: 1,
                      unit: 'px',
                      onInput: (value: number) =>
                        changeTileCssVar(
                          getSelectedManagerId(),
                          getSelectedTileId(),
                          '--textBorderSize',
                          value.toString()
                        ),
                      defaultValue: () =>
                        parseInt(
                          getTileCssVar(
                            getSelectedManagerId(),
                            getSelectedTileId(),
                            '--textBorderSize'
                          ) ?? '0'
                        ),
                      label: 'Text-Border size:'
                    },
                    derived(
                      globalTiles,
                      (_) =>
                        parseInt(
                          getTileCssVar(
                            getSelectedManagerId(),
                            getSelectedTileId(),
                            '--textBorderSize'
                          ) ?? '0'
                        ) > 0
                    )
                  )
                })
                .appendElement('checkbox', {
                  label: 'Use adaptive coloring (inverted background)',
                  onChange: (value: boolean) => {
                    const mgr = getSelectedManagerId();
                    const tle = getSelectedTileId();

                    if (value) {
                      changeTileCssVar(mgr, tle, '--clockFgClr', 'white');
                      changeTileCssVar(mgr, tle, '--clockBgClr', 'transparent');
                      changeTileCssVar(mgr, tle, '--clockBlMode', 'difference');
                    } else {
                      changeTileCssVar(mgr, tle, '--clockFgClr', 'rgb(var(--c5))');
                      changeTileCssVar(mgr, tle, '--clockBgClr', 'rgba(var(--c1), var(--O1))');
                      changeTileCssVar(mgr, tle, '--clockBlMode', 'normal');
                    }
                  },
                  defaultValue: () =>
                    getTileCssVar(getSelectedManagerId(), getSelectedTileId(), '--clockBlMode') ===
                    'difference'
                })
            },
            derived(clockType, ($clockType) => $clockType === 'digital')
          )
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
          .appendElement('checkbox', {
            label: 'Open bookmarks in a new tab',
            onChange: () => toggleBookmarksLinkTarget(),
            defaultValue: bookmarksLinkTarget
          })
          .appendElement(
            'text',
            {
              text: 'Bookmarks:',
              classes: ['center', 'big', 'margin_top']
            },
            derived(bookmarks, ($bookmarks) => $bookmarks.length > 0)
          )
          .appendElement(
            'group',
            {
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
                            width: '2.5em'
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
                )
            },
            undefined,
            bookmarks
          )
      };

    default:
      return { ...m, tileProps: createNewSettingsSection() };
  }
});
