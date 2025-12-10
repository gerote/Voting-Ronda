import { getDb } from "../../utils/mongodb";
import fallbackStore from "../../utils/fallbackStore";
import { allowedListFromEnv, normalizeNumber } from "../../utils/allowedNumbers";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end();
  }
  const { number } = req.body || {};
  const num = normalizeNumber(number);
  if (!num) return res.status(400).json({ error: "number_required" });

  const allowed = allowedListFromEnv();
  if (!allowed.includes(num)) {
    return res.status(403).json({ error: "number_not_allowed" });
  }

  const db = await getDb();
  if (!db) {
    const hasVoted = await fallbackStore.hasVoted(num);
    const poll = await fallbackStore.getPoll();
    return res.status(200).json({ ok: true, alreadyVoted: !!hasVoted, poll });
  }

  // DB path: check votes collection
  const vote = await db.collection("votes").findOne({ number: num });
  if (vote) {
    const pollDoc = await db.collection("poll").findOne({});
    return res.status(200).json({ ok: true, alreadyVoted: true, poll: { id: pollDoc._id.toString(), title: pollDoc.title, description: pollDoc.description, options: pollDoc.options }});
  }

  return res.status(200).json({ ok: true, alreadyVoted: false });
}
