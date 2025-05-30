import fs from 'fs/promises';
import path from 'path';
import { dev } from '$app/environment';

import { z } from 'zod';
const SUBDIR_SCHEMA = z.object({
  subdir: z.string().regex(/^[\w-]+(?:\/[\w-]+)*$/),
});

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }: { request: Request }) {
  let subdir: string;
  try {
    ({ subdir } = SUBDIR_SCHEMA.parse(await request.json()));
  } catch {
    return new Response(
      JSON.stringify({ error: 'Invalid subdir or url, both must be alphanumeric' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const baseImages = path.resolve(dev ? 'static/images' : 'client/images');
  const targetPath = path.resolve(baseImages, subdir);

  if (!targetPath.startsWith(baseImages + path.sep)) return new Response(JSON.stringify({ error: 'Forbidden path' }), { status: 403 });
  
  let dirents;
  try {
    dirents = await fs.readdir(targetPath, { withFileTypes: true });
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      return new Response(JSON.stringify({ error: 'Directory not found' }), { status: 404 });
    }
    console.error('Fs error: ', err);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }

  // Filter and retrieve image url's
  const images = dirents
    .filter((d) => d.isFile() && /\.(jpe?g|png|gif|webp|svg)$/i.test(d.name))
    .map((d) => `/images/${subdir}/${encodeURIComponent(d.name)}`);

  return new Response(
    JSON.stringify(images),
    { status: 200, headers: { 'Content-Type': 'application/json' }
  });
}
