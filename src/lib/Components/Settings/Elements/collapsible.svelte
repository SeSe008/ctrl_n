<script lang="ts">
  import type { Options } from '$lib/types/settings/elements/collapsible';
  import Icon from '@iconify/svelte';
  import Group from './group.svelte';

  interface Props {
    options: Options;
  }

  const { options }: Props = $props();
  let { collapsed, title, collapseIcon, expandIcon, background, border } = options;

  let contentCollapsed = $state(collapsed ?? true);
</script>

<div
  class="collapsible {contentCollapsed ? 'collapsed' : 'open'}"
  style="
         --background: {background ? 'rgb(var(--c1))' : 'transparent'};
         --border: {border ? '1px solid rgb(var(--c2))' : 'transparent'};
         --padding: {border ? '0.5em' : 0};"
>
  <button
    type="button"
    class="collapsible_header"
    aria-expanded={!contentCollapsed}
    onclick={() => (contentCollapsed = !contentCollapsed)}
  >
    <span class="collapsible_title">{title}</span>
    <span class="collapsible_icon">
      {#if contentCollapsed}
        <Icon icon={collapseIcon ?? 'mdi:plus-circle-outline'} />
      {:else}
        <Icon icon={expandIcon ?? 'mdi:minus-circle-outline'} />
      {/if}
    </span>
  </button>
  <div class="collapsible_content">
    <Group
      options={{
        ...options,
        background: false,
        border: false
      }}
    />
  </div>
</div>

<style>
  .collapsible {
    display: flex;
    flex-direction: column;
    width: 100%;

    background: var(--background);
    border: var(--border);
    padding: var(--padding);
    border-radius: 0.5em;

    background-color: rgb(var(--c1));
    border: 2px solid rgb(var(--c2));

    box-sizing: border-box;
    overflow: hidden;
  }

  .collapsible_header {
    all: unset;

    display: flex;
    align-items: center;
    justify-content: space-between;

    box-sizing: border-box;
    padding: 0.25rem 0.5rem;

    cursor: pointer;

    transition: background-color 0.1s ease-in-out;
  }

  .collapsible.open .collapsible_header {
    border-bottom: 2px solid rgb(var(--c2));
  }

  .collapsible_header:hover {
    background-color: rgba(var(--c2), 0.5);
  }

  .collapsible_icon {
    display: flex;
    align-items: center;

    font-size: 1.5em;
  }

  .collapsible_content {
    padding: 0.5em;
    box-sizing: border-box;
  }

  .collapsible.collapsed .collapsible_content {
    display: none;
  }

  .collapsible.open .collapsible_content {
    display: block;
  }
</style>
