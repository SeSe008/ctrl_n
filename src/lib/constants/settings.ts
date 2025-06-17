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
  getManager
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

export const elementComponents: ElementComponents = {
  text: Text,
  select: Select,
  button: Button,
  range: Range,
  textInput: TextInput,
  checkbox: Checkbox,
  image: Image,
  group: Group,
  grid: Grid
};

export const tileSettings: SettingsSection = new SettingsSection()
  .appendElement('text', {
    text: 'Tile Settings',
    classes: ['large', 'center', 'strong']
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
      onChange: (value: number) => setSelectedTile(value),
      updater: [globalTiles, settings]
    })
  })
  .appendElement('group', {
    objects: new SettingsSection()
      .appendElement('button', {
        text: 'Append Tile',
        icon: 'mdi:add-circle-outline',
        onClick: () => addTile(getSelectedManagerId())
      })
      .appendElement('button', {
        text: 'Remove Tile',
        icon: 'mdi:remove-circle-outline',
        onClick: () => {
          removeTile(getSelectedManagerId(), getSelectedTileId());
          setSelectedTile(0);
        }
      })
  })
  .appendElement('select', {
    selectOptions: tileMetadata.map(({ label, icon }) => {
      return { label, icon };
    }),
    onChange: (value: number) =>
      changeTile(get(settings).selectedManager, get(settings).selectedTile, value),
    defaultValue: derived([globalTiles, settings], ([$globalTiles, $settings]) => {
      const mgr = $settings.selectedManager;
      const tle = $settings.selectedTile;
      return mgr !== undefined && tle !== undefined ? $globalTiles[mgr].tiles[tle].element : 0;
    }),
    label: 'Widget Type:'
  })
  .appendElement('group', {
    layout: 'vert',
    objects: new SettingsSection()
      .appendElement('text', {
        text: 'Opacity',
        classes: ['big', 'left', 'margin-top']
      })
      .appendElement('range', {
        min: 0,
        max: 1,
        step: 0.1,
        onInput: (value: number) =>
          changeCssVar(
            get(settings).selectedManager,
            get(settings).selectedTile,
            '--o1',
            value.toString()
          ),
        defaultValue: derived([globalTiles, settings], ([$globalTiles, $settings]) => {
          const mgr = $settings.selectedManager;
          const tle = $settings.selectedTile;
          return mgr !== undefined &&
            tle !== undefined &&
            $globalTiles[mgr].tiles[tle].cssVars['--o1']
            ? parseInt($globalTiles[mgr].tiles[tle].cssVars['--o1'])
            : 0.3;
        }),
        label: 'Primary opacity:'
      })
      .appendElement('range', {
        min: 0,
        max: 1,
        step: 0.1,
        onInput: (value: number) =>
          changeCssVar(
            get(settings).selectedManager,
            get(settings).selectedTile,
            '--o2',
            value.toString()
          ),
        defaultValue: derived([globalTiles, settings], ([$globalTiles, $settings]) => {
          const mgr = $settings.selectedManager;
          const tle = $settings.selectedTile;
          return mgr !== undefined &&
            tle !== undefined &&
            $globalTiles[mgr].tiles[tle].cssVars['--o2']
            ? parseInt($globalTiles[mgr].tiles[tle].cssVars['--o2'])
            : 0.7;
        }),
        label: 'Secondary opacity:'
      })
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
  .appendElement('text', {
    text: 'Row-Height:',
    classes: ['medium', 'left', 'margin_vert']
  })
  .appendElement('range', {
    min: 0,
    max: 5,
    step: 0.1,
    onInput: (value: number) => changeManagerHeight(get(settings).selectedManager, value),
    defaultValue: derived([globalTiles, settings], ([$globalTiles, $settings]) => {
      const mgr = $settings.selectedManager;
      return mgr !== undefined ? $globalTiles[mgr].height : 0;
    }),
    specialValues: {
      0: 'Fit-Content'
    },
    valueLabel: 'Preferred height:',
    unit: 'fr'
  })
  .appendElement('button', {
    onClick: () => changeManagerHeight(get(settings).selectedManager, 1),
    text: 'Reset Height'
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
    selectOptions: () => getImageCategories(),
    defaultValue: imageCategory,
    store: imageCategory,
    updater: imageCategories,
    label: 'Image Category: '
  })
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
  .appendElement('grid', {
    columns: 4,
    objects: () =>
      new SettingsSection(
        getImageCategories()[getImageCategory()].images?.map(
          (img, i) =>
            new SettingsElement('group', {
              layout: 'vert',
              objects: new SettingsSection()
                .appendElement('image', {
                  image: () => getImageCategories()[getImageCategory()].images?.[i] || img,
                  updater: [imageCategory, imageCategories]
                })
                .appendElement('group', {
                  wrap: false,
                  center: true,
                  objects: new SettingsSection()
                    .appendElement('checkbox', {
                      onChange: () => toggleImageInCategory(getImageCategory(), i),
                      defaultValue: () =>
                        (getImageCategories()[getImageCategory()].images?.[i][1] ||
                          img[1]) as boolean,
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
      ),
    updater: [imageCategories, imageCategory]
  })
  .appendElement('text', {
    text: 'Rows',
    classes: ['big', 'left', 'strong', 'margin_top']
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
          removeManager(get(settings).selectedManager);
          setSelectedManager(get(settings).selectedManager! - 1);
        }
      })
  });
