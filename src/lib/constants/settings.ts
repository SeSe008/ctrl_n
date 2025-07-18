import type { ElementComponents } from '$lib/types/settings/settings';
import { SettingsSection } from '$lib/classes/settings';

import { derived, get } from 'svelte/store';

import {
  globalTiles,
  getManagers,
  getManager,
  addManager,
  removeManager,
  changeManagerHeight,
  getTile,
  addTile,
  removeTile,
  setTileWidgetType,
  getTileCssVar,
  changeTileCssVar,
  resetTileCssVars,
  changeGlobalCssVar,
  getGlobalCssVar,
  deleteGlobalCssVar,
  resetTileWidgetOptions
} from '$lib/stores/tiles';

import {
  getSelectedManagerId,
  getSelectedTileId,
  setSelectedManager,
  setSelectedTile,
  settings
} from '$lib/stores/settings/settings';

import { tileMetadata } from '$lib/constants/tileMetadata';

import {
  apiImageKeyword,
  backgroundImage,
  getApiImageKeyword,
  imageCategory,
  setApiImageKeyword
} from '$lib/stores/backgroundImage';
import { getRootCssVar } from '$lib/utils/getRootCssVar';
import { imageApis, imageKeywords } from './imageApis';
import { newApiImageKeyword } from '$lib/stores/settings/elements/newApiImageKeyword';
import { tileDefs } from './tileDefs';

import Text from '$lib/Components/Settings/Elements/text.svelte';
import Icon from '$lib/Components/Settings/Elements/icon.svelte';
import Select from '$lib/Components/Settings/Elements/select.svelte';
import Button from '$lib/Components/Settings/Elements/button.svelte';
import Range from '$lib/Components/Settings/Elements/range.svelte';
import TextInput from '$lib/Components/Settings/Elements/textInput.svelte';
import ColorInput from '$lib/Components/Settings/Elements/colorInput.svelte';
import Checkbox from '$lib/Components/Settings/Elements/checkbox.svelte';
import Image from '$lib/Components/Settings/Elements/image.svelte';
import Group from '$lib/Components/Settings/Elements/group.svelte';
import Collapsible from '$lib/Components/Settings/Elements/collapsible.svelte';
import Grid from '$lib/Components/Settings/Elements/grid.svelte';
import CustomHTML from '$lib/Components/Settings/Elements/customHTML.svelte';

export const elementComponents: ElementComponents = {
  text: Text,
  icon: Icon,
  select: Select,
  button: Button,
  range: Range,
  textInput: TextInput,
  colorInput: ColorInput,
  checkbox: Checkbox,
  image: Image,
  group: Group,
  collapsible: Collapsible,
  grid: Grid,
  customHTML: CustomHTML
};

