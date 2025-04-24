export async function fetchImages(path: string) {
  let images: string[] = [];
  
  // Fetch images
  const res = await fetch('/api/images', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ subdir: path })
  });
  
  if (res.ok) {
    images = await res.json();
  } else {
    images = [];
  }

  console.log(path, images);

  return images;
}
