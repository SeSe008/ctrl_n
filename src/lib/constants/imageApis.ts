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
        aspect_ratio: 'wide'
      };
    },

    isEmpty: (data: Record<string, any>) => data.results.length === 0,
    url: (data: Record<string, any>) => data.results[0].url,
    creator: (data: Record<string, any>) => data.results[0].creator,
    creatorUrl: (data: Record<string, any>) => data.results[0].creator_url,
    license: (data: Record<string, any>) =>
      `CC-${data.results[0].license}-${data.results[0].license_version}`,
    licenseUrl: (data: Record<string, any>) => data.results[0].license_url
  },
  {
    label: 'NASA Image and Video Library',
    endpoint: 'https://images-api.nasa.gov/search',
    input: () => getApiImageKeyword(),
    get params() {
      const q = this.input().trim();
      return { q, media_type: 'image' };
    },
    isEmpty: (data) =>
      !data.collection || !data.collection.items || data.collection.items.length === 0,
    url: (data) => {
      data._randomIndex = Math.floor(Math.random() * data.collection.items.length);

      const pick = data.collection.items[data._randomIndex];
      return pick.links[0].href;
    },
    creator: (data) => {
      const pick = data.collection.items[data._randomIndex!];
      return pick.data[0].photographer ?? pick.data[0].center;
    },
    creatorUrl: () => 'https://images.nasa.gov/',
    license: () => 'Public Domain',
    licenseUrl: () => 'https://www.nasa.gov/multimedia/guidelines/index.html'
  },
  {
    label: 'Art Institute of Chicago',
    endpoint: 'https://api.artic.edu/api/v1/artworks/search',
    input: () => getApiImageKeyword(),
    get params() {
      const q = this.input().trim();
      return {
        q,
        limit: 100,
        fields: 'title,image_id,artist_title,artist_id'
      };
    },
    isEmpty: (data: any) => !data.data || data.data.length === 0,
    url: (data: any) => {
      data._randomIndex = Math.floor(Math.random() * data.data.length);

      console.log(data.data[data._randomIndex]);

      return `https://www.artic.edu/iiif/2/${data.data[data._randomIndex].image_id}/full/843,/0/default.jpg`;
    },
    creator: (data: any) => data.data[data._randomIndex].artist_title,
    creatorUrl: (data: any) =>
      `https://www.artic.edu/artists/${data.data[data._randomIndex].artist_id}`,
    license: () => 'CC0',
    licenseUrl: () => 'https://creativecommons.org/publicdomain/zero/1.0/'
  }
];

export const imageKeywords: Array<string> = [
  'Computer Wallpapers',
  'Nature',
  'Abstract Art',
  'Cityscape',
  'Minimal',
  'Animals',
  'Landscapes',
  'Textures',
  'Technology',
  'Plants',
  'Sunsets',
  'Travel',
  'Food',
  'Sports',
  'People',
  'Architecture',
  'Moon',
  'Outer Space',
  'Oceans',
  'Custom'
];
