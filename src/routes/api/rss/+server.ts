import { JSDOM } from "jsdom";
import RSS from 'rss-to-json';
const { parse } = RSS;
import type { RawRssItem, Article } from "$lib/types/widgets/rss";

function normalizeItem(item: RawRssItem): Article {
  // Get title
  const title = item.title
    || item.id
    || item.link
    || "No Title";

  // Get content
  const htmlText = item.content
    ?? item.description
    ?? item.content_encoded
    ?? "";

  // Create dom
  const dom = new JSDOM(htmlText);
  const doc = dom.window.document;

  // Get image url
  let imageUrl: string | null = null;
  const encs = item.enclosures;
  if (!imageUrl && Array.isArray(encs) && encs.length > 0 && encs[0].url) {
    imageUrl = encs[0].url;
  }

  if (!imageUrl && item.media) {
    if (item.media.thumbnail) {
      imageUrl = item.media.thumbnail;
    } else if (Array.isArray(item.media.content) && item.media.content[0]?.url) {
      imageUrl = item.media.content[0]!.url!;
    }
  }

  // Fallback
  const firstImg = doc.querySelector("img");
  if (!imageUrl && firstImg?.getAttribute("src")) {
    imageUrl = firstImg.getAttribute("src");
  }
  if (firstImg) firstImg.remove();

  const desc = doc.body.innerHTML.trim();

  return {
    title,
    link: item.link,
    desc: desc,
    imageUrl
  };
}


/** @type {import('./$types').RequestHandler} */
export async function POST({ request }: { request: Request }) {
  let feedUrl: string;

  try {
    const { url } = await request.json();
    if (typeof url !== 'string' || !url) throw new Error();
    const parsed = new URL(url);
    if (!['https:', 'https'].includes(parsed.protocol)) throw new Error('Invalid protocol');

    feedUrl = parsed.toString();
  } catch {
    return new Response(
      JSON.stringify({ error: 'Invalid or missing `url` field (must be an HTTP/HTTPS URL)' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5_000);

  let rss;

  try {
    rss = await parse(
      feedUrl,
      {
	signal: controller.signal,
	size: 1024 * 1024 * 2,
	maxRedirects: 3
      }
    );
  } catch {
    return new Response(
      JSON.stringify({error: 'Failed to fetch feed'}),
      { status: 502, headers: { 'ContentType': 'application/json'} }
    );
  } finally {
    clearTimeout(timeout);
  }

  try {
    const articles: Article[] = rss.items.map(normalizeItem);
    
    return new Response(
      JSON.stringify(articles),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch {
    return new Response(
      JSON.stringify({error: 'Failed to parse article'}),
      { status: 500, headers: {'Content-Type': 'application/json'} }
    );
  }
}
