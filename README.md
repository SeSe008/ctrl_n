<div align="center">
	<img width="120" src="static/icons/icon.svg" />
	<h1>CTRL+N</h1>
	<b>Customizable and Elegant New-Tab Page for any Browser</b><br/>
	<h2>⚠️ CTRL+N is currently in a beta state – Breaking changes can occur. <a href="#website-broken-background-gone">Further info</a> ⚠️</h2>
</div>

<div align="center">
	<img width="33%" title="Screenshot Light" src="screenshots/Light.png" />
	<img width="33%" title="Screenshot Full" src="screenshots/Full.png" />
	<img width="33%" title="Screenshot Settings" src="screenshots/Settings.png" /><br/>
	<sub>Screenshots might not be fully up to date</sub>
</div>

---

[![Svelte](https://img.shields.io/badge/Svelte-%23f1413d.svg?logo=svelte&logoColor=white)](#)

## Features

- Vertical and horizontal tiling
- An always-growing list of widgets to choose
- A long list of preset search engines _(custom ones will come soon)_

## How to use?

There are 2 ways of using CTRL+N:

1. Use the public website, located at [newtab.se-008.net](https://newtab.se-008.net)
   - Pros:
	 - Stable version - Bugs should happen less frequently
	 - Auto updates
	 - No technical knowledge needed
   - Cons:
	 - The server is located in Canada, for some regions the page (and especially the images) might load slowly
	 - Less frequent updates
	 - Some information (e.g. Weather-Location, RSS-Feed URL) will be sent to the non-local server
2. Clone the repository and run the page locally with `node`
   - Pros:
	 - Almost instant loading
	 - Nothing is routed through any non-local server
	 - Full customization
	 - More frequent updates
   - Cons:
	 - Technical knowledge needed
	 - Bugs might happen more frequently
	 - No Auto-Updates
	 - Some features (currently only the Weather-Widget) need custom API keys

In the future, there might be an automatic installation script that guides you through running the webpage locally.<br/>

To automatically load the page when opening a new tab in...

### Firefox:

In Firefox-based browsers, you could use [New Tab Override](https://addons.mozilla.org/en-US/firefox/addon/new-tab-override/)

### Chrome/Chromium:

In Chromium-based browsers, you could use [New Tab Redirect](https://chromewebstore.google.com/detail/new-tab-redirect/)

### Ungoogled-Chromium:

In ungoogled-chromium, you can set the `custom-ntp` flag

## Privacy

Tl;DR: No data is ever stored on the server side nor shared to third parties. Some data, currently the Weather Location and the RSS-URL, is routed through the server, mainly to avoid `CORS` issues. All data is stored in the browsers local storage. <br/>
The full privacy statement is located [here](https://newtab.se-008.net/privacy).

---

## Roadmap

Elements will not follow chronological order

- [ ] More Styling Control for Page/Widgets
  - [x] Opacity
  - [ ] Font
  - [x] Widget Resizing
  - [x] Widget Positioning
- [ ] Custom Search Engines
- [ ] Custom Widgets
- [ ] CSS-Rework for compatibility purposes
- [ ] Stable offline version
- [ ] Native chrome extension

Future widget ideas:

- Notes
- ToDo
- Music Controller with Spotify/YouTube integration
- Calendar
- Social-Media Feed (Reddit/X/BlueSky)
- Daily Facts/Trivia
- Give me ideas :)

## Website Broken? Background gone?

Breaking changes may still occur, but clearing local storage is helping almost everytime.
