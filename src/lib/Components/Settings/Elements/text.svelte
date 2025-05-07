<script lang="ts">
  export interface Options {
    text: string;
    classes: string[];
  }

  interface Props {
    options: Options;
  }
  
  const { options }: Props = $props();
</script>

<div class={`settings_text ${options.classes.join(" ")}`}>
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
    font-size: .75em;
  }

  .margin_vert {
    margin: 1rem 0;
  }
</style>
