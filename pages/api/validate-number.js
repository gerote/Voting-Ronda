import { getDb } from "../../utils/mongodb";
import fallbackStore from "../../utils/fallbackStore";

/*
Request: POST { number: "0812..." }
Checks:
 - number must be listed in ALLOWED_NUMBERS env var (comma separated)
 - must not have voted already (check DB or fallback)
Response:
 - 200 { ok: true, alreadyVoted: false }
 - 200 { ok: true, alreadyVoted: true, poll }
 - 400/403 on invalid
*/

function normalizeNumber(n) {
  if (!n) return "";
  return String(n).replace(/\s+/g, "");
}

function allowedList() {
  const raw = process.env.ALLOWED_NUMBERS || "";
  return raw.split(",").map(s => s.trim()).filter(Boolean);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end();
  }
  const { number } = req.body || {};
  const num = normalizeNumber(number);
  if (!num) return res.status(400).json({ error: "number_required" });

  const allowed = allowedList();
  if (!allowed.includes(num)) {
    return res.status(403).json({ error: "number_not_allowed" });
  }

  const db = await getDb();
  if (!db) {
    const hasVoted = await fallbackStore.hasVoted(num);
    const poll = await fallbackStore.getPoll();
    return res.status(200).json({ ok: true, alreadyVoted: !!hasVoted, poll });
  }

  // DB path: a collection "votes" stores { number, optionId, votedAt }
  const vote = await db.collection("votes").findOne({ number: num });
  if (vote) {
    const pollDoc = await db.collection("poll").findOne({});
    return res.status(200).json({ ok: true, alreadyVoted: true, poll: { id: pollDoc._id.toString(), title: pollDoc.title, description: pollDoc.description, options: pollDoc.options }});
  }

  return res.status(200).json({ ok: true, alreadyVoted: false });
}
