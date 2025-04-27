<script lang="ts">
  import Icon from '@iconify/svelte';
  import { onMount } from 'svelte';

  import { editMode } from '$lib/stores/editMode';
 
  function getTime() {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  let time: string = getTime();

  setInterval(() => {
    time = getTime();
  }, 1000);

  let clockType: number;
  const clockTypeAmount: number = 2;
  
  function nextType() {
    clockType = (clockType + 1) % clockTypeAmount;
    window.localStorage.setItem('clockType', clockType.toString());
  }

  function lastType() {
    clockType = (clockType <= 0) ? clockTypeAmount - 1 : clockType - 1;
    window.localStorage.setItem('clockType', clockType.toString());
  }

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

  $: if (clockType === 1) initAnalog();
  
  onMount(() => {
    const stored = localStorage.getItem('clockType');
    clockType = stored && !isNaN(+stored) ? +stored : 0;

    if (clockType === 1) initAnalog();
  });
</script>


<div bind:this={clock} id="clock">
  {#if clockType === 0}
    <h1>
      {time}
    </h1>
  {:else if clockType === 1}
    <div id="analog">
      <div id="hand_hour"></div>
      <div id="hand_minute"></div>
      <div id="hand_second"></div>
      <div id="center"></div>
    </div>
  {/if}

  {#if $editMode}
    <div id="inputs">
      <button on:click={lastType}><Icon icon="icon-park-outline:left-c" /></button>
      <button on:click={nextType}><Icon icon="icon-park-outline:right-c" /></button>
    </div>
  {/if}
</div>

<style>
  #clock {
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-sizing: border-box;
    align-items: center;
    gap: .25rem;
    justify-content: center;
  }
  
  /* Digital Clock */
  h1 {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: min-content;
    font-size: calc(24px + 4vmin);
    color: rgb(var(--c1));
    background-color: rgb(var(--c2));
    padding: 1rem;
    margin: 0;
    border-radius: .5rem;
    border: 1px solid rgb(var(--c1));
    font-variant-numeric: tabular-nums;
    font-family: Roboto !important;
  }


  /* Analog clock */
  @property --hour {
    syntax: "<number>";
    inherits: true;
    initial-value: 0;
  }

  @property --minute {
    syntax: "<number>";
    inherits: true;
    initial-value: 0;
  }

  @property --second {
    syntax: "<number>";
    inherits: true;
    initial-value: 0;
  }
  
  #analog {
    position: relative;
    height: 100%;
    background-color: rgb(var(--c2));
    justify-self: stretch;
    aspect-ratio: 1 / 1;
    border-radius: 50%;
    clip-path: polygon(
      50.00% 0.00%,
      61.65% 6.53%,
      75.00% 6.70%,
      81.82% 18.18%,
      93.30% 25.00%,
      93.47% 38.35%,
      100.00% 50.00%,
      93.47% 61.65%,
      93.30% 75.00%,
      81.82% 81.82%,
      75.00% 93.30%,
      61.65% 93.47%,
      50.00% 100.00%,
      38.35% 93.47%,
      25.00% 93.30%,
      18.18% 81.82%,
      6.70% 75.00%,
      6.53% 61.65%,
      0.00% 50.00%,
      6.53% 38.35%,
      6.70% 25.00%,
      18.18% 18.18%,
      25.00% 6.70%,
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
    content: "";
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
    content: "";
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
    content: "";
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

  #inputs {
    display: flex;
    flex-direction: row;
    gap: .25rem;
  }

  #inputs button {
    outline: none;
    justify-self: flex-start;
    font-size: .8rem;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: .125rem;
    border-radius: .3rem;
    border: 1px solid rgb(var(--c2));
    background-color: rgb(var(--c1));
    color: rgb(var(--c2));
    cursor: pointer;
  }
</style>
