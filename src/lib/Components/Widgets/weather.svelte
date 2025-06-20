<script lang="ts">
  import Icon from '@iconify/svelte';
  import { initWeatherLoaction, weatherLocation } from '$lib/stores/widgets/weatherLocation';
  import { onMount } from 'svelte';

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
  {#if weather && !error}
    <div id="properties">
      <img
        alt="Weather Icon"
        src={`https://openweathermap.org/img/wn/${weather.weather[0]?.icon}@2x.png`}
      />
      <span id="location">{weather.name}</span>
      <div id="values">
        <span id="description">{capitalizeWords(weather.weather[0].description)}</span>
        <span id="temp"
          ><Icon icon="mdi:temperature" />{weather.main.temp}°C ({weather.main.feels_like}°C)</span
        >
        <span id="humidity"><Icon icon="wi:humidity" />{weather.main.humidity}%</span>
      </div>
    </div>
  {:else}
    <div id="info">
      {error ? error : 'Could not load weather. Try setting a new location in the settings.'}
    </div>
  {/if}
</div>

<style>
  #weather {
    justify-self: center;

    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    height: 100%;
    width: 100%;

    overflow-y: auto;
    overflow-x: hidden;

    background-color: rgba(var(--c1), var(--o1));
    border: 1px solid rgb(var(--c2));
    border-radius: 1rem;

    box-sizing: border-box;
    padding: 1rem;
  }

  #properties {
    display: grid;
    grid-template-rows: repeat(2, min-content);
    grid-template-columns: repeat(2, auto);
    box-sizing: border-box;
    width: max-content;
    align-self: center;
    gap: 0.25rem;
    color: rgb(var(--c2));
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
    grid-template-columns: 1fr;
    grid-template-rows: min-content repeat(2, 1fr);
  }

  #description {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    font-size: calc(8px + 1.5vh);
    font-weight: bold;
  }

  #temp,
  #humidity {
    display: flex;
    align-self: center;
    align-items: center;
    justify-content: flex-start;
    font-size: calc(8px + 1.5vh);
  }

  :global(#values .iconify) {
    align-self: center;
    font-size: calc(8px + 3vh);
    height: min-content;
  }

  #info {
    flex-grow: 1;
    box-sizing: border-box;
    padding: 0.5rem;
    font-size: calc(8px + 1vmin);
    text-align: center;
    border-radius: 0.5rem;
    border: 1px solid rgb(var(--c2));
    color: rgb(var(--c2));
    background-color: rgb(var(--c1));
  }
</style>
