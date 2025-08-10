import { SettingsSection } from '$lib/classes/settings';
import {
  imageCategory,
  setApiImageKeyword,
  getApiImageKeyword,
  apiImageKeyword,
  backgroundImage
} from '$lib/stores/backgroundImage';
import { newApiImageKeyword } from '$lib/stores/settings/elements/newApiImageKeyword';
import { setSelectedManager, setSelectedTile } from '$lib/stores/settings/settings';
import {
  getManagers,
  removeManager,
  removeTile,
  getManager,
  addTile,
  addManager,
  globalTiles,
  changeGlobalCssVar,
  getGlobalCssVar,
  deleteGlobalCssVar
} from '$lib/stores/tiles';
import { createNewElement } from '$lib/utils/createSettings';
import { getRootCssVar } from '$lib/utils/getRootCssVar';
import { get, derived } from 'svelte/store';
import { imageApis, imageKeywords } from './imageApis';
import { tileDefs } from './tileDefs';

export const globalSettings: SettingsSection = new SettingsSection()
  .appendElement(
    createNewElement()
      .setType('group')
      .withOptions({
        center: true,
        objects: new SettingsSection().appendElement(
          createNewElement()
            .setType('image')
            .withOptions({
              image: () => 'icons/icon.svg',
              width: '10em'
            })
        )
      })
  )
  .appendElement(
    createNewElement()
      .setType('text')
      .withOptions({
        text: 'Settings',
        classes: ['large', 'center', 'strong']
      })
  )
  .appendElement(
    createNewElement()
      .setType('group')
      .withOptions({
        layout: 'vert',
        center: true,
        objects: () =>
          new SettingsSection()
            .appendElements(
              getManagers().map((mgr, mgrId) =>
                createNewElement()
                  .setType('group')
                  .withOptions({
                    layout: 'vert',
                    background: true,
                    border: true,
                    objects: new SettingsSection()
                      .appendElement(
                        createNewElement()
                          .setType('group')
                          .withOptions({
                            center: true,
                            objects: new SettingsSection()
                              .appendElement(
                                createNewElement()
                                  .setType('text')
                                  .withOptions({
                                    text: `Row ${mgrId + 1}`,
                                    classes: ['strong']
                                  })
                              )
                              .appendElement(
                                createNewElement()
                                  .setType('button')
                                  .withOptions({
                                    icon: 'mdi:delete',
                                    simple: true,
                                    onClick: () => {
                                      removeManager(mgrId);
                                      setSelectedManager(0);
                                    }
                                  })
                                  .addCondition(() => getManagers().length > 1)
                              )
                          })
                      )
                      .appendElement(
                        createNewElement()
                          .setType('group')
                          .withOptions({
                            center: true,
                            objects: new SettingsSection(
                              mgr.tiles.map((tle, tleId) =>
                                createNewElement()
                                  .setType('group')
                                  .withOptions({
                                    border: true,
                                    center: true,
                                    objects: new SettingsSection()
                                      .appendElement(
                                        createNewElement()
                                          .setType('icon')
                                          .withOptions({
                                            icon:
                                              tileDefs[tle.widgetType].icon ??
                                              'material-symbols:widgets-outline-rounded',
                                            size: '1.3em'
                                          })
                                      )
                                      .appendElement(
                                        createNewElement().setType('text').withOptions({
                                          text: tileDefs[tle.widgetType].label
                                        })
                                      )
                                      .appendElement(
                                        createNewElement()
                                          .setType('button')
                                          .withOptions({
                                            icon: 'mdi:settings-outline',
                                            simple: true,
                                            onClick: () => {
                                              setSelectedManager(mgrId);
                                              setSelectedTile(tleId);
                                            }
                                          })
                                      )
                                      .appendElement(
                                        createNewElement()
                                          .setType('button')
                                          .withOptions({
                                            icon: 'mdi:delete',
                                            simple: true,
                                            onClick: () => {
                                              removeTile(mgrId, tleId);
                                              setSelectedTile(-1);
                                            }
                                          })
                                          .addCondition(() => getManager(mgrId)!.tiles.length > 1)
                                      )
                                  })
                              )
                            )
                          })
                      )
                      .appendElement(
                        createNewElement()
                          .setType('button')
                          .withOptions({
                            simple: true,
                            icon: 'mdi:add',
                            onClick: () => addTile(mgrId)
                          })
                      )
                  })
              )
            )
            .appendElement(
              createNewElement()
                .setType('button')
                .withOptions({
                  text: 'Append Row',
                  onClick: () => addManager()
                })
            )
      })
      .addUpdater(globalTiles)
  )
  .appendElement(
    createNewElement()
      .setType('collapsible')
      .withOptions({
        title: 'Background Image',
        objects: new SettingsSection()
          .appendElement(
            createNewElement()
              .setType('select')
              .withOptions({
                selectOptions: () => imageApis,
                defaultValue: imageCategory,
                store: imageCategory,
                label: 'Get image from: '
              })
          )
          .appendElement(
            createNewElement()
              .setType('select')
              .withOptions({
                label: 'Keyword:',
                selectOptions: imageKeywords.map((keyword) => ({
                  label: keyword,
                  value: keyword
                })),
                onChange: (value: string) => setApiImageKeyword(value),
                defaultValue: () => {
                  let keyword = getApiImageKeyword();
                  if (!imageKeywords.includes(keyword)) {
                    keyword = 'Custom';
                  }
                  return keyword;
                }
              })
          )
          .appendElement(
            createNewElement()
              .setType('group')
              .withOptions({
                objects: new SettingsSection()
                  .appendElement(
                    createNewElement()
                      .setType('textInput')
                      .withOptions({
                        label: 'Custom Keyword:',
                        placeholder: 'Enter a keyword',
                        defaultValue: () => getApiImageKeyword(),
                        store: newApiImageKeyword
                      })
                  )
                  .appendElement(
                    createNewElement()
                      .setType('button')
                      .withOptions({
                        text: 'Apply',
                        icon: 'mdi:check',
                        onClick: () => setApiImageKeyword(get(newApiImageKeyword))
                      })
                  )
              })
              .addCondition(
                derived(
                  apiImageKeyword,
                  ($apiImageKeyword) =>
                    !imageKeywords.includes($apiImageKeyword) || $apiImageKeyword === 'Custom'
                )
              )
          )
      })
  )
  .appendElement(
    createNewElement()
      .setType('collapsible')
      .withOptions({
        layout: 'vert',
        title: 'Styling',
        objects: new SettingsSection()
          .appendElement(
            createNewElement()
              .setType('range')
              .withOptions({
                min: 0,
                max: 10,
                step: 0.5,
                unit: 'rem',
                onInput: (value: number) => {
                  changeGlobalCssVar('--tileContainerPadding', `${value.toString()}rem`);
                },
                defaultValue: () => parseFloat(getGlobalCssVar('--tileContainerPadding') ?? '0.5'),
                label: 'Tile-Container Padding:'
              })
          )
          .appendElement(
            createNewElement()
              .setType('text')
              .withOptions({
                text: 'Coloring:',
                classes: ['medium', 'margin_top']
              })
          )
          .appendElement(
            createNewElement()
              .setType('group')
              .withOptions({
                layout: 'vert',
                objects: new SettingsSection(
                  Array.from({ length: 5 }).map((_, i) => ({
                    elementType: 'group',
                    elementOptions: {
                      objects: new SettingsSection()
                        .appendElement(
                          createNewElement()
                            .setType('colorInput')
                            .withOptions({
                              label: `Color ${i + 1}:`,
                              onChange: (value: string) =>
                                changeGlobalCssVar(
                                  `--c${i + 1}`,
                                  (value.replace(/^#/, '').match(/.{2}/g) ?? [])
                                    .map((x) => parseInt(x, 16))
                                    .join(', ')
                                ),
                              defaultValue: () =>
                                `#${(
                                  getGlobalCssVar('--c' + (i + 1)) ??
                                  getRootCssVar('--c' + (i + 1)) ??
                                  '255, 255, 255'
                                )
                                  .split(',')
                                  .map((c) => (+c).toString(16).padStart(2, '0'))
                                  .join('')}`
                            })
                            .addUpdater(
                              derived(
                                globalTiles,
                                ($globalTiles) => $globalTiles.cssVars[`--c${i + 1}`]
                              )
                            )
                        )
                        .appendElement(
                          createNewElement()
                            .setType('button')
                            .withOptions({
                              icon: 'mdi:reload',
                              onClick: () => deleteGlobalCssVar(`--c${i + 1}`),
                              simple: true
                            })
                        )
                    },
                    updater: backgroundImage
                  }))
                )
              })
          )
      })
  );
