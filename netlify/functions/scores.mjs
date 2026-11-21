import { getStore } from "@netlify/blobs";

// Highest score a fair round can plausibly reach, per game. Anything above is rejected.
const MAX_SCORE = { knock: 200, laser: 80, box: 500, sun: 6000, river: 600 };
const TOP = 10;
const KEEP = 50;
const MIN_GAP_MS = 15000;
const BLOCKED = ["fuck", "shit", "cunt", "nigg", "fag", "bitch", "cock", "pussy", "rape", "nazi", "hitler", "whore", "slut", "retard", "porn", "penis", "vagina", "anal", "kkk"];

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });

export function cleanName(raw) {
  if (typeof raw !== "string") return null;
  const name = raw.normalize("NFKC").replace(/\s+/g, " ").trim();
  if (!/^[A-Za-z0-9 _.\-]{1,12}$/.test(name)) return null;
  const flat = name
    .toLowerCase()
    .replace(/0/g, "o").replace(/1/g, "i").replace(/3/g, "e")
    .replace(/4/g, "a").replace(/5/g, "s").replace(/7/g, "t")
    .replace(/[^a-z]/g, "");
  if (BLOCKED.some((w) => flat.includes(w))) return null;
  return name;
}

async function hash(text) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 32);
}

export default async (req, context) => {
  const url = new URL(req.url);
  const board = getStore({ name: "leaderboard", consistency: "strong" });

  if (req.method === "GET") {
    const game = url.searchParams.get("game");
    if (!(game in MAX_SCORE)) return json({ error: "Unknown game." }, 400);
    const list = (await board.get(game, { type: "json" })) || [];
    return json({ game, scores: list.slice(0, TOP).map(({ name, score }) => ({ name, score })) });
  }

  if (req.method !== "POST") return json({ error: "Method not allowed." }, 405);

  let body;
  try { body = await req.json(); } catch { return json({ error: "Send the score as JSON." }, 400); }
  const { game, name, score } = body || {};
  if (!(game in MAX_SCORE)) return json({ error: "Unknown game." }, 400);
  const clean = cleanName(name);
  if (!clean) return json({ error: "Use 1–12 letters, numbers, spaces, dots, dashes or underscores, and keep it friendly." }, 400);
  if (!Number.isInteger(score) || score < 1 || score > MAX_SCORE[game]) return json({ error: "That score doesn't look possible." }, 400);

  const limits = getStore({ name: "leaderboard-limits", consistency: "strong" });
  const who = "ip-" + (await hash(context.ip || "unknown"));
  const now = Date.now();
  const last = await limits.get(who, { type: "json" });
  if (last && now - last.t < MIN_GAP_MS) return json({ error: "Slow down. Try again in a few seconds." }, 429);
  await limits.setJSON(who, { t: now });

  const list = (await board.get(game, { type: "json" })) || [];
  const entry = { name: clean, score, at: new Date(now).toISOString() };
  list.push(entry);
  list.sort((a, b) => b.score - a.score || a.at.localeCompare(b.at));
  const kept = list.slice(0, KEEP);
  await board.setJSON(game, kept);

  return json({
    game,
    rank: kept.indexOf(entry) + 1,
    scores: kept.slice(0, TOP).map(({ name, score }) => ({ name, score })),
  });
};

// "/api/board" is the address the Catch the Sun version of the page used; keep it working for any open tabs.
export const config = { path: ["/api/scores", "/api/board"] };
