import fs from 'fs';
import path from 'path';
import { dev } from '$app/environment';


/** @type {import('./$types').RequestHandler} */
export async function POST({ request }: { request: Request }) {
  const { subdir } = await request.json();
  
  // Remove unsafe
  const safeSubdir = subdir.replace(/\.\./g, '');
  const base = dev ? 'static' : 'client';
  const imagesPath = path.resolve(base, 'images', safeSubdir);
  
  if (!fs.existsSync(imagesPath)) {
    return new Response(
      JSON.stringify({ error: 'Directory not found' }),
      { status: 404 }
    );
  }

  const files = fs.readdirSync(imagesPath);

  const images = files.filter((file: string) =>
    /\.(jpe?g|png|gif|webp|svg)$/i.test(file)
  );

  const urls = images.map(
    (name: string) => `/images/${safeSubdir}/${name}`
  );

  return new Response(JSON.stringify(urls), {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
