interface SuggestionEndpoint {
  endpoint: string;
  searchParam: string;
  extras: string[];
};

/** @type {import('./$types').RequestHandler} */
 export async function POST({ request }: { request: Request }) {
   const body = await request.json();
   
   const suggestionsEndpoint: SuggestionEndpoint = body.suggestionEndpoint;
   const queryText: string = body.queryText;

   const query: string = `${suggestionsEndpoint.searchParam}${encodeURIComponent(queryText)}`;
   
   const extras: string = suggestionsEndpoint.extras.join('&');

   const url: string = `${suggestionsEndpoint.endpoint}?${query}&${extras}`

   const res = await fetch(url);
   
   if (!res.ok) {
     return new Response('Failed to fetch suggestions', { status: 500 });
   }
   
   const data = await res.json();

   return new Response(JSON.stringify(data), {
     headers: { 'Content-Type': 'application/json' }
   });
}
