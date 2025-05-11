import { z } from 'zod';

const LOCALHOST = z.string().url().refine((urlStr: string) => {
  try {
    const url = new URL(urlStr);
    return url.hostname === 'localhost';
  } catch {
    return false;
  }
}, {
  message: 'Endpoint must be localhost',
});

const SUGGESTION_ENDPOINT_SCHEMA = z.object({
  endpoint: LOCALHOST,
  searchParam: z.string(),
  extras: z.array(z.string())
});

const REQUEST_SCHEMA = z.object({
  suggestionEndpoint: SUGGESTION_ENDPOINT_SCHEMA,
  queryText: z.string()
});

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }: { request: Request }) {
  let parsed_body;
  
  try {
    const body = await request.json();
     parsed_body = REQUEST_SCHEMA.parse(body);
  } catch {
    return new Response('Invalid request payload', { status: 400 });
  }
  
  const { suggestionEndpoint, queryText } = parsed_body;
  
  const query: string = `${suggestionEndpoint.searchParam}${encodeURIComponent(queryText)}`;   
  const extras: string = suggestionEndpoint.extras.join('&');
  const url: string = `${suggestionEndpoint.endpoint}?${query}&${extras}`;
  
  try {
    const res = await fetch(url);
     
    if (!res.ok) {
      return new Response('Failed to fetch suggestions', { status: 500 });
    }
    
    const data = await res.json();
     
    return new Response(
      JSON.stringify(data),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch {
    return new Response('Error fetching suggestions', { status: 500 });
  }
}
