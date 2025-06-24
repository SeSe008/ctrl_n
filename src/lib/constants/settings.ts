import type { ElementComponents } from '$lib/types/settings/settings';
import { SettingsElement, SettingsSection } from '$lib/classes/settings';

import { derived, get } from 'svelte/store';
import {
  addTile,
  removeTile,
  changeManagerHeight,
  changeTile,
  globalTiles,
  changeCssVar,
  addManager,
  removeManager,
  getTiles,
  getManager,
  getCssVar,
  getTile,
  resetCssVars
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
  addImageToCategoryInCategories,
  getImageCategories,
  getImageCategory,
  imageCategories,
  imageCategory,
  removeImageFromCategoryInCategories,
  toggleImageInCategory
} from '$lib/stores/backgroundImage';
import { newImageUrl } from '$lib/stores/settings/elements/newBgImage';

import Text from '$lib/Components/Settings/Elements/text.svelte';
import Select from '$lib/Components/Settings/Elements/select.svelte';
import Button from '$lib/Components/Settings/Elements/button.svelte';
import Range from '$lib/Components/Settings/Elements/range.svelte';
import TextInput from '$lib/Components/Settings/Elements/textInput.svelte';
import Checkbox from '$lib/Components/Settings/Elements/checkbox.svelte';
import Image from '$lib/Components/Settings/Elements/image.svelte';
import Group from '$lib/Components/Settings/Elements/group.svelte';
import Grid from '$lib/Components/Settings/Elements/grid.svelte';
import CustomHTML from '$lib/Components/Settings/Elements/customHTML.svelte';

