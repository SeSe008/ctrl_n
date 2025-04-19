import fs from 'fs';
import path from 'path';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
  const { subdir } = await request.json();
  
  // Remove unsafe
  const safeSubdir = subdir.replace(/\.\./g, '');
  const imagesPath = path.resolve('static/images', safeSubdir);
  
  if (!fs.existsSync(imagesPath)) {
    return new Response(
      JSON.stringify({ error: 'Directory not found' }),
      { status: 404 }
    );
  }

  const files = fs.readdirSync(imagesPath);

  console.log(files);
  
  const images = files.filter((file) =>
    /\.(jpe?g|png|gif|webp|svg)$/i.test(file)
  );

  const urls = images.map(
    (name) => `/images/${safeSubdir}/${name}`
  );

  return new Response(JSON.stringify(urls), {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
