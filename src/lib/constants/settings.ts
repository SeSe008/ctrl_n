import type { ElementComponents } from '$lib/types/settings';

import Text from '$lib/Components/Settings/Elements/text.svelte';
import Select from '$lib/Components/Settings/Elements/select.svelte';

export const elementComponents: ElementComponents = {
  text: Text,
  select: Select,
};
