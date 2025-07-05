import type { TileMetadata } from '$lib/types/tiles';

export const tileMetadata: TileMetadata[] = [
  { name: 'spacer', label: 'Spacer', icon: 'mdi:arrow-expand-vertical' },
  {
    name: 'search_bar',
    label: 'Search Bar',
    icon: 'mdi:search',
    cssVars: ['--o1', '--tileBorder', '--tileBorderRadius']
  },
  {
    name: 'clock',
    label: 'Clock',
    icon: 'mdi:clock',
    cssVars: ['--o1', '--tileBorder', '--tileBorderRadius']
  },
  {
    name: 'rss_feed',
    label: 'RSS-Feed',
    icon: 'mdi:newspaper-variant-multiple',
    cssVars: ['--o1', '--o2', '--tileBorder', '--tileBorderRadius', '--tileTitle']
  },
  {
    name: 'weather',
    label: 'Weather',
    icon: 'mdi:weather-partly-cloudy',
    cssVars: ['--o1', '--tileBorder', '--tileBorderRadius']
  },
  {
    name: 'calculator',
    label: 'Calculator',
    icon: 'mdi:calculator-variant',
    cssVars: ['--o1', '--o2', '--tileBorder', '--tileBorderRadius']
  },
  {
    name: 'bookmarks',
    label: 'Bookmarks',
    icon: 'mdi:bookmark-multiple',
    cssVars: ['--o1', '--o2', '--tileBorder', '--tileBorderRadius', '--tileTitle']
  }
];
