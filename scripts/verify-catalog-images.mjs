#!/usr/bin/env node
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const catalogDir = join(root, "data/catalogs");

const urlPattern = /https:\/\/images\.unsplash\.com\/[^\s"']+/g;

async function checkUrl(url) {
  const res = await fetch(url, { method: "HEAD", redirect: "follow" });
  return res.status;
}

const files = readdirSync(catalogDir).filter((f) => f.endsWith(".ts"));
const urls = new Set();

for (const file of files) {
  const content = readFileSync(join(catalogDir, file), "utf8");
  for (const match of content.matchAll(urlPattern)) {
    urls.add(match[0]);
  }
}

let failed = false;

for (const url of urls) {
  const status = await checkUrl(url);
  const ok = status >= 200 && status < 400;
  console.log(`${ok ? "OK" : "FAIL"} ${status} ${url}`);
  if (!ok) failed = true;
}

if (failed) {
  process.exit(1);
}

console.log(`Verified ${urls.size} image URLs.`);
