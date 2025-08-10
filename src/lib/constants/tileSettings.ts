import { SettingsSection } from '$lib/classes/settings';
import { getSelectedManagerId, getSelectedTileId, settings } from '$lib/stores/settings/settings';
import {
  resetTileCssVars,
  resetTileWidgetOptions,
  setTileWidgetType,
  getTile,
  changeTileCssVar,
  getTileCssVar,
  globalTiles,
  changeManagerHeight,
  getManager
} from '$lib/stores/tiles';
import { createNewElement } from '$lib/utils/createSettings';
import { derived, get } from 'svelte/store';
import { tileMetadata } from './tileMetadata';

export const tileSettings: SettingsSection = new SettingsSection()
  .appendElement(
    createNewElement()
      .setType('text')
      .withOptions({
        text: 'Tile Settings',
        classes: ['large', 'center', 'strong', 'margin_top']
      })
  )
  .appendElement(
    createNewElement()
      .setType('select')
      .withOptions({
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
      })
      .addUpdater(settings)
  )
  .appendElement(
    createNewElement('collapsible').withOptions({
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
        .appendElement(
          createNewElement()
            .setType('range')
            .withOptions({
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
        )
        .appendElement(
          createNewElement()
            .setType('range')
            .withOptions({
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
                      getTileCssVar(getSelectedManagerId(), getSelectedTileId(), '--tileWidth') ??
                        '100'
                    ),
              label: 'Tile Width:'
            })
        )
        .appendElement(
          createNewElement()
            .setType('select')
            .withOptions({
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
                getTileCssVar(getSelectedManagerId(), getSelectedTileId(), '--tileHorPos') ??
                'center',
              onChange: (value: string) =>
                changeTileCssVar(
                  getSelectedManagerId(),
                  getSelectedTileId(),
                  '--tileHorPos',
                  value
                ),
              label: 'Horizontal Position:'
            })
            .addCondition(
              derived(globalTiles, (_) =>
                ((h) => parseInt(h) < 100 || h === 'max-content')(
                  getTileCssVar(getSelectedManagerId(), getSelectedTileId(), '--tileWidth') ?? '100'
                )
              )
            )
        )
        .appendElement(
          createNewElement()
            .setType('range')
            .withOptions({
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
                      getTileCssVar(getSelectedManagerId(), getSelectedTileId(), '--tileHeight') ??
                        '100'
                    ),
              label: 'Tile Height:'
            })
        )
        .appendElement(
          createNewElement()
            .setType('select')
            .withOptions({
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
                changeTileCssVar(
                  getSelectedManagerId(),
                  getSelectedTileId(),
                  '--tileVerPos',
                  value
                ),
              label: 'Vertical Position:'
            })
            .addCondition(
              derived(globalTiles, (_) =>
                ((h) => parseInt(h) < 100 || h === 'max-content')(
                  getTileCssVar(getSelectedManagerId(), getSelectedTileId(), '--tileHeight') ??
                    '100'
                )
              )
            )
        )
        .appendElement(
          createNewElement()
            .setType('checkbox')
            .withOptions({
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
            })
            .addCondition(
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
        )
        .appendElement(
          createNewElement()
            .setType('checkbox')
            .withOptions({
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
            })
            .addCondition(
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
        )
        .appendElement(
          createNewElement()
            .setType('range')
            .withOptions({
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
                  getTileCssVar(
                    getSelectedManagerId(),
                    getSelectedTileId(),
                    '--tileBorderRadius'
                  ) ?? '0.5'
                ),
              label: 'Border Radius:'
            })
            .addCondition(
              derived(globalTiles, (_) => {
                const managerId = getSelectedManagerId();
                const tileId = getSelectedTileId();

                if (managerId != null && tileId != null) {
                  const tile = getTile(managerId, tileId);
                  if (tile) {
                    return (
                      tileMetadata[tile.widgetType].cssVars?.includes('--tileBorderRadius') ?? false
                    );
                  }
                }

                return false;
              })
            )
        )
    })
  );
