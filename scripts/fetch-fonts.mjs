#!/usr/bin/env node
/**
 * Fetches the Switzer typeface from Fontshare into public/fonts/.
 *
 * Why this is a build step rather than a committed file: Switzer is published
 * under the ITF Free Font License, which allows self-hosting on your own site
 * but forbids redistributing the font files through a public repository. So
 * the file is downloaded from Fontshare when the site is built (or when the
 * dev server starts) and is listed in .gitignore.
 *
 * The step never fails the build. If Fontshare cannot be reached the site
 * falls back to a metric-matched system font declared in app/globals.css.
 */
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const TARGET = join(ROOT, "public", "fonts", "Switzer-Variable.woff2");

/** Fontshare's CSS API. "@1" requests the variable font (weights 100-900). */
const CSS_API = "https://api.fontshare.com/v2/css?f[]=switzer@1&display=swap";
/** Last known location of the same file, used if the CSS API changes shape. */
const KNOWN_URL =
  "https://cdn.fontshare.com/wf/HJHZ26OECMTXRH7JXPFC7EVIHDSLT2RA/LJRNLR7WCPF3PY3SZ7B2LHNUTQMFNCHL/4MCJYGQDIOOXHWSIIB2OYNDBEALJSOGN.woff2";

const TIMEOUT_MS = 20_000;
const MIN_BYTES = 20_000;

const isWoff2 = (buf) => buf.length >= MIN_BYTES && buf.subarray(0, 4).toString("latin1") === "wOF2";

async function get(url) {
  const res = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });
  if (!res.ok) throw new Error(`${new URL(url).host} responded with ${res.status}`);
  return res;
}

async function resolveUrl() {
  try {
    const css = await (await get(CSS_API)).text();
    const match = css.match(/url\(['"]?([^'")]+\.woff2)['"]?\)/);
    if (match) return match[1].startsWith("//") ? `https:${match[1]}` : match[1];
  } catch {
    // Fall through to the known URL.
  }
  return KNOWN_URL;
}

async function main() {
  if (existsSync(TARGET)) {
    const existing = await readFile(TARGET);
    if (isWoff2(existing)) {
      console.log("[fonts] Switzer already present, skipping download.");
      return;
    }
  }

  const url = await resolveUrl();
  const buf = Buffer.from(await (await get(url)).arrayBuffer());
  if (!isWoff2(buf)) throw new Error("the downloaded file is not a WOFF2 font");

  await mkdir(dirname(TARGET), { recursive: true });
  await writeFile(TARGET, buf);
  const digest = createHash("sha256").update(buf).digest("hex").slice(0, 12);
  console.log(`[fonts] Switzer downloaded (${Math.round(buf.length / 1024)} KB, sha256 ${digest}…).`);
}

main().catch((err) => {
  console.warn(
    `[fonts] Could not fetch Switzer from Fontshare (${err instanceof Error ? err.message : err}). ` +
      "The site will use its system-font fallback until the next successful build."
  );
});
