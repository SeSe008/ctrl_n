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
  setTileElement,
  getTileCssVar,
  changeTileCssVar,
  resetTileCssVars,
  changeGlobalCssVar,
  getGlobalCssVar,
  deleteGlobalCssVar
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

import Text from '$lib/Components/Settings/Elements/text.svelte';
import Select from '$lib/Components/Settings/Elements/select.svelte';
import Button from '$lib/Components/Settings/Elements/button.svelte';
import Range from '$lib/Components/Settings/Elements/range.svelte';
import TextInput from '$lib/Components/Settings/Elements/textInput.svelte';
import ColorInput from '$lib/Components/Settings/Elements/colorInput.svelte';
import Checkbox from '$lib/Components/Settings/Elements/checkbox.svelte';
import Image from '$lib/Components/Settings/Elements/image.svelte';
import Group from '$lib/Components/Settings/Elements/group.svelte';
import Grid from '$lib/Components/Settings/Elements/grid.svelte';
import CustomHTML from '$lib/Components/Settings/Elements/customHTML.svelte';
import { getRootCssVar } from '$lib/utils/getRootCssVar';
import { imageApis, imageKeywords } from './imageApis';
import { newApiImageKeyword } from '$lib/stores/settings/elements/newApiImageKeyword';

export const elementComponents: ElementComponents = {
  text: Text,
  select: Select,
  button: Button,
  range: Range,
  textInput: TextInput,
  colorInput: ColorInput,
  checkbox: Checkbox,
  image: Image,
  group: Group,
  grid: Grid,
  customHTML: CustomHTML
};

export const tileSettings: SettingsSection = new SettingsSection()
  .appendElement('text', {
    text: 'Tile Settings',
    classes: ['large', 'center', 'strong', 'margin_top']
  })
  .appendElement('group', {
    objects: new SettingsSection()
      .appendElement('button', {
        text: 'Append Tile',
        icon: 'mdi:add-circle-outline',
        onClick: () => addTile(getSelectedManagerId())
      })
      .appendElement(
        'button',
        {
          text: 'Remove Tile',
          icon: 'mdi:remove-circle-outline',
          onClick: () => {
            removeTile(getSelectedManagerId(), getSelectedTileId());
            setSelectedTile(0);
          }
        },
        derived(globalTiles, (_) =>
          getSelectedManagerId() !== undefined
            ? (getManager(getSelectedManagerId()!)?.tiles.length ?? 0) > 1
            : false
        )
      )
  })
  .appendElement(
    'select',
    {
      selectOptions: tileMetadata.map(({ label, icon }) => {
        return { label, icon };
      }),
      onChange: (value: number) => {
        resetTileCssVars(getSelectedManagerId(), getSelectedTileId());
        setTileElement(getSelectedManagerId(), getSelectedTileId(), value);
      },
      defaultValue: derived(
        globalTiles,
        (_) => getTile(getSelectedManagerId(), getSelectedTileId())?.element ?? 0
      ),
      label: 'Widget Type:'
    },
    undefined,
    settings
  )
  .appendElement('group', {
    layout: 'vert',
    objects: new SettingsSection()
      .appendElement('text', {
        text: 'Styling:',
        classes: ['big', 'left', 'margin-top']
      })
      .appendElement(
        'range',
        {
          min: 0,
          max: 100,
          step: 10,
          unit: '%',
          onInput: (value: number) =>
            changeTileCssVar(
              getSelectedManagerId(),
              getSelectedTileId(),
              '--o1',
              (value / 100).toString()
            ),
          defaultValue: () =>
            parseFloat(
              getTileCssVar(getSelectedManagerId(), getSelectedTileId(), '--o1') ?? '0.3'
            ) * 100,
          label: 'Primary opacity:'
        },
        derived(globalTiles, (_) => {
          const managerId = getSelectedManagerId();
          const tileId = getSelectedTileId();

          if (managerId != null && tileId != null) {
            const tile = getTile(managerId, tileId);
            if (tile) {
              return tileMetadata[tile.element].cssVars?.includes('--o1') ?? false;
            }
          }

          return false;
        })
      )
      .appendElement(
        'range',
        {
          min: 0,
          max: 100,
          step: 10,
          onInput: (value: number) =>
            changeTileCssVar(
              getSelectedManagerId(),
              getSelectedTileId(),
              '--o2',
              (value / 100).toString()
            ),
          defaultValue: () =>
            parseFloat(
              getTileCssVar(getSelectedManagerId(), getSelectedTileId(), '--o2') ?? '0.7'
            ) * 100,
          label: 'Secondary opacity:'
        },
        derived(globalTiles, (_) => {
          const managerId = getSelectedManagerId();
          const tileId = getSelectedTileId();

          if (managerId != null && tileId != null) {
            const tile = getTile(managerId, tileId);
            if (tile) {
              return tileMetadata[tile.element].cssVars?.includes('--o2') ?? false;
            }
          }

          return false;
        })
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
              return tileMetadata[tile.element].cssVars?.includes('--tileBorder') ?? false;
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
              return tileMetadata[tile.element].cssVars?.includes('--tileBorderRadius') ?? false;
            }
          }

          return false;
        })
      )
  });

export const tileManagerSettings: SettingsSection = new SettingsSection()
  .appendElement('text', {
    text: 'Row Settings',
    classes: ['large', 'center', 'strong', 'margin_top']
  })
  .appendElement('group', {
    objects: new SettingsSection()
      .appendElement('button', {
        text: 'Append Row',
        icon: 'mdi:add-circle-outline',
        onClick: () => addManager()
      })
      .appendElement('button', {
        text: 'Remove Row',
        icon: 'mdi:remove-circle-outline',
        onClick: () => {
          if (getManagers().length > 1) {
            removeManager(getSelectedManagerId());
            setSelectedManager(0);
          }
        }
      })
  })
  .appendElement('text', {
    text: 'Row-Height:',
    classes: ['big', 'left', 'margin_top']
  })
  .appendElement('range', {
    min: 0,
    max: 5,
    step: 0.1,
    onInput: (value: number) => changeManagerHeight(get(settings).selectedManager, value),
    defaultValue: derived(globalTiles, (_) =>
      getSelectedManagerId() !== undefined && getManager(getSelectedManagerId()!)
        ? getManager(getSelectedManagerId()!)!.height
        : 1
    ),
    specialValues: {
      0: 'Fit-Content'
    },
    valueLabel: 'Preferred height:',
    unit: 'fr'
  });

export const globalSettings: SettingsSection = new SettingsSection()
  .appendElement('text', {
    text: 'Global Settings',
    classes: ['large', 'center', 'strong']
  })
  .appendElement('text', {
    text: 'Background Image',
    classes: ['big', 'left', 'strong', 'margin_top']
  })
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
  .appendElement(
    'text',
    {
      text: 'No image found, try another keyword or category.'
    },
    derived(backgroundImage, ($backgroundImage) => $backgroundImage === undefined)
  )
  .appendElement('text', {
    text: 'Styling:',
    classes: ['big', 'left', 'margin_top']
  })
  .appendElement('range', {
    min: 0,
    max: 10,
    step: 0.5,
    unit: 'rem',
    onInput: (value: number) => {
      changeGlobalCssVar('--tileContainerPadding', `${value.toString()}rem`);
    },
    defaultValue: () => parseFloat(getGlobalCssVar('--tileContainerPadding') ?? '0'),
    label: 'Tile-Container Padding:'
  })
  .appendElement('text', {
    text: 'Coloring:'
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
                label: `${i + 1}:`,
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
  });
