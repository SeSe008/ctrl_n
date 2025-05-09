import type { SearchEngines } from "$lib/types/searchEngines";

export const searchEngines: SearchEngines = {
  'ecosia': {
    name: 'Ecosia',
    url: 'https://ecosia.org/search',
    searchParam: 'q=',
    suggestions: {
      endpoint: 'http://localhost:8888/autocompleter',
      searchParam: 'q=',
      extras: []
    },
    extras: ['addon=opensearch'],
    icon: 'arcticons:ecosia'
  },
  'oceanhero': {
    name: 'OceanHero',
    url: 'https://oceanhero.today/web',
    searchParam: 'q=',
    suggestions: {
      endpoint: 'http://localhost:8888/autocompleter',
      searchParam: 'q=',
      extras: []
    },
    extras: [],
  },
  'searxng': {
    name: 'SearXNG (local)',
    url: 'http://localhost:8888/search',
    searchParam: 'q=',
    suggestions: {
      endpoint: 'http://localhost:8888/autocompleter',
      searchParam: 'q=',
      extras: []
    },
    extras: [],
    icon: 'simple-icons:searxng'
  },
  'searxng_pub': {
    name: 'SearXNG (public)',
    url: 'https://searx.tiekoetter.com/search',
    searchParam: 'q=',
    suggestions: {
      endpoint: 'http://localhost:8888/autocompleter',
      searchParam: 'q=',
      extras: []
    },
    extras: [],
    icon: 'simple-icons:searxng'
  },
  'duckduckgo': {
    name: 'DuckDuckGo',
    url: 'https://duckduckgo.com/',
    searchParam: 'q=',
    suggestions: {
      endpoint: 'http://localhost:8888/autocompleter',
      searchParam: 'q=',
      extras: ['type=list']
    },
    extras: [],
    icon: 'arcticons:duckduckgo'
  },
  'startpage': {
    name: 'Startpage',
    url: 'https://www.startpage.com/sp/search',
    searchParam: 'query=',
    suggestions: {
      endpoint: 'http://localhost:8888/autocompleter',
      searchParam: 'q=',
      extras: ['type=list']
    },
    extras: [],
    icon: 'arcticons:startpage'
  },
  'google': {
    name: 'Google',
    url: 'https://www.google.com/search',
    searchParam: 'q=',
    suggestions: {
      endpoint: 'https://ac.duckduckgo.com/ac',
      searchParam: 'q=',
      extras: ['client=firefox']
    },
    extras: [],
    icon: 'arcticons:google'
  },
  'microsoft-bing': {
    name: 'Bing',
    url: 'https://www.bing.com/search',
    searchParam: 'q=',
    suggestions: {
      endpoint: 'http://localhost:8888/autocompleter',
      searchParam: 'q=',
      extras: []
    },
    extras: [],
    icon: 'arcticons:microsoft-bing-alt'
  }
};
