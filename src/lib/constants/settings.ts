import type { ElementComponents } from '$lib/types/settings/settings';

import Text from '$lib/Components/Settings/Elements/text.svelte';
import Icon from '$lib/Components/Settings/Elements/icon.svelte';
import Select from '$lib/Components/Settings/Elements/select.svelte';
import Button from '$lib/Components/Settings/Elements/button.svelte';
import Range from '$lib/Components/Settings/Elements/range.svelte';
import TextInput from '$lib/Components/Settings/Elements/textInput.svelte';
import ColorInput from '$lib/Components/Settings/Elements/colorInput.svelte';
import Checkbox from '$lib/Components/Settings/Elements/checkbox.svelte';
import Image from '$lib/Components/Settings/Elements/image.svelte';
import Group from '$lib/Components/Settings/Elements/group.svelte';
import Collapsible from '$lib/Components/Settings/Elements/collapsible.svelte';
import Grid from '$lib/Components/Settings/Elements/grid.svelte';
import CustomHTML from '$lib/Components/Settings/Elements/customHTML.svelte';

export const elementComponents: ElementComponents = {
  text: Text,
  icon: Icon,
  select: Select,
  button: Button,
  range: Range,
  textInput: TextInput,
  colorInput: ColorInput,
  checkbox: Checkbox,
  image: Image,
  group: Group,
  collapsible: Collapsible,
  grid: Grid,
  customHTML: CustomHTML
};
