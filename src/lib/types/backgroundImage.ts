export interface ImageApi {
  label: string;
  endpoint: string;
  input: () => string;
  readonly params: Record<string, any>;

  isEmpty: (data: Record<string, any>) => boolean;
  url: (data: Record<string, any>) => string;
  creator: (data: Record<string, any>) => string;
  creatorUrl: (data: Record<string, any>) => string;
  license: (data: Record<string, any>) => string;
  licenseUrl: (data: Record<string, any>) => string;
}

export interface ImageCredit {
  creator: string;
  creatorUrl: string;
  license: string;
  licenseUrl: string;
}
