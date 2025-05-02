export interface RawRssItem {
  title?: string;
  id?: string;
  link: string;
  description?: string;
  content?: string;
  content_encoded?: string;
  enclosures?: Array<{ url?: string; type?: string; length?: string }>;
  media?: {
    thumbnail?: string;
    content?: { url?: string; type?: string }[];
  };
}

export interface Article {
  title: string;
  link: string;
  desc: string;
  imageUrl: string | null;
}
