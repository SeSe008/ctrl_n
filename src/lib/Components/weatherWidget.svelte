<script lang="ts">
  import Icon from "@iconify/svelte";

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

  let location: string = '';
  
  let weather: Weather;
  
  async function fetchWeather() {
    if (location.length > 0) window.localStorage.setItem('weatherLocation', location);

    const resp = await fetch('/api/weather', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ city: window.localStorage.getItem('weatherLocation') || '' })
    });

    if (resp.status === 500) return;
    
    weather = await resp.json();
  }

  function capitalizeWords(sentence: string): string {
    return sentence
      .split(' ')
      .map(word =>
	word.length > 0
          ? word[0].toUpperCase() + word.slice(1).toLowerCase()
          : ''
      )
      .join(' ');
  }

  fetchWeather();
</script>

<div id="weather">
  {#if weather}
    <div id="properties">
      <img alt="Weather Icon" src={`https://openweathermap.org/img/wn/${weather.weather[0]?.icon}@2x.png`} />
      <span id="location">{weather.name}</span>
      <div id="values">
	<span id="description">{capitalizeWords(weather.weather[0].description)}</span>
	<span id="temp"><Icon icon="mdi:temperature" />{weather.main.temp}°C ({weather.main.feels_like}°C)</span>
	<span id="humidity"><Icon icon="wi:humidity" />{weather.main.humidity}%</span>
      </div>
    </div>
  {/if}
  
  <div id="inputs">
    <input type="text" bind:value={location} placeholder="New Location" />
    <button on:click={fetchWeather}>Get Weather</button>
  </div>
</div>
  
<style>
  #weather {
    display: flex;
    flex-direction: column;
    height: min-content;
    width: fit-content;
    overflow: hidden;
    background-color: rgba(var(--c1), .3);
    border: 1px solid rgb(var(--c2));
    border-radius: 1rem;
    box-sizing: border-box;
    padding: 1rem;
    gap: .5rem;
    max-width: 100%;
  }

  #properties {
    display: grid;
    grid-template-rows: repeat(2, min-content);
    grid-template-columns: repeat(2, auto);
    box-sizing: border-box;
    width: max-content;
    align-self: center;
    gap: .25rem;
    color: rgb(var(--c2));
    background-color: rgba(var(--c1), .5);
    padding: 1rem;
    border: 1px solid rgb(var(--c2));
    border-radius: 1rem;
    max-width: 100%;
  }

  img {
    width: 100%;
    grid-row: 1;
    grid-column: 1;
    align-self: center;
    justify-self: center;
    margin: 0;
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

  #temp, #humidity {
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

  #inputs {
    grid-column: 1 / -1;
    display: flex;
    flex-direction: row;
    justify-content: stretch;
    width: 100%;
  }

  #inputs > input {
    outline: none;
    width: 100%;
    padding: .25rem;
    font-size: calc(5px + .75vmin);
    border-radius: .5rem 0 0 .5rem;
    border: 1px solid rgb(var(--c2));
    border-right: none;
    color: rgb(var(--c2));
    background-color: rgb(var(--c1));
  }

  #inputs > input::placeholder {
    color: rgb(var(--c2));
  }

  #inputs > button {
    border-radius: 0 .5rem .5rem 0;
    border: 1px solid rgb(var(--c2));
    border-left: none;
    outline: none;
    color: rgb(var(--c2));
    background-color: rgb(var(--c3));
    cursor: pointer;
    font-size: calc(5px + .75vmin);
    padding: 0 .25rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    white-space: nowrap;
  }
</style>
