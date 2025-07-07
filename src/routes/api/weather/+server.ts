import dotenv from 'dotenv';
import { z } from 'zod';
dotenv.config();

import type { RequestHandler } from '@sveltejs/kit';
import { RateLimiter } from 'sveltekit-rate-limiter/server';

const LIMITER = new RateLimiter({
  IP: [10, 'm']
});

const CITY_SCHEMA = z.object({
  city: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[\w\s\-,]+$/)
});

export const POST: RequestHandler = async (event) => {
  if (await LIMITER.isLimited(event)) {
    return new Response(JSON.stringify({ error: 'Too many requests' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const { request } = event;
  let city: string;
  try {
    ({ city } = CITY_SCHEMA.parse(await request.json()));
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid city parameter' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const encoded = encodeURIComponent(city);
  const API_KEY = process.env.WEATHER_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encoded}&appid=${API_KEY}&units=metric`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5_000);

  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) {
      throw new Error(`${(await res.json()).message}`);
    }

    const weather = await res.json();

    return new Response(JSON.stringify(weather), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error('Weather fetch failed:', err);
    return new Response(JSON.stringify({ error: `Api: ${err}` }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' }
    });
  } finally {
    clearTimeout(timeoutId);
  }
};
