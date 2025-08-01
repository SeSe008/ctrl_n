<script lang="ts">
  import { getTileWidgetOptions } from '$lib/stores/tiles';
  import type { TileProps } from '$lib/types/tiles';
  import { onMount } from 'svelte';

  const { tileId, managerId }: TileProps = $props();
  const options = getTileWidgetOptions(managerId, tileId);

  let clockType: string = $state('digital');
  
  if (options && typeof options.clockType === 'string') {
    clockType = options.clockType;
  }

  function getTime() {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  let time = $state<string>(getTime());

  setInterval(() => {
    time = getTime();
  }, 1000);

  let clock: HTMLDivElement;

  function initAnalog() {
    const date: Date = new Date();

    if (clock) {
      const hour: number = date.getHours() % 12;
      const minute: number = date.getMinutes();
      const second: number = date.getSeconds();

      clock.style.setProperty('--hour', (hour + minute / 60).toString());
      clock.style.setProperty('--minute', (minute + second / 60).toString());
      clock.style.setProperty('--second', second.toString());
    }
  }

  onMount(() => {
    if (clockType === 'analog') {
      initAnalog();
    }
  });
</script>

<div bind:this={clock} id="clock">
  {#if clockType === 'digital'}
    <h1>
      {time}
    </h1>
  {:else if clockType === 'analog'}
    <div id="analog">
      <div id="hand_hour"></div>
      <div id="hand_minute"></div>
      <div id="hand_second"></div>
      <div id="center"></div>
    </div>
  {/if}
</div>

<style>
  #clock {
    height: 100%;
    display: flex;

    overflow: hidden;
    box-sizing: border-box;
  }

  /* Digital Clock */
  h1 {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    height: 100%;

    color: var(--clockFgClr, rgb(var(--c5)));
    background-color: var(--clockBgClr, rgba(var(--c1), var(--o1)));
    mix-blend-mode: var(--clockBlMode, normal);

    --txtBrdSize: calc(var(--textBorderSize) * 1px);
    --txtBrdSizeInv: calc(var(--txtBrdSize) * -1);
    --txtBrdClr: var(--textBorderColor, rgb(var(--c1)));

    box-sizing: border-box;
    padding: 1rem;
    margin: 0;

    border: var(--tileBorder, 1px solid rgb(var(--c2)));
    border-radius: var(--tileBorderRadius);

    font-variant-numeric: tabular-nums;
    font-family: Roboto !important;
    font-size: var(--clockFontSize, xxx-large);
    font-style: var(--clockFontStyle, normal);
    font-weight: var(--clockFontWeight, bold);
  }

  @supports (-webkit-text-stroke: 1px currentColor) {
    h1 {
      -webkit-text-stroke: var(--txtBrdSize) var(--txtBrdClr);
    }
  }

  @supports not (-webkit-text-stroke: 1px currentColor) {
    h1 {
      text-shadow:
        var(--txtBrdSizeInv) var(--txtBrdSizeInv) 0 var(--txtBrdClr),
        var(--txtBrdSize) var(--txtBrdSizeInv) 0 var(--txtBrdClr),
        var(--txtBrdSizeInv) var(--txtBrdSize) 0 var(--txtBrdClr),
        var(--txtBrdSize) var(--txtBrdSize) 0 var(--txtBrdClr);
    }
  }

  /* Analog clock */
  @property --hour {
    syntax: '<number>';
    inherits: true;
    initial-value: 0;
  }

  @property --minute {
    syntax: '<number>';
    inherits: true;
    initial-value: 0;
  }

  @property --second {
    syntax: '<number>';
    inherits: true;
    initial-value: 0;
  }

  #analog {
    position: relative;

    height: 100%;
    aspect-ratio: 1 / 1;

    background-color: rgba(var(--c2), var(--o1));

    clip-path: polygon(
      50% 0%,
      61.65% 6.53%,
      75% 6.7%,
      81.82% 18.18%,
      93.3% 25%,
      93.47% 38.35%,
      100% 50%,
      93.47% 61.65%,
      93.3% 75%,
      81.82% 81.82%,
      75% 93.3%,
      61.65% 93.47%,
      50% 100%,
      38.35% 93.47%,
      25% 93.3%,
      18.18% 81.82%,
      6.7% 75%,
      6.53% 61.65%,
      0% 50%,
      6.53% 38.35%,
      6.7% 25%,
      18.18% 18.18%,
      25% 6.7%,
      38.35% 6.53%
    );
  }

  #analog > * {
    position: absolute;
    transform: translate(-50%, -50%);
    inset: 50%;
  }

  #center {
    height: 15%;
    width: 15%;
    background-color: rgb(var(--c1));
    border-radius: 50%;
  }

  #hand_hour {
    width: 6%;
    height: 60%;
    transform: translate(-50%, -50%) rotate(calc(var(--hour) * 30deg));
    animation: spin-hour 43200s linear infinite;
  }

  #hand_hour::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 50%;
    background-color: rgb(var(--c3));
    border-radius: 1.5vw;
  }

  @keyframes spin-hour {
    from {
      transform: translate(-50%, -50%) rotate(calc(var(--hour) * 30deg));
    }
    to {
      transform: translate(-50%, -50%) rotate(calc(var(--hour) * 30deg + 360deg));
    }
  }

  #hand_minute {
    width: 5%;
    height: 75%;
    transform: translate(-50%, -50%) rotate(calc(var(--minute) * 6deg));
    animation: spin-minute 3600s linear infinite;
  }

  #hand_minute::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 50%;
    background-color: rgb(var(--c4));
    border-radius: 1.5vw;
  }

  @keyframes spin-minute {
    from {
      transform: translate(-50%, -50%) rotate(calc(var(--minute) * 6deg));
    }
    to {
      transform: translate(-50%, -50%) rotate(calc(var(--minute) * 6deg + 360deg));
    }
  }

  #hand_second {
    width: 2%;
    height: 75%;
    transform: translate(-50%, -50%) rotate(calc(var(--second) * 6deg));
    animation: spin-second 60s linear infinite;
  }

  #hand_second::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 50%;
    background-color: rgb(var(--c5));
  }

  @keyframes spin-second {
    from {
      transform: translate(-50%, -50%) rotate(calc(var(--second) * 6deg));
    }
    to {
      transform: translate(-50%, -50%) rotate(calc(var(--second) * 6deg + 360deg));
    }
  }
</style>
