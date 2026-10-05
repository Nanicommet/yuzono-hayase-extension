# Provider contract

The Hayase bridge expects a provider you are authorized to use.

## Health

`GET /health`

Any successful 2xx JSON response is sufficient.

Example:

```json
{"ok":true}
```

## Search

`GET /search`

Query parameters:

- `title`
- `episode`
- `anilistId`
- `anidbId`
- `malId`
- `resolution`
- `mode` (`single`, `batch`, or `movie`)

Return either:

```json
{
  "results": [
    {
      "title": "Example release",
      "link": "magnet:?xt=urn:btih:...",
      "hash": "INFO_HASH",
      "seeders": 10,
      "leechers": 2,
      "downloads": 100,
      "size": "1.2 GB",
      "date": "2026-10-05",
      "accuracy": "high",
      "type": "torrent"
    }
  ]
}
```

or a plain array containing those objects.

`link` may be a magnet URI or another torrent URL supported by the provider.
The bridge accepts `hash`, `infoHash`, or `infohash`.
