export interface SuggestionEndpoint {
  endpoint: string;
  searchParam: string;
  extras: string[];
};

export interface SearchEngine {
  name: string;
  url: string;
  searchParam: string;
  suggestions: SuggestionEndpoint;
  extras: string[];
}

export type SearchEngines = {
  [key: string]: SearchEngine;
}

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
    extras: ['addon=opensearch']
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
    extras: []
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
    extras: []
  },
  'searxng_pub': {
    name: 'SearXNG (public)',
    url: 'https://searx.bndkt.io/search',
    searchParam: 'q=',
    suggestions: {
      endpoint: 'http://localhost:8888/autocompleter',
      searchParam: 'q=',
      extras: []
    },
    extras: []
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
    extras: []
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
    extras: []
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
    extras: []
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
    extras: []
  }
};
