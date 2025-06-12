export type Image = string | [string, boolean?];

export interface BgImageCategory {
  images?: Array<Image>;
  path?: string;
  label: string;
  icon?: string;
}
