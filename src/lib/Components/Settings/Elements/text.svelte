<script lang="ts">
  import type { Options } from '$lib/types/settings/elements/text';

  interface Props {
    options: Options;
  }

  const { options }: Props = $props();
</script>

<div class={`settings_text ${options.classes?.join(' ')}`}>
  {options.text}
</div>

<style>
  div {
    color: inherit;
  }

  .center {
    text-align: center;
  }

  .left {
    text-align: left;
  }

  .right {
    text-align: right;
  }

  .block {
    text-align: justify;
  }

  .strong {
    font-weight: bold;
  }

  .italic {
    font-style: italic;
  }

  .large {
    font-size: 2em;
  }

  .big {
    font-size: 1.5em;
  }

  .medium {
    font-size: 1.125em;
  }

  .small {
    font-size: 0.75em;
  }

  .margin_vert {
    margin: 1rem 0;
  }

  .margin_top {
    margin-top: 1rem;
  }

  .margin_bottom {
    margin-bottom: 1rem;
  }
</style>
