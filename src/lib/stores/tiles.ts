import { writable, get } from 'svelte/store';

import { StoreGlobalTiles, StoreManager, StoreTile } from '$lib/classes/tile';

export const globalTiles = writable<StoreGlobalTiles>(new StoreGlobalTiles());

export function getTiles(): StoreGlobalTiles {
  return get(globalTiles);
}

export function setTiles(tiles: StoreGlobalTiles) {
  globalTiles.set(tiles);
}

export const changeGlobalCssVar = (name: string, value: string) =>
  globalTiles.update((gTiles) => gTiles.changeCssVar(name, value));

export const deleteGlobalCssVar = (name: string) =>
  globalTiles.update((gTiles) => gTiles.deleteCssVar(name));

export const getGlobalCssVar = (name: string): string | undefined => get(globalTiles).cssVars[name];

export const resetGlobalCssVars = () => globalTiles.update((gTiles) => gTiles.setCssVars({}));

export const getManagers = (): Array<StoreManager> => get(globalTiles).managers;

export const getManager = (idx: number): StoreManager | undefined =>
  get(globalTiles).getManager(idx);

export const addManager = (manager?: StoreManager) =>
  globalTiles.update((gTiles) => gTiles.addManager(manager));

export const removeManager = (idx: number) =>
  globalTiles.update((gTiles) => gTiles.removeManager(idx));

export const changeManagerHeight = (idx: number, height: number) =>
  globalTiles.update((gTiles) => {
    gTiles.getManager(idx)?.changeHeight(height);
    return gTiles;
  });

export const addTile = (mgrIdx: number, tile?: StoreTile) =>
  globalTiles.update((gTiles) => {
    gTiles.getManager(mgrIdx)?.addTile(tile);
    return gTiles;
  });

export const removeTile = (mgrIdx: number, tleIdx: number) =>
  globalTiles.update((gTiles) => {
    gTiles.getManager(mgrIdx)?.removeTile(tleIdx);
    return gTiles;
  });

export const getTile = (mgrIdx: number, tleIdx: number): StoreTile | undefined =>
  get(globalTiles).getManager(mgrIdx)?.getTile(tleIdx);

export const setTileWidgetType = (mgrIdx: number, tleIdx: number, widgetType: number) =>
  globalTiles.update((gTiles) => {
    gTiles.getManager(mgrIdx)?.getTile(tleIdx)?.setType(widgetType);
    return gTiles;
  });

export const setTileWidgetOptions = (
  mgrIdx: number,
  tleIdx: number,
  widgetOptions: Record<string, any>
) =>
  globalTiles.update((gTiles) => {
    gTiles.getManager(mgrIdx)?.getTile(tleIdx)?.setWidgetOptions(widgetOptions);
    return gTiles;
  });

export const getTileWidgetOptions = (
  mgrIdx: number,
  tleIdx: number
): Record<string, any> | undefined =>
  get(globalTiles).getManager(mgrIdx)?.getTile(tleIdx)?.widgetOptions;

export const addTileWidgetOption = (mgrIdx: number, tleIdx: number, name: string, value: any) =>
  globalTiles.update((gTiles) => {
    gTiles.getManager(mgrIdx)?.getTile(tleIdx)?.addWidgetOption(name, value);
    return gTiles;
  });

export const changeTileWidgetOption = addTileWidgetOption;

export const getTileWidgetOption = (
  mgrIdx: number,
  tleIdx: number,
  name: string
): any | undefined => getTiles().getManager(mgrIdx)?.getTile(tleIdx)?.getWidgetOption(name);

export const deleteTileWidgetOption = (mgrIdx: number, tleIdx: number, name: string) =>
  globalTiles.update((gTiles) => {
    gTiles.getManager(mgrIdx)?.getTile(tleIdx)?.deleteWidgetOption(name);
    return gTiles;
  });

export function resetTileWidgetOptions(mgrIdx: number, tleIdx: number) {
  globalTiles.update((gTiles) => {
    gTiles.getManager(mgrIdx)?.getTile(tleIdx)?.setWidgetOptions({});
    return gTiles;
  });
}

export const addTileCssVar = (mgrIdx: number, tleIdx: number, name: string, value: string) =>
  globalTiles.update((gTiles) => {
    gTiles.getManager(mgrIdx)?.getTile(tleIdx)?.addCssVar(name, value);
    return gTiles;
  });

export const changeTileCssVar = addTileCssVar;

export const deleteTileCssVar = (mgrIdx: number, tleIdx: number, name: string) =>
  globalTiles.update((gTiles) => {
    gTiles.getManager(mgrIdx)?.getTile(tleIdx)?.deleteCssVar(name);
    return gTiles;
  });

export const resetTileCssVars = (mgrIdx: number, tleIdx: number) =>
  globalTiles.update((gTiles) => {
    gTiles.getManager(mgrIdx)?.getTile(tleIdx)?.setCssVars({});
    return gTiles;
  });

export const getTileCssVar = (mgrIdx: number, tleIdx: number, name: string): string | undefined =>
  get(globalTiles).getManager(mgrIdx)?.getTile(tleIdx)?.getCssVar(name);

export function initializeTiles() {
  const stored = window.localStorage.getItem('tiles') || '';

  try {
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed.managers) && parsed.cssVars) {
      globalTiles.set(new StoreGlobalTiles().fromJSON(parsed));
    }
  } catch {
    // Clock and search bar
    globalTiles.set(
      new StoreGlobalTiles()
        .addManager(
          new StoreManager().addTile(
            new StoreTile()
              .setType(2)
              .addCssVar('--tileWidth', 'max-content')
              .addCssVar('--tileHeight', 'max-content')
              .addCssVar('--tileVerPos', 'center')
              .addCssVar('--tileBorder', 'none')
              .addCssVar('--o1', '0')
              .addCssVar('--clockFontSize', '6rem')
          )
        )
        .addManager(new StoreManager().addTile(new StoreTile().setType(1)))
    );
  }
}
