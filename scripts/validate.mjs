import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const manifest = JSON.parse(
  fs.readFileSync(path.join(root, "index.json"), "utf8")
);

if (!Array.isArray(manifest) || manifest.length === 0) {
  throw new Error("index.json must contain at least one manifest");
}

for (const [i, item] of manifest.entries()) {
  for (const key of [
    "manifestVersion", "name", "id", "version", "type",
    "media", "languages", "code", "update"
  ]) {
    if (!(key in item)) throw new Error(`Manifest ${i}: missing ${key}`);
  }

  if (item.manifestVersion !== 2) {
    throw new Error(`Manifest ${i}: manifestVersion must be 2`);
  }

  if (item.type !== "torrent") {
    throw new Error(`Manifest ${i}: this bridge targets Hayase torrent extensions`);
  }
}

const code = fs.readFileSync(
  path.join(root, "dist", "yuzono-torrent-bridge.js"),
  "utf8"
);

if (!code.includes("export default")) {
  throw new Error("Bridge must export a default Hayase source object");
}

console.log(`Validated ${manifest.length} Hayase manifest(s).`);
