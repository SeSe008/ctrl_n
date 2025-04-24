import RSS from 'rss-to-json';

const { parse } = RSS;

interface Article {
  title: string;
  description: string;
  link: string;
  published: number;
  created: number;
  content: string;
};

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
    const articles: Article[] = rss.items;
    
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
