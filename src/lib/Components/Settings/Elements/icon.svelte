<script lang="ts">
  import type { Options } from "$lib/types/settings/elements/icon";
  import Icon from "@iconify/svelte";

  interface Props {
    options: Options;
  }

  const { options }: Props = $props();
  const { icon, size, color } = options;
</script>

<div class="icon" style="font-size: {size}; color: {color}">
  <Icon icon={icon} />
</div>

<style>
  .icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }
</style>
