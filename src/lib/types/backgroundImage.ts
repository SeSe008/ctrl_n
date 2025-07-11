export interface ImageApi {
  label: string;
  endpoint: string;
  input: () => string;
  readonly params: Record<string, any>;

  isEmpty: (data: Record<string, any>) => boolean;
  url: (data: Record<string, any>) => string | Promise<string>;
  creator: (data: Record<string, any>) => string | Promise<string>;
  creatorUrl: (data: Record<string, any>) => string | Promise<string>;
  license: (data: Record<string, any>) => string | Promise<string>;
  licenseUrl: (data: Record<string, any>) => string | Promise<string>;
}

export interface ImageCredit {
  creator: string;
  creatorUrl: string;
  license: string;
  licenseUrl: string;
}
