export type Images = Array<string | [string, boolean?]>;

export interface BgImageCategory {
  images?: Images;
  path?: string;
  label: string;
  icon?: string;
}
