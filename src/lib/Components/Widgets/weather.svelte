<script lang="ts">
  import Icon from '@iconify/svelte';
  import {
    getWeatherLocation,
    initWeatherLoaction,
    weatherLocation
  } from '$lib/stores/widgets/weatherLocation';
  import { onMount } from 'svelte';
  import { settingsEnabled } from '$lib/stores/settings/settings';

  interface Weather {
    name: string;
    weather: Array<{
      description: string;
      icon: string;
    }>;
    main: {
      temp: number;
      feels_like: number;
      humidity: number;
    };
  }

  let weather = $state<Weather>();
  let error = $state<string>();

  async function fetchWeather(location: string) {
    const resp = await fetch('/api/weather', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ city: location })
    });

    if (resp.status !== 200) {
      error = (await resp.json()).error;
      return;
    }

    weather = await resp.json();
  }

  function capitalizeWords(sentence: string): string {
    return sentence
      .split(' ')
      .map((word) => (word.length > 0 ? word[0].toUpperCase() + word.slice(1).toLowerCase() : ''))
      .join(' ');
  }

  onMount(initWeatherLoaction);

  weatherLocation.subscribe((loc) => {
    if (loc) fetchWeather(loc);
  });
</script>

<div id="weather">
  {#if weather && weather.weather && !error}
    <div id="properties">
      <img
        alt="Weather Icon"
        src={`https://openweathermap.org/img/wn/${weather.weather[0]?.icon}@2x.png`}
      />
      <span id="location">{weather.name}</span>
      <div id="values">
        <span id="description">{capitalizeWords(weather.weather[0].description)}</span>
        <span class="value" id="temp">
          <Icon icon="mdi:temperature" />{weather.main.temp}°C ({weather.main.feels_like}°C)</span
        >
        <span class="value" id="humidity"><Icon icon="wi:humidity" />{weather.main.humidity}%</span>
        <button id="reload" onclick={() => fetchWeather(getWeatherLocation())}>
          <Icon icon="mdi:reload" />
        </button>
      </div>
    </div>
  {:else}
    <div class="info">
      {#if settingsEnabled()}
        Close Settings for Weather Info
      {:else if error}
        Could not load weather.<br />{error}
      {/if}
      <button id="reload" onclick={() => fetchWeather(getWeatherLocation())}>
        <Icon icon="mdi:reload" />
      </button>
    </div>
  {/if}
</div>

<style>
  #weather {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;

    height: 100%;
    width: 100%;

    overflow-y: auto;
    overflow-x: hidden;

    background-color: rgba(var(--c1), var(--o1));

    border: var(--tileBorder, 1px solid rgb(var(--c2)));
    border-radius: var(--tileBorderRadius);

    box-sizing: border-box;
    padding: 1rem;
  }

  #properties {
    display: grid;
    grid-template-rows: repeat(2, min-content);
    grid-template-columns: repeat(2, auto);
    gap: 0.25rem;

    width: max-content;
    color: rgb(var(--c5));
    max-width: 100%;
  }

  img {
    width: 100%;
    grid-row: 1;
    grid-column: 1;
    align-self: center;
    justify-self: center;
    margin: 0;
    border-radius: 1rem;
  }

  #location {
    grid-row: 2;
    grid-column: 1;
    align-self: center;
    justify-self: center;
    font-size: calc(8px + 1.25vmin);
  }

  #values {
    grid-row: 1 / 3;
    grid-column: 2;

    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: min-content repeat(2, 1fr);
  }

  #description {
    grid-column: 1 / 3;

    display: flex;
    align-items: center;
    justify-content: flex-start;
    font-size: calc(8px + 1.5vh);
    font-weight: bold;
  }

  #temp {
    grid-column: 1 / 3;
  }

  #temp,
  #humidity {
    display: flex;
    align-self: center;
    align-items: center;
    justify-content: flex-start;
    font-size: calc(8px + 1.5vh);
  }

  #reload {
    align-self: flex-end;
    justify-self: flex-end;

    display: flex;
    align-items: center;
    justify-content: center;

    height: min-content;
    width: min-content;

    padding: 0.25rem;

    border: 1px solid rgb(var(--c2));
    border-radius: 0.25rem;
    outline: none;

    color: rgb(var(--c5));
    background-color: rgb(var(--c2));

    cursor: pointer;

    transition:
      0.2s background-color linear,
      0.2s color linear;
  }

  #reload:hover {
    color: rgb(var(--c2));
    background-color: rgb(var(--c1));
  }

  :global(.value .iconify) {
    align-self: center;
    font-size: calc(8px + 3vh);
    height: min-content;
  }

  .info {
    flex-grow: 1;

    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;

    box-sizing: border-box;

    font-size: calc(8px + 1vmin);
    text-align: center;

    color: rgb(var(--c5));
  }
</style>
