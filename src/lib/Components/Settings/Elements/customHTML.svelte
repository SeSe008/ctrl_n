<script lang="ts">
  import type { Options } from '$lib/types/settings/elements/customHTML';
  import DOMPurify from 'dompurify';

  interface Props {
    options: Options;
  }

  const { options }: Props = $props();
  const { html, css } = options;

  function getValue(value: string | (() => string)): string {
    return DOMPurify.sanitize(typeof value === 'function' ? value() : value);
  }

  let customHTML = $state<string>(getValue(html));
  let customCSS = $state<string | undefined>(css ? getValue(css) : undefined);

  let customContent = $state<string>();

  $effect(() => {
    customContent = `<style>${customCSS}</style>${customHTML}`;
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
