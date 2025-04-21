import dotenv from "dotenv";
dotenv.config();

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }: { request: Request }) {
  const CITY = (await request.json()).city;
  const API_KEY = process.env.WEATHER_API_KEY;
  
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=metric`
  );

  if (!res.ok) {
    return new Response('Failed to load weather', {status: 500});
  }

  const weather = await res.json();
  return new Response(JSON.stringify(weather), {
    headers: { 'Content-Type': 'application/json' }
  });
};
