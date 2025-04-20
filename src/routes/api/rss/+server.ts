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
  const url: string = (await request.json()).url;

  if (url === undefined || url === '') {
    return new Response('URL is empty', { status: 500 });
  }

  const rss = await parse(url);
  
  const articles: Article[] = rss.items;
  
  return new Response(JSON.stringify(articles), {
    headers: { 'Content-Type': 'application/json' }
  });
}
