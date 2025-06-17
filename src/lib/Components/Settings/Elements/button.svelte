<script lang="ts">
  import Icon from '@iconify/svelte';
  import type { Options } from '$lib/types/settings/elements/button';

  interface Props {
    options: Options;
  }

  const { options }: Props = $props();
  const { text, icon, onClick } = options;
</script>

<div class="settings_button">
  <button onclick={() => onClick()}>
    {#if icon}
      <Icon icon={icon} />
    {/if}
    {text}
  </button>
</div>

<style>
  .settings_button {
    display: flex;
    width: 100%;
    gap: 0.5rem;
    flex-wrap: wrap;
    align-items: center;
  }

  button {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }
</style>
