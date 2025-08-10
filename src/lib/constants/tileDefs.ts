import { derived, get } from 'svelte/store';

import type { TileDef } from '$lib/types/tiles';
import { tileMetadata } from '$lib/constants/tileMetadata';
import {
  createNewSettingsSlice,
  createNewSettingsSection,
  createNewElement
} from '$lib/utils/createSettings';

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
          .appendElement(
            createNewElement()
              .setType('text')
              .withOptions({
                text: 'Search-Options',
                classes: ['big', 'center', 'strong', 'margin_vert']
              })
          )
          .appendElement(
            createNewElement()
              .setType('select')
              .withOptions({
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
                  getTileWidgetOption(
                    getSelectedManagerId(),
                    getSelectedTileId(),
                    'searchEngine'
                  ) ?? 'ecosia',
                label: 'Search Engine:'
              })
          )
      };

    case 'clock':
      return {
        ...m,
        component: Clock,
        tileProps: createNewSettingsSection()
          .appendElement(
            createNewElement()
              .setType('text')
              .withOptions({
                text: 'Clock-Options',
                classes: ['big', 'center', 'strong', 'margin_vert']
              })
          )
          .appendElement(
            createNewElement()
              .setType('select')
              .withOptions({
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
          )
          .appendElement(
            createNewElement()
              .setType('collapsible')
              .withOptions({
                title: 'Font-Options',
                layout: 'vert',
                objects: createNewSettingsSlice()
                  .appendElement(
                    createNewElement()
                      .setType('select')
                      .withOptions({
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
                  )
                  .appendElement(
                    createNewElement()
                      .setType('range')
                      .withOptions({
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
                      })
                      .addCondition(
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
                  )
                  .appendElement(
                    createNewElement()
                      .setType('select')
                      .withOptions({
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
                  )
                  .appendElement(
                    createNewElement()
                      .setType('select')
                      .withOptions({
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
                  )
                  .appendElement(
                    createNewElement()
                      .setType('checkbox')
                      .withOptions({
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
                  )
                  .appendElement(
                    createNewElement()
                      .setType('group')
                      .withOptions({
                        layout: 'vert',
                        objects: createNewSettingsSlice().appendElement(
                          createNewElement()
                            .setType('range')
                            .withOptions({
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
                            })
                            .addCondition(
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
                        )
                      })
                  )
                  .appendElement(
                    createNewElement()
                      .setType('checkbox')
                      .withOptions({
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
                            changeTileCssVar(
                              mgr,
                              tle,
                              '--clockBgClr',
                              'rgba(var(--c1), var(--O1))'
                            );
                            changeTileCssVar(mgr, tle, '--clockBlMode', 'normal');
                          }
                        },
                        defaultValue: () =>
                          getTileCssVar(
                            getSelectedManagerId(),
                            getSelectedTileId(),
                            '--clockBlMode'
                          ) === 'difference'
                      })
                  )
              })
              .addCondition(
                derived(
                  globalTiles,
                  (_) =>
                    getTileWidgetOption(
                      getSelectedManagerId(),
                      getSelectedTileId(),
                      'clockType'
                    ) === 'digital'
                )
              )
          )
      };

    case 'rss_feed':
      return {
        ...m,
        component: RssFeed,
        tileProps: createNewSettingsSection()
          .appendElement(
            createNewElement()
              .setType('text')
              .withOptions({
                text: 'RSS-Options',
                classes: ['big', 'center', 'strong', 'margin_vert']
              })
          )
          .appendElement(
            createNewElement()
              .setType('group')
              .withOptions({
                layout: 'vert',
                objects: createNewSettingsSlice()
                  .appendElement(
                    createNewElement().setType('textInput').withOptions({
                      placeholder: 'RSS-Url',
                      store: newRssUrl,
                      label: 'Set RSS Url:'
                    })
                  )
                  .appendElement(
                    createNewElement()
                      .setType('button')
                      .withOptions({
                        text: 'Change',
                        onClick: () =>
                          changeTileWidgetOption(
                            getSelectedManagerId(),
                            getSelectedTileId(),
                            'rssUrl',
                            get(newRssUrl)
                          )
                      })
                  )
              })
          )
      };

    case 'weather':
      return {
        ...m,
        component: Weather,
        tileProps: createNewSettingsSection()
          .appendElement(
            createNewElement()
              .setType('text')
              .withOptions({
                text: 'Weather-Options',
                classes: ['big', 'center', 'strong', 'margin_vert']
              })
          )
          .appendElement(
            createNewElement()
              .setType('group')
              .withOptions({
                objects: createNewSettingsSlice()
                  .appendElement(
                    createNewElement().setType('textInput').withOptions({
                      placeholder: 'Location',
                      store: newWeatherLocation,
                      label: 'Set Weather location:'
                    })
                  )
                  .appendElement(
                    createNewElement()
                      .setType('button')
                      .withOptions({
                        text: 'Change',
                        onClick: () =>
                          changeTileWidgetOption(
                            getSelectedManagerId(),
                            getSelectedTileId(),
                            'weatherLocation',
                            get(newWeatherLocation)
                          )
                      })
                  )
              })
          )
      };

    case 'calculator':
      return { ...m, component: Calculator, tileProps: createNewSettingsSection() };

    case 'bookmarks':
      return {
        ...m,
        component: Bookmarks,
        tileProps: createNewSettingsSection()
          .appendElement(
            createNewElement()
              .setType('text')
              .withOptions({
                text: 'Bookmarks-Options',
                classes: ['big', 'center', 'strong', 'margin_vert']
              })
          )
          .appendElement(
            createNewElement()
              .setType('group')
              .withOptions({
                objects: createNewSettingsSlice()
                  .appendElement(
                    createNewElement().setType('text').withOptions({
                      text: 'Add new bookmark:'
                    })
                  )
                  .appendElement(
                    createNewElement().setType('textInput').withOptions({
                      placeholder: 'Name',
                      store: newBookmarkName
                    })
                  )
                  .appendElement(
                    createNewElement().setType('textInput').withOptions({
                      placeholder: 'Url',
                      store: newBookmarkUrl
                    })
                  )
                  .appendElement(
                    createNewElement()
                      .setType('button')
                      .withOptions({
                        text: 'Add Bookmark',
                        onClick: () => {
                          changeTileWidgetOption(
                            getSelectedManagerId(),
                            getSelectedTileId(),
                            'bookmarks',
                            [
                              ...(getTileWidgetOption(
                                getSelectedManagerId(),
                                getSelectedTileId(),
                                'bookmarks'
                              ) ?? []),
                              {
                                name: get(newBookmarkName),
                                url: get(newBookmarkUrl)
                              }
                            ]
                          );
                          newBookmarkName.set('');
                          newBookmarkUrl.set('');
                        }
                      })
                  )
              })
          )
          .appendElement(
            createNewElement()
              .setType('checkbox')
              .withOptions({
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
          )
          .appendElement(
            createNewElement()
              .setType('text')
              .withOptions({
                text: 'Bookmarks:',
                classes: ['center', 'big', 'margin_top']
              })
              .addCondition(
                derived(globalTiles, (_) => {
                  const bookmarks = getTileWidgetOption(
                    getSelectedManagerId(),
                    getSelectedTileId(),
                    'bookmarks'
                  );
                  return Array.isArray(bookmarks) && bookmarks.length > 0;
                })
              )
              .addUpdater(
                derived(
                  globalTiles,
                  (_) =>
                    getTile(getSelectedManagerId(), getSelectedTileId())?.widgetOptions[
                      'bookmarks'
                    ] ?? []
                )
              )
          )
          .appendElement(
            createNewElement()
              .setType('group')
              .withOptions({
                center: true,
                objects: () =>
                  createNewSettingsSlice(
                    getTileWidgetOption(
                      getSelectedManagerId(),
                      getSelectedTileId(),
                      'bookmarks'
                    ).map((bookmark: any, i: number) =>
                      createNewElement()
                        .setType('group')
                        .withOptions({
                          layout: 'vert',
                          center: true,
                          objects: () =>
                            createNewSettingsSlice()
                              .appendElement(
                                createNewElement()
                                  .setType('image')
                                  .withOptions({
                                    image: () =>
                                      `https://icons.duckduckgo.com/ip3/${
                                        getTileWidgetOption(
                                          getSelectedManagerId(),
                                          getSelectedTileId(),
                                          'bookmarks'
                                        )[i].url.split('/')[2]
                                      }.ico`,
                                    width: '2.5em'
                                  })
                              )
                              .appendElement(
                                createNewElement().setType('text').withOptions({
                                  text: bookmark.name
                                })
                              )
                              .appendElement(
                                createNewElement()
                                  .setType('button')
                                  .withOptions({
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
                              )
                        })
                    )
                  )
              })
              .addCondition(
                derived(globalTiles, (_) => {
                  const bookmarks = getTileWidgetOption(
                    getSelectedManagerId(),
                    getSelectedTileId(),
                    'bookmarks'
                  );
                  return Array.isArray(bookmarks) && bookmarks.length > 0;
                })
              )
              .addUpdater(
                derived(
                  globalTiles,
                  (_) =>
                    getTile(getSelectedManagerId(), getSelectedTileId())?.widgetOptions[
                      'bookmarks'
                    ] ?? []
                )
              )
          )
      };

    default:
      return { ...m, tileProps: createNewSettingsSection() };
  }
});
