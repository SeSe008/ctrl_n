<script lang="ts">
  import { getTile, globalTiles } from '$lib/stores/tiles';
  import { tileDefs } from '$lib/constants/tileDefs';
  import { settings } from '$lib/stores/settings/settings';

  interface Props {
    managerId: number;
    tileId: number;
  }

  let { managerId, tileId }: Props = $props();

  function applyVars(node: HTMLElement, vars: Record<string, string> | undefined) {
    if (!vars) return;

    for (const [key, value] of Object.entries(vars)) {
      node.style.setProperty(key, value);
    }
    return {
      update(newVars: Record<string, string>) {
        for (const [key, value] of Object.entries(newVars)) {
          node.style.setProperty(key, value);
        }
      }
    };
  }
</script>

{#key JSON.stringify($globalTiles[managerId]?.tiles[tileId])}
  {@const tile = getTile(managerId, tileId)}
  {#if tile}
    <div
      use:applyVars={tile.cssVars}
      class="tile_element {$settings.enabled &&
      $settings.selectedManager === managerId &&
      $settings.selectedTile === tileId
        ? 'settings_selected_tile'
        : ''}"
      id="tile_element_{managerId}{tileId}"
    >
      {#if tileDefs[tile.element]}
        {@const SelectedComponent = tileDefs[tile.element].component}
        <SelectedComponent />
      {:else}
        <div id="spacer"></div>
      {/if}
    </div>
  {/if}
{/key}

<style>
  .tile_element {
    position: relative;
    display: grid;
    grid-template-rows: minmax(0, 1fr) auto;
    box-sizing: border-box;

    width: var(--tileWidth);
    justify-self: var(--tileHorPos);

    height: var(--tileHeight);
    align-self: var(--tileVerPos);

    overflow: hidden;
  }

  .settings_selected_tile {
    border: 2px dotted white;
  }

  #inputs {
    justify-self: center;
    display: flex;
    flex-direction: row;
    margin: 0.25rem;
    height: 2rem;
  }
</style>
