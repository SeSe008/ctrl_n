import type { Element, ElementComponents } from '$lib/types/settings/settings';

import { derived, get } from 'svelte/store';
import { addTile, removeTile, changeManagerHeight, changeTile, globalTiles } from '$lib/stores/tiles';
import { settings } from '$lib/stores/settings/settings';
import { tileMetadata } from '$lib/constants/tileMetadata';

import Text from '$lib/Components/Settings/Elements/text.svelte';
import Select from '$lib/Components/Settings/Elements/select.svelte';
import Buttons from '$lib/Components/Settings/Elements/buttons.svelte';
import Range from '$lib/Components/Settings/Elements/range.svelte';
import TextInput from '$lib/Components/Settings/Elements/textInput.svelte';
import Group from '$lib/Components/Settings/Elements/group.svelte';

export const elementComponents: ElementComponents = {
  text: Text,
  select: Select,
  buttons: Buttons,
  range: Range,
  textInput: TextInput,
  group: Group,
};

export const tileSettings: Element[] = [
  {
    elementType: 'text',
    elementOptions: {
      text: 'Tile Settings',
      classes: ['large', 'center', 'strong']
    }
  },
  {
    elementType: 'select',
    elementOptions: {
      selectOptions: tileMetadata.map(({ label, icon }) => { return { label, icon }; }),	
      onChange: (value: number) => changeTile(get(settings).selectedManager, get(settings).selectedTile, value),
      defaultValue: derived(
	[ globalTiles, settings ],
	( [ $globalTiles, $settings ] ) => {
	  const mgr = $settings.selectedManager;
	  const tle = $settings.selectedTile;
	  return mgr !== undefined && tle !== undefined ? $globalTiles[mgr].tiles[tle].element : 0;
	}
      ),
      label: 'Widget Type:'
    }
  }
];

export const tileManagerSettings: Element[] = [
  {
    elementType: 'text',
    elementOptions: {
      text: 'Row Settings',
      classes: ['large', 'center', 'strong', 'margin_vert']
    }
  },
  {
    elementType: 'buttons',
    elementOptions: {
      buttons: [
	{
	  text: 'Add Element',
	  icon: 'gg:add',
	  onClick: () => addTile((get(settings)).selectedManager)
	},
	{
	  text: 'Remove Element',
	  icon: 'gg:remove',
	  onClick: () => removeTile((get(settings)).selectedManager)
	}
      ]
    }
  },
    {
    elementType: 'text',
    elementOptions: {
      text: 'Row-Height:',
      classes: ['medium', 'left', 'margin_vert']
      }
  },
  {
    elementType: 'range',
    elementOptions: {
      min: 0,
      max: 5,
      step: 0.1,
      onInput: (value: number) => {
	changeManagerHeight((get(settings)).selectedManager, value);
      },
      defaultValue: derived(
	[ globalTiles, settings ],
	( [ $globalTiles, $settings ] ) => {
	  const mgr = $settings.selectedManager;
	  return mgr !== undefined ? $globalTiles[mgr].height : 0;
	}
      ),
      specialValues: {
	0: 'Fit-Content'
      },
      valueLabel: 'Preferred height:',
      unit: 'fr'
      }
  },
  {
    elementType: 'buttons',
    elementOptions: {
      buttons: [
	{
	  onClick: () => {
	    changeManagerHeight((get(settings)).selectedManager, 1);
	  },
	  text: 'Reset Height'
	}
      ]
    }
  }
];
