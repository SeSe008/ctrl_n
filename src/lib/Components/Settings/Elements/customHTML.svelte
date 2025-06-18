<script lang="ts">
  import type { Options } from "$lib/types/settings/elements/customHTML";
  import DOMPurify from "dompurify";
  import { onDestroy, onMount } from "svelte";
  
  interface Props {
    options: Options;
  }

  const { options }: Props = $props();
  const { html, css, updater } = options;
  
  function getValue(value: string | (() => string)) : string {
    return DOMPurify.sanitize((typeof value === 'function') ? value() : value);
  }
  
  let customHTML = $state<string>(getValue(html));
  let customCSS = $state<string|undefined>((css) ? getValue(css) : undefined);

  let customContent = $state<string>();
  $effect(() => { customContent = `<style>${customCSS}</style>${customHTML}` });

  let unsubscribes: Array<() => void> = [];
  onMount(() => {
    if (updater) {
      const updaters = Array.isArray(updater) ? updater : [updater];

      unsubscribes = updaters.map((u) =>
        u.subscribe(async () => {
          customHTML = getValue(html);
	  if (css) customCSS = getValue(css);
        })
      );
    }
  });

  onDestroy(() => {
    unsubscribes?.forEach((unsub) => unsub());
  });
</script>

<!-- eslint-disable-next-line svelte/no-at-html-tags -->
<div class="settings_customHTML">{@html customContent}</div>

<style>
  .settings_customHTML {
    max-width: 100%;
    overflow: hidden;
  }
</style>
