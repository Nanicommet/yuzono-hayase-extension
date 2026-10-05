/*
 * Yūzōnō → Hayase compatibility layer.
 *
 * Provider contract:
 *   GET <API_BASE>/health
 *   GET <API_BASE>/search?title=...&episode=...&anilistId=...&anidbId=...&malId=...&mode=...
 *
 * The provider must be one the user is authorized to access.
 */

const API_BASE = "https://YOUR-AUTHORIZED-ENDPOINT.example";

function clean(value) {
  return value == null ? "" : String(value).trim();
}

function number(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function normalizeResult(item) {
  const link = clean(item.link || item.magnet || item.url);
  if (!link) return null;

  const title = clean(item.title) || "Torrent";
  const hash = clean(item.hash || item.infoHash || item.infohash);

  return {
    title,
    link,
    hash,
    seeders: number(item.seeders),
    leechers: number(item.leechers),
    downloads: number(item.downloads),
    size: clean(item.size),
    date: clean(item.date || item.pubDate),
    accuracy: clean(item.accuracy) || "medium",
    type: clean(item.type) || "torrent"
  };
}

async function request(path, params = {}) {
  const url = new URL(path, `${API_BASE.replace(/\/+$/, "")}/`);

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && String(value) !== "") {
      url.searchParams.set(key, String(value));
    }
  }

  const response = await fetch(url, {
    headers: {
      "accept": "application/json"
    }
  });

  if (!response.ok) {
    throw new Error(`Provider returned HTTP ${response.status}`);
  }

  const data = await response.json();
  const raw = Array.isArray(data) ? data : (data.results || data.torrents || []);

  return raw.map(normalizeResult).filter(Boolean);
}

const source = {
  async test() {
    await request("health");
    return true;
  },

  async single(query) {
    return request("search", {
      title: query?.title || query?.name || query,
      episode: query?.episode,
      anilistId: query?.anilistId,
      anidbId: query?.anidbId,
      malId: query?.malId,
      resolution: query?.resolution,
      mode: "single"
    });
  },

  async batch(query) {
    return request("search", {
      title: query?.title || query?.name || query,
      episode: query?.episode,
      anilistId: query?.anilistId,
      anidbId: query?.anidbId,
      malId: query?.malId,
      resolution: query?.resolution,
      mode: "batch"
    });
  },

  async movie(query) {
    return request("search", {
      title: query?.title || query?.name || query,
      anilistId: query?.anilistId,
      anidbId: query?.anidbId,
      malId: query?.malId,
      resolution: query?.resolution,
      mode: "movie"
    });
  }
};

export default source;
