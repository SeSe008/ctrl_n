export async function fetchImages(path: string) : Promise<string[]> {
  const res = await fetch('/api/images', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ subdir: path })
  });

  if (!res.ok) {
    console.error('fetchImages failed:', res.status, await res.text());
    return [];
  }

  const json = await res.json();

  if (Array.isArray(json) && json.every(item => typeof item === "string")) {
    return json;
  } else {
    return [];
  }
}
