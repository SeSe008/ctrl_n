<script lang="ts">
  import type { Options } from '$lib/types/settings/elements/textInput';
  import { get } from 'svelte/store';

  interface Props {
    options: Options;
  }
  
  const { options }: Props = $props();
  const { placeholder, store, onInput, defaultValue, label } = options;

  let textValue: string = $state($defaultValue !== undefined ? get($defaultValue) : '');

  $effect(() => {
    if (store) store.update(() => textValue);
  });
</script>

<div class="settings_text_input">
  {label}
  <input type="text" placeholder={placeholder} bind:value={textValue} oninput={() => onInput??(textValue)} />
</div>

<style>
  .settings_text_input {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    gap: .5rem;
    width: max-content;
  }
</style>