export const tileSettings: SettingsSection = new SettingsSection()
  .appendElement('text', {
    text: 'Tile Settings',
    classes: ['large', 'center', 'strong', 'margin_top']
  })
  .appendElement(
    'select',
    {
      selectOptions: tileMetadata.map(({ label, icon }) => {
        return { label, icon };
      }),
      onChange: (value: number) => {
        resetTileCssVars(getSelectedManagerId(), getSelectedTileId());
        resetTileWidgetOptions(getSelectedManagerId(), getSelectedTileId());
        setTileWidgetType(getSelectedManagerId(), getSelectedTileId(), value);
      },
      defaultValue: () => getTile(getSelectedManagerId(), getSelectedTileId())?.widgetType,
      label: 'Widget Type:'
    },
    undefined,
    settings
  )
  .appendElement('collapsible', {
    title: 'Styling',
    layout: 'vert',
    objects: new SettingsSection()
      .appendElements(
        [1, 2].map((i) => ({
          elementType: 'range',
          elementOptions: {
            min: 0,
            max: 100,
            step: 10,
            unit: '%',
            onInput: (value: number) =>
              changeTileCssVar(
                getSelectedManagerId(),
                getSelectedTileId(),
                `--o${i}`,
                (value / 100).toString()
              ),
            defaultValue: () =>
              parseFloat(
                getTileCssVar(getSelectedManagerId(), getSelectedTileId(), `--o${i}`) ??
                  `0.${i === 1 ? '3' : '7'}`
              ) * 100,
            label: `${i === 1 ? 'Primary' : 'Secondary'} opacity:`
          },
          condition: derived(globalTiles, (_) => {
            const managerId = getSelectedManagerId();
            const tileId = getSelectedTileId();

            if (managerId != null && tileId != null) {
              const tile = getTile(managerId, tileId);
              if (tile) {
                return tileMetadata[tile.widgetType].cssVars?.includes(`--o${i}`) ?? false;
              }
            }

            return false;
          })
        }))
      )
      .appendElement('range', {
        min: 0,
        max: 5,
        step: 0.1,
        onInput: (value: number) => changeManagerHeight(get(settings).selectedManager, value),
        defaultValue: derived(
          globalTiles,
          (_) => getManager(getSelectedManagerId())?.managerHeight ?? 1
        ),
        specialValues: {
          0: 'Auto'
        },
        label: 'Row Height:',
        unit: 'fr'
      })
      .appendElement('range', {
        min: 0,
        max: 100,
        step: 1,
        unit: '%',
        onInput: (value: number) =>
          changeTileCssVar(
            getSelectedManagerId(),
            getSelectedTileId(),
            '--tileWidth',
            value === 0 ? 'max-content' : `${value}%`
          ),
        specialValues: {
          0: 'Auto'
        },
        defaultValue: () =>
          getTileCssVar(getSelectedManagerId(), getSelectedTileId(), '--tileWidth') ===
          'max-content'
            ? 0
            : parseInt(
                getTileCssVar(getSelectedManagerId(), getSelectedTileId(), '--tileWidth') ?? '100'
              ),
        label: 'Tile Width:'
      })
      .appendElement(
        'select',
        {
          selectOptions: [
            {
              label: 'Center',
              value: 'center'
            },
            {
              label: 'Left',
              value: 'flex-start'
            },
            {
              label: 'Right',
              value: 'flex-end'
            }
          ],
          defaultValue: () =>
            getTileCssVar(getSelectedManagerId(), getSelectedTileId(), '--tileHorPos') ?? 'center',
          onChange: (value: string) =>
            changeTileCssVar(getSelectedManagerId(), getSelectedTileId(), '--tileHorPos', value),
          label: 'Horizontal Position:'
        },
        derived(globalTiles, (_) =>
          ((h) => parseInt(h) < 100 || h === 'max-content')(
            getTileCssVar(getSelectedManagerId(), getSelectedTileId(), '--tileWidth') ?? '100'
          )
        )
      )
      .appendElement('range', {
        min: 0,
        max: 100,
        step: 1,
        unit: '%',
        onInput: (value: number) =>
          changeTileCssVar(
            getSelectedManagerId(),
            getSelectedTileId(),
            '--tileHeight',
            value === 0 ? 'max-content' : `${value}%`
          ),
        specialValues: {
          0: 'Auto'
        },
        defaultValue: () =>
          getTileCssVar(getSelectedManagerId(), getSelectedTileId(), '--tileHeight') ===
          'max-content'
            ? 0
            : parseInt(
                getTileCssVar(getSelectedManagerId(), getSelectedTileId(), '--tileHeight') ?? '100'
              ),
        label: 'Tile Height:'
      })
      .appendElement(
        'select',
        {
          selectOptions: [
            {
              label: 'Center',
              value: 'center'
            },
            {
              label: 'Top',
              value: 'flex-start'
            },
            {
              label: 'Bottom',
              value: 'flex-end'
            }
          ],
          defaultValue: () =>
            getTileCssVar(getSelectedManagerId(), getSelectedTileId(), '--tileVerPos') ??
            'flex-start',
          onChange: (value: string) =>
            changeTileCssVar(getSelectedManagerId(), getSelectedTileId(), '--tileVerPos', value),
          label: 'Vertical Position:'
        },
        derived(globalTiles, (_) =>
          ((h) => parseInt(h) < 100 || h === 'max-content')(
            getTileCssVar(getSelectedManagerId(), getSelectedTileId(), '--tileHeight') ?? '100'
          )
        )
      )
      .appendElement(
        'checkbox',
        {
          onChange: (value: boolean) =>
            changeTileCssVar(
              getSelectedManagerId(),
              getSelectedTileId(),
              '--tileBorder',
              value ? 'unset' : 'none'
            ),
          defaultValue: () =>
            (getTileCssVar(getSelectedManagerId(), getSelectedTileId(), '--tileBorder') ??
              'unset') === 'unset',
          label: 'Tile-Border'
        },
        derived(globalTiles, (_) => {
          const managerId = getSelectedManagerId();
          const tileId = getSelectedTileId();

          if (managerId != null && tileId != null) {
            const tile = getTile(managerId, tileId);
            if (tile) {
              return tileMetadata[tile.widgetType].cssVars?.includes('--tileBorder') ?? false;
            }
          }

          return false;
        })
      )
      .appendElement(
        'checkbox',
        {
          onChange: (value: boolean) =>
            changeTileCssVar(
              getSelectedManagerId(),
              getSelectedTileId(),
              '--tileTitle',
              value ? 'flex' : 'none'
            ),
          defaultValue: () =>
            (getTileCssVar(getSelectedManagerId(), getSelectedTileId(), '--tileTitle') ??
              'unset') === 'unset',
          label: 'Tile-Title'
        },
        derived(globalTiles, (_) => {
          const managerId = getSelectedManagerId();
          const tileId = getSelectedTileId();

          if (managerId != null && tileId != null) {
            const tile = getTile(managerId, tileId);
            if (tile) {
              return tileMetadata[tile.widgetType].cssVars?.includes('--tileTitle') ?? false;
            }
          }

          return false;
        })
      )
      .appendElement(
        'range',
        {
          min: 0,
          max: 10,
          step: 0.5,
          unit: 'rem',
          onInput: (value: number) =>
            changeTileCssVar(
              getSelectedManagerId(),
              getSelectedTileId(),
              '--tileBorderRadius',
              `${value}rem`
            ),
          defaultValue: () =>
            parseFloat(
              getTileCssVar(getSelectedManagerId(), getSelectedTileId(), '--tileBorderRadius') ??
                '0.5'
            ),
          label: 'Border Radius:'
        },
        derived(globalTiles, (_) => {
          const managerId = getSelectedManagerId();
          const tileId = getSelectedTileId();

          if (managerId != null && tileId != null) {
            const tile = getTile(managerId, tileId);
            if (tile) {
              return tileMetadata[tile.widgetType].cssVars?.includes('--tileBorderRadius') ?? false;
            }
          }

          return false;
        })
      )
  });

