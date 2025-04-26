
<h1>Privacy and Credits</h1>
<p>Special thanks to <a target="_blank" href="https://finnbear.com/">Finn Bear</a> for providing animal pictures on <a target="_blank" href="https://squirrelwatching.com/">Squirrel Watching</a>.</p>
<h2>Used libraries</h2>
<p style="margin-bottom: -.5rem;">
  Libraries used are:
</p>
<ul>
  <li><a target="_blank" href="https://github.com/searxng/searxng">SearXNG</a> for search suggesions</li>
  <li><a target="_blank" href="https://www.npmjs.com/package/rss-to-json">rss-to-json</a> for parsing web messages</li>
  <li><a target="_blank" href="https://www.npmjs.com/package/dompurify">DOMPurify</a> to clean up RSS-Elements</li>
  <li><a target="_blank" href="https://www.npmjs.com/package/dotenv">dotenv</a> to retrieve environment variables</li>
  <li><a target="_blank" href="https://www.mathjs.org/">mathjs</a> to evaluate math expressions in the search bar</li>
</ul>
<h2>Privacy</h2>
<p>
  Your data, not including location (shared to OpenWeatherMap for weather) and search query (shared to local instance of SearXNG for search suggestions), will never be shared to third parties.<br/>
  All data is fetched anonimously on the server.<br/>
  Search suggestions are fetched locally on the server with SearXNG.<br/>
  Weather data is resolved from <a target="_blank" href="https://openweathermap.org/">OpenWeatherMaps's Api</a>.<br/><br/>
  Made by <a target="_blank" href="https://github.com/SeSe008">Se</a><br/>
  <a target="_blank" href="https://github.com/SeSe008/new_tab">GitHub</a>
</p>

<style>
  :global {
    body {
      display: flex;
      flex-direction: column;
      align-items: center;

      overflow-x: hidden;
      overflow-y: auto;
      
      background-color: white;
      color: black;
      font-family: "Quicksand", sans-serif;
    }
  }

  p {
    text-align: center;
    max-width: 50%;
  }

  a {
    color: inherit;
  }
</style>
