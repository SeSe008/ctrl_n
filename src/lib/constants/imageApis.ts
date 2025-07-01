import { getApiImageKeyword } from '$lib/stores/backgroundImage';
import type { ImageApi } from '$lib/types/backgroundImage';

export const imageApis: Array<ImageApi> = [
  {
    label: 'Wikimedia Commons',
    endpoint: 'https://commons.wikimedia.org/w/api.php',
    input: () => getApiImageKeyword(),
    get params() {
      const category = this.input().trim();
      return {
        action: 'query',
        format: 'json',
        origin: '*',
        generator: 'search',
        gsrsearch: `incategory:"${category}"`,
        gsrnamespace: 6,
        gsrlimit: 1,
        gsrsort: 'random',
        prop: 'imageinfo',
        iiprop: 'url|user|extmetadata'
      };
    },

    isEmpty: (data: Record<string, any>) =>
      !data.query || !data.query.pages || Object.keys(data.query.pages).length === 0,
    url: (data: Record<string, any>) =>
      data.query.pages[Object.keys(data.query.pages)[0]].imageinfo[0].url,
    creator: (data: Record<string, any>) =>
      data.query.pages[Object.keys(data.query.pages)[0]].imageinfo[0].user ?? 'Unknown',
    creatorUrl: (data: Record<string, any>) =>
      `https://commons.wikimedia.org/wiki/User:${data.query.pages[Object.keys(data.query.pages)[0]].imageinfo[0].user}`,
    license: (data: Record<string, any>) =>
      data.query.pages[Object.keys(data.query.pages)[0]].imageinfo[0].extmetadata.LicenseShortName
        .value,
    licenseUrl: (data: Record<string, any>) =>
      data.query.pages[Object.keys(data.query.pages)[0]].imageinfo[0].extmetadata.LicenseUrl.value
  },
  {
    label: 'Openverse',
    endpoint: 'https://api.openverse.org/v1/images/',
    input: () => getApiImageKeyword(),
    get params() {
      const category = this.input().trim();
      return {
        tags: category,
        license: 'by',
        page_size: 1,
        page: Math.floor(Math.random() * 239 + 1),
        aspect_ratio: 'wide',
        source: 'flickr'
      };
    },

    isEmpty: (data: Record<string, any>) => data.results.length === 0,
    url: (data: Record<string, any>) => data.results[0].url,
    creator: (data: Record<string, any>) => data.results[0].creator,
    creatorUrl: (data: Record<string, any>) => data.results[0].creator_url,
    license: (data: Record<string, any>) =>
      `CC-${data.results[0].license}-${data.results[0].license_version}`,
    licenseUrl: (data: Record<string, any>) => data.results[0].license_url
  }
];