export const elementComponents: ElementComponents = {
  text: Text,
  select: Select,
  button: Button,
  range: Range,
  textInput: TextInput,
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
    center: true,
    objects: new SettingsSection().appendElement('select', {
      label: 'Select Widget:',
      selectOptions: () =>
        getManager(getSelectedManagerId() || 0)?.tiles.map((tle, i) => ({
          label: `Tile ${i + 1} (${tileMetadata[tle.element].label})`,
          icon: tileMetadata[tle.element].icon
        })) || [],
      defaultValue: () => getSelectedTileId(),
      onChange: (value: number) => setSelectedTile(value)
    })
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
        resetCssVars(getSelectedManagerId(), getSelectedTileId());
        changeTile(getSelectedManagerId(), getSelectedTileId(), value);
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
          max: 1,
          step: 0.1,
          onInput: (value: number) =>
            changeCssVar(getSelectedManagerId(), getSelectedTileId(), '--o1', value.toString()),
          defaultValue: () =>
            parseFloat(getCssVar(getSelectedManagerId(), getSelectedTileId(), '--o1') ?? '0.3'),
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
          max: 1,
          step: 0.1,
          onInput: (value: number) =>
            changeCssVar(getSelectedManagerId(), getSelectedTileId(), '--o2', value.toString()),
          defaultValue: () =>
            parseFloat(getCssVar(getSelectedManagerId(), getSelectedTileId(), '--o2') ?? '0.7'),
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
          changeCssVar(
            getSelectedManagerId(),
            getSelectedTileId(),
            '--tileWidth',
            value === 0 ? 'max-content' : `${value}%`
          ),
        specialValues: {
          0: 'Auto'
        },
        defaultValue: () =>
          getCssVar(getSelectedManagerId(), getSelectedTileId(), '--tileWidth') === 'max-content'
            ? 0
            : parseInt(
                getCssVar(getSelectedManagerId(), getSelectedTileId(), '--tileWidth') ?? '100'
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
            getCssVar(getSelectedManagerId(), getSelectedTileId(), '--tileHorPos') ?? 'center',
          onChange: (value: string) =>
            changeCssVar(getSelectedManagerId(), getSelectedTileId(), '--tileHorPos', value),
          label: 'Horizontal Position:'
        },
        derived(globalTiles, (_) =>
          ((h) => parseInt(h) < 100 || h === 'max-content')(
            getCssVar(getSelectedManagerId(), getSelectedTileId(), '--tileWidth') ?? '100'
          )
        )
      )
      .appendElement('range', {
        min: 0,
        max: 100,
        step: 1,
        unit: '%',
        onInput: (value: number) =>
          changeCssVar(
            getSelectedManagerId(),
            getSelectedTileId(),
            '--tileHeight',
            value === 0 ? 'max-content' : `${value}%`
          ),
        specialValues: {
          0: 'Auto'
        },
        defaultValue: () =>
          getCssVar(getSelectedManagerId(), getSelectedTileId(), '--tileHeight') === 'max-content'
            ? 0
            : parseInt(
                getCssVar(getSelectedManagerId(), getSelectedTileId(), '--tileHeight') ?? '100'
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
            getCssVar(getSelectedManagerId(), getSelectedTileId(), '--tileVerPos') ?? 'flex-start',
          onChange: (value: string) =>
            changeCssVar(getSelectedManagerId(), getSelectedTileId(), '--tileVerPos', value),
          label: 'Vertical Position:'
        },
        derived(globalTiles, (_) =>
          ((h) => parseInt(h) < 100 || h === 'max-content')(
            getCssVar(getSelectedManagerId(), getSelectedTileId(), '--tileHeight') ?? '100'
          )
        )
      )
      .appendElement(
        'checkbox',
        {
          onChange: (value: boolean) =>
            changeCssVar(
              getSelectedManagerId(),
              getSelectedTileId(),
              '--tileBorder',
              value ? 'unset' : 'none'
            ),
          defaultValue: () =>
            (getCssVar(getSelectedManagerId(), getSelectedTileId(), '--tileBorder') ?? 'unset') ===
            'unset',
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
            changeCssVar(
              getSelectedManagerId(),
              getSelectedTileId(),
              '--tileBorderRadius',
              `${value}rem`
            ),
          defaultValue: () =>
            parseFloat(
              getCssVar(getSelectedManagerId(), getSelectedTileId(), '--tileBorderRadius') ?? '0.5'
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
    center: true,
    objects: new SettingsSection().appendElement('select', {
      label: 'Select Row:',
      selectOptions: () =>
        getTiles().map((_, i) => ({
          label: `Row ${i + 1}`
        })),
      onChange: (value: number) => {
        setSelectedTile(0);
        setSelectedManager(value);
      },
      defaultValue: derived(settings, ($settings) => $settings.selectedManager || 0)
    })
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
          if (getTiles().length > 1) {
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
  .appendElement(
    'select',
    {
      selectOptions: () => getImageCategories(),
      defaultValue: imageCategory,
      store: imageCategory,
      label: 'Image Category: '
    },
    undefined,
    imageCategories
  )
  .appendElement('group', {
    objects: new SettingsSection()
      .appendElement('text', {
        text: 'Add Image:'
      })
      .appendElement('textInput', {
        store: newImageUrl,
        placeholder: 'Image Url'
      })
      .appendElement('button', {
        text: 'Add',
        icon: 'mdi:add-circle-outline',
        onClick: () => addImageToCategoryInCategories(getImageCategory(), get(newImageUrl))
      })
  })
  .appendElement(
    'grid',
    {
      columns: 4,
      objects: () =>
        new SettingsSection(
          getImageCategories()[getImageCategory()].images?.map(
            (img, i) =>
              new SettingsElement('group', {
                layout: 'vert',
                objects: new SettingsSection()
                  .appendElement('image', {
                    image: () => img,
                    alt: 'Background-Image'
                  })
                  .appendElement('group', {
                    wrap: false,
                    center: true,
                    objects: new SettingsSection()
                      .appendElement('checkbox', {
                        onChange: () => toggleImageInCategory(getImageCategory(), i),
                        defaultValue: () => img[1] as boolean,
                        label: 'Enabled'
                      })
                      .appendElement('button', {
                        icon: 'mdi:delete',
                        onClick: () => {
                          // Force ok here - for deleting an image, you need an image
                          if (getImageCategories()[getImageCategory()].images!.length > 1)
                            removeImageFromCategoryInCategories(getImageCategory(), i);
                        }
                      })
                  })
              })
          )
        )
    },
    undefined,
    [imageCategory, imageCategories]
  );
