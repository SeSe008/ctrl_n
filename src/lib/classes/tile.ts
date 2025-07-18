import { tileMetadata } from '$lib/constants/tileMetadata';

export class StoreGlobalTiles {
  #managers: Array<StoreManager>;
  #cssVars: Record<string, string>;

  constructor(managers?: Array<StoreManager>, cssVars?: Record<string, string>) {
    this.#managers = managers ?? [];
    this.#cssVars = cssVars ?? {};
    return this;
  }

  get managers(): Array<StoreManager> {
    return this.#managers;
  }

  set managers(value: Array<StoreManager>) {
    this.#managers = value;
  }

  get cssVars(): Record<string, string> {
    return this.#cssVars;
  }

  set cssVars(value: Record<string, string>) {
    this.#cssVars = value;
  }

  getManager(idx: number): StoreManager | undefined {
    if (idx >= 0 && idx < this.#managers.length) {
      return this.#managers[idx];
    }
    return undefined;
  }

  addManager(manager?: StoreManager): StoreGlobalTiles {
    this.#managers.push(manager ?? new StoreManager());
    return this;
  }

  removeManager(idx: number): StoreGlobalTiles {
    if (idx >= 0 && idx < this.#managers.length) {
      this.#managers.splice(idx, 1);
    }
    return this;
  }

  setCssVars(cssVars: Record<string, string>): StoreGlobalTiles {
    this.#cssVars = cssVars;
    return this;
  }

  changeCssVar(name: string, value: string): StoreGlobalTiles {
    this.#cssVars[name] = value;
    return this;
  }

  deleteCssVar(name: string): StoreGlobalTiles {
    delete this.#cssVars[name];
    return this;
  }

  fromJSON(json: Record<string, any>): StoreGlobalTiles {
    if (json.managers) {
      this.#managers = json.managers.map((mgr: Record<string, any>) =>
        new StoreManager().fromJSON(mgr)
      );
    }
    this.#cssVars = json.cssVars ?? {};
    return this;
  }

  toJSON(): Record<string, any> {
    return {
      managers: this.#managers.map((mgr) => mgr.toJSON()),
      cssVars: this.#cssVars
    };
  }
}

export class StoreManager {
  #tiles: Array<StoreTile>;
  #managerHeight: number;

  constructor(tiles?: Array<StoreTile>, managerHeight?: number) {
    this.#tiles = tiles ?? [];
    this.#managerHeight = managerHeight ?? 1;
    return this;
  }

  get tiles(): Array<StoreTile> {
    return this.#tiles;
  }

  set tiles(value: Array<StoreTile>) {
    this.#tiles = value;
  }

  get managerHeight(): number {
    return this.#managerHeight;
  }

  set managerHeight(value: number) {
    this.#managerHeight = value;
  }

  getTile(idx: number): StoreTile | undefined {
    if (idx >= 0 && idx < this.#tiles.length) {
      return this.#tiles[idx];
    }
    return undefined;
  }

  addTile(tile?: StoreTile): StoreManager {
    this.#tiles.push(tile ?? new StoreTile());
    return this;
  }

  removeTile(index: number): StoreManager {
    if (index >= 0 && index < this.#tiles.length) {
      this.#tiles.splice(index, 1);
    }
    return this;
  }

  changeHeight(height: number): StoreManager {
    this.#managerHeight = height;
    return this;
  }

  fromJSON(json: Record<string, any>): StoreManager {
    if (json.tiles) {
      this.#tiles = json.tiles.map((tile: Record<string, any>) => new StoreTile().fromJSON(tile));
    }
    this.#managerHeight = json.managerHeight ?? 1;
    return this;
  }

  toJSON(): Record<string, any> {
    return {
      tiles: this.#tiles.map((tile) => tile.toJSON()),
      managerHeight: this.#managerHeight
    };
  }
}

export class StoreTile {
  #widgetType: number;
  #widgetOptions: Record<string, any>;
  #cssVars: Record<string, string>;

  constructor(
    widgetType?: number,
    widgetOptions?: Record<string, any>,
    cssVars?: Record<string, string>
  ) {
    this.#widgetType = widgetType ?? 0;
    this.#widgetOptions = widgetOptions ?? {};
    this.#cssVars = cssVars ?? {};
    return this;
  }

  get widgetType(): number {
    return this.#widgetType;
  }

  set widgetType(value: number) {
    this.#widgetType = value;
  }

  get widgetOptions(): Record<string, any> {
    return this.#widgetOptions;
  }

  set widgetOptions(value: Record<string, any>) {
    this.#widgetOptions = value;
  }

  get cssVars(): Record<string, string> {
    return this.#cssVars;
  }

  set cssVars(value: Record<string, string>) {
    this.#cssVars = value;
  }

  setType(widgetType: number): StoreTile {
    if (tileMetadata[widgetType]) this.#widgetType = widgetType;
    return this;
  }

  setWidgetOptions(widgetOptions: Record<string, any>): StoreTile {
    this.#widgetOptions = widgetOptions;
    return this;
  }

  deleteWidgetOption(name: string): StoreTile {
    delete this.#widgetOptions[name];
    return this;
  }

  getWidgetOption(name: string): any | undefined {
    return this.#widgetOptions[name];
  }

  addWidgetOption(name: string, value: any): StoreTile {
    this.#widgetOptions[name] = value;
    return this;
  }

  setCssVars(cssVars: Record<string, string>): StoreTile {
    this.#cssVars = cssVars;
    return this;
  }

  addCssVar(name: string, value: string): StoreTile {
    this.#cssVars[name] = value;
    return this;
  }

  deleteCssVar(name: string): StoreTile {
    delete this.#cssVars[name];
    return this;
  }

  getCssVar(name: string): string | undefined {
    return this.#cssVars[name];
  }

  fromJSON(json: Record<string, any>): StoreTile {
    this.#widgetType = json.widgetType ?? 0;
    this.#widgetOptions = json.widgetOptions ?? {};
    this.#cssVars = json.cssVars ?? {};
    return this;
  }

  toJSON(): Record<string, any> {
    return {
      widgetType: this.#widgetType,
      widgetOptions: this.#widgetOptions,
      cssVars: this.#cssVars
    };
  }
}
