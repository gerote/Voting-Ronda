import { getDb } from "../../utils/mongodb";
import fallbackStore from "../../utils/fallbackStore";
import { allowedListFromEnv, normalizeNumber } from "../../utils/allowedNumbers";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end();
  }
  const { number, optionId } = req.body || {};
  const num = normalizeNumber(number);
  if (!num) return res.status(400).json({ error: "number_required" });

  const allowed = allowedListFromEnv();
  if (!allowed.includes(num)) {
    return res.status(403).json({ error: "number_not_allowed" });
  }

  const db = await getDb();
  if (!db) {
    try {
      const poll = await fallbackStore.vote(num, optionId);
      return res.status(200).json({ ok: true, poll });
    } catch (e) {
      if (e.code === "already_voted") return res.status(409).json({ error: "already_voted" });
      return res.status(400).json({ error: e.message || "invalid" });
    }
  }

  try {
    // check already voted
    const existing = await db.collection("votes").findOne({ number: num });
    if (existing) return res.status(409).json({ error: "already_voted" });

    const pollDoc = await db.collection("poll").findOne({});
    if (!pollDoc) return res.status(500).json({ error: "poll_not_found" });

    const filter = { _id: pollDoc._id, "options.id": optionId };
    const update = { $inc: { "options.$.votes": 1 } };
    const result = await db.collection("poll").findOneAndUpdate(filter, update, { returnDocument: "after" });
    if (!result.value) return res.status(400).json({ error: "option_not_found" });

    await db.collection("votes").insertOne({ pollId: pollDoc._id, number: num, optionId, votedAt: new Date() });

    const updated = result.value;
    return res.status(200).json({ ok: true, poll: { id: updated._1?.toString ? updated._1.toString() : updated._id.toString(), title: updated.title, description: updated.description, options: updated.options }});
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "server_error" });
  }
}
