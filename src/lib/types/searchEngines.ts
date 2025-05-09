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
