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

import type { SearchEngines } from '$lib/types/widgets/searchEngines';
import { searchEngines } from '$lib/constants/searchEngines';

import { newRssUrl } from '$lib/stores/settings/elements/newRssUrl';

import { newWeatherLocation } from '$lib/stores/settings/elements/newWeatherLocation';

import { newBookmarkName, newBookmarkUrl } from '$lib/stores/settings/elements/newBookmark';

import {
  changeTileCssVar,
  changeTileWidgetOption,
  getTile,
  getTileCssVar,
  getTileWidgetOption,
  globalTiles
} from '$lib/stores/tiles';
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
            onChange: (value: string) =>
              changeTileWidgetOption(
                getSelectedManagerId(),
                getSelectedTileId(),
                'searchEngineName',
                value
              ),
            defaultValue: () =>
              getTileWidgetOption(getSelectedManagerId(), getSelectedTileId(), 'searchEngine') ??
              'ecosia',
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
            onChange: (value: string) =>
              changeTileWidgetOption(
                getSelectedManagerId(),
                getSelectedTileId(),
                'clockType',
                value
              ),
            defaultValue: () =>
              getTileWidgetOption(getSelectedManagerId(), getSelectedTileId(), 'clockType'),
            label: 'Clock-Type:'
          })
          .appendElement(
            'collapsible',
            {
              title: 'Font-Options',
              layout: 'vert',
              objects: createNewSettingsSlice()
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
            derived(
              globalTiles,
              (_) =>
                getTileWidgetOption(getSelectedManagerId(), getSelectedTileId(), 'clockType') ===
                'digital'
            )
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
                onClick: () =>
                  changeTileWidgetOption(
                    getSelectedManagerId(),
                    getSelectedTileId(),
                    'rssUrl',
                    get(newRssUrl)
                  )
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
            objects: createNewSettingsSlice()
              .appendElement('textInput', {
                placeholder: 'Location',
                store: newWeatherLocation,
                label: 'Set Weather location:'
              })
              .appendElement('button', {
                text: 'Change',
                onClick: () =>
                  changeTileWidgetOption(
                    getSelectedManagerId(),
                    getSelectedTileId(),
                    'weatherLocation',
                    get(newWeatherLocation)
                  )
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
                  changeTileWidgetOption(getSelectedManagerId(), getSelectedTileId(), 'bookmarks', [
                    ...(getTileWidgetOption(
                      getSelectedManagerId(),
                      getSelectedTileId(),
                      'bookmarks'
                    ) ?? []),
                    {
                      name: get(newBookmarkName),
                      url: get(newBookmarkUrl)
                    }
                  ]);
                  newBookmarkName.set('');
                  newBookmarkUrl.set('');
                }
              })
          })
          .appendElement('checkbox', {
            label: 'Open bookmarks in a new tab',
            onChange: (value: boolean) =>
              changeTileWidgetOption(
                getSelectedManagerId(),
                getSelectedTileId(),
                'bookmarksLinkTarget',
                value
              ),
            defaultValue: getTileWidgetOption(
              getSelectedManagerId(),
              getSelectedTileId(),
              'bookmarksLinkTarget'
            )
          })
          .appendElement(
            'text',
            {
              text: 'Bookmarks:',
              classes: ['center', 'big', 'margin_top']
            },
            derived(globalTiles, (_) => {
              const bookmarks = getTileWidgetOption(
                getSelectedManagerId(),
                getSelectedTileId(),
                'bookmarks'
              );

              return Array.isArray(bookmarks) && bookmarks.length > 0;
            }),
            derived(
              globalTiles,
              (_) =>
                getTile(getSelectedManagerId(), getSelectedTileId())?.widgetOptions['bookmarks'] ??
                []
            )
          )
          .appendElement(
            'group',
            {
              center: true,
              objects: () =>
                createNewSettingsSlice(
                  getTileWidgetOption(getSelectedManagerId(), getSelectedTileId(), 'bookmarks').map(
                    (bookmark: Bookmarks, i: number) => ({
                      elementType: 'group',
                      elementOptions: {
                        layout: 'vert',
                        center: true,
                        objects: () =>
                          createNewSettingsSlice()
                            .appendElement('image', {
                              image: () =>
                                `https://icons.duckduckgo.com/ip3/${getTileWidgetOption(getSelectedManagerId(), getSelectedTileId(), 'bookmarks')[i].url.split('/')[2]}.ico`,
                              width: '2.5em'
                            })
                            .appendElement('text', {
                              text: bookmark.name
                            })
                            .appendElement('button', {
                              simple: true,
                              icon: 'mdi:delete',
                              onClick: () =>
                                changeTileWidgetOption(
                                  getSelectedManagerId(),
                                  getSelectedTileId(),
                                  'bookmarks',
                                  getTileWidgetOption(
                                    getSelectedManagerId(),
                                    getSelectedTileId(),
                                    'bookmarks'
                                  ).filter((_: unknown, index: number) => index !== i)
                                )
                            })
                      }
                    })
                  )
                )
            },
            derived(globalTiles, (_) => {
              const bookmarks = getTileWidgetOption(
                getSelectedManagerId(),
                getSelectedTileId(),
                'bookmarks'
              );

              return Array.isArray(bookmarks) && bookmarks.length > 0;
            }),
            derived(
              globalTiles,
              (_) =>
                getTile(getSelectedManagerId(), getSelectedTileId())?.widgetOptions['bookmarks'] ??
                []
            )
          )
      };

    default:
      return { ...m, tileProps: createNewSettingsSection() };
  }
});
