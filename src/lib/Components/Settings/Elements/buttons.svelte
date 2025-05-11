<script lang="ts">
  import Icon from '@iconify/svelte';
  import type { Options } from '$lib/types/settings/buttons';

  interface Props {
    options: Options;
  }

  const { options }: Props = $props();
  const { buttons, label } = options;
</script>

<div class="settings_button">
  {label}
  <div class="buttons">
    {#each buttons as button, i (i)}
      <button onclick={() => button.onClick(button.value || i)}>
	{#if button.icon}
	  <Icon icon={button.icon} />
	{/if}
	{button.text}
      </button>
    {/each}
  </div>
</div>

<style>
  .settings_button {
    display: flex;
    width: 100%;
    gap: .5rem;
    flex-wrap: wrap;
    align-items: center;
  }

  .buttons {
    display: flex;
    gap: .5rem;
  }

  button {
    display: flex;
    align-items: center;
    gap: .25rem;
  }
</style>