export const globalSettings: SettingsSection = new SettingsSection()
  .appendElement('group', {
    center: true,
    objects: new SettingsSection().appendElement('image', {
      image: () => 'icons/icon.svg',
      width: '10em'
    })
  })
  .appendElement('text', {
    text: 'Settings',
    classes: ['large', 'center', 'strong']
  })
  .appendElement(
    'group',
    {
      layout: 'vert',
      center: true,
      objects: () =>
        new SettingsSection(
          getManagers().map((mgr, mgrId) => ({
            elementType: 'group',
            elementOptions: {
              layout: 'vert',
              background: true,
              border: true,
              objects: new SettingsSection()
                .appendElement('group', {
                  center: true,
                  objects: new SettingsSection()
                    .appendElement('text', {
                      text: `Row ${mgrId + 1}`,
                      classes: ['strong']
                    })
                    .appendElement(
                      'button',
                      {
                        icon: 'mdi:delete',
                        simple: true,
                        onClick: () => {
                          removeManager(mgrId);
                          setSelectedManager(0);
                        }
                      },
                      () => getManagers().length > 1
                    )
                })
                .appendElement('group', {
                  center: true,
                  objects: new SettingsSection(
                    mgr.tiles.map((tle, tleId) => ({
                      elementType: 'group',
                      elementOptions: {
                        border: true,
                        center: true,
                        objects: new SettingsSection()
                          .appendElement('icon', {
                            icon:
                              tileDefs[tle.widgetType].icon ??
                              'material-symbols:widgets-outline-rounded',
                            size: '1.3em'
                          })
                          .appendElement('text', {
                            text: tileDefs[tle.widgetType].label
                          })
                          .appendElement('button', {
                            icon: 'mdi:settings-outline',
                            simple: true,
                            onClick: () => {
                              setSelectedManager(mgrId);
                              setSelectedTile(tleId);
                            }
                          })
                          .appendElement(
                            'button',
                            {
                              icon: 'mdi:delete',
                              simple: true,
                              onClick: () => {
                                removeTile(mgrId, tleId);
                                setSelectedTile(-1);
                              }
                            },
                            () => getManager(mgrId)!.tiles.length > 1
                          )
                      }
                    }))
                  ).appendElement('button', {
                    simple: true,
                    icon: 'mdi:add',
                    onClick: () => addTile(mgrId)
                  })
                })
            }
          }))
        ).appendElement('button', {
          text: 'Append Row',
          onClick: () => addManager()
        })
    },
    undefined,
    globalTiles
  )
  .appendElement('collapsible', {
    title: 'Background Image',
    objects: new SettingsSection()
      .appendElement('select', {
        selectOptions: () => imageApis,
        defaultValue: imageCategory,
        store: imageCategory,
        label: 'Get image from: '
      })
      .appendElement('select', {
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
      .appendElement(
        'group',
        {
          objects: new SettingsSection()
            .appendElement('textInput', {
              label: 'Custom Keyword:',
              placeholder: 'Enter a keyword',
              defaultValue: () => getApiImageKeyword(),
              store: newApiImageKeyword
            })
            .appendElement('button', {
              text: 'Apply',
              icon: 'mdi:check',
              onClick: () => setApiImageKeyword(get(newApiImageKeyword))
            })
        },
        derived(
          apiImageKeyword,
          ($apiImageKeyword) =>
            !imageKeywords.includes($apiImageKeyword) || $apiImageKeyword === 'Custom'
        )
      )
  })
  .appendElement('collapsible', {
    layout: 'vert',
    title: 'Styling',
    objects: new SettingsSection()
      .appendElement('range', {
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
      .appendElement('text', {
        text: 'Coloring:',
        classes: ['medium', 'margin_top']
      })
      .appendElement('group', {
        layout: 'vert',
        objects: new SettingsSection(
          Array.from({ length: 5 }).map((_, i) => ({
            elementType: 'group',
            elementOptions: {
              objects: new SettingsSection()
                .appendElement(
                  'colorInput',
                  {
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
                  },
                  undefined,
                  derived(globalTiles, ($globalTiles) => $globalTiles.cssVars[`--c${i + 1}`])
                )
                .appendElement('button', {
                  icon: 'mdi:reload',
                  onClick: () => deleteGlobalCssVar(`--c${i + 1}`),
                  simple: true
                })
            },
            updater: backgroundImage
          }))
        )
      })
  });
