import type { ElementComponents } from '$lib/types/settings';

import Text from '$lib/Components/Settings/Elements/text.svelte';
import Select from '$lib/Components/Settings/Elements/select.svelte';
import Buttons from '$lib/Components/Settings/Elements/buttons.svelte';
import Range from '$lib/Components/Settings/Elements/range.svelte';

export const elementComponents: ElementComponents = {
  text: Text,
  select: Select,
  buttons: Buttons,
  range: Range
};
