const cache = {};

export async function cachedFetch(key, url) {
  if (cache[key]) {
    return cache[key];
  }

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const data = await response.json();

  cache[key] = data;

  return data;
}

export function clearCache(key) {
  if (key) {
    delete cache[key];
  } else {
    Object.keys(cache).forEach((k) => delete cache[k]);
  }
}