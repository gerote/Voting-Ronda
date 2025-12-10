import { getDb } from "../../utils/mongodb";
import fallbackStore from "../../utils/fallbackStore";
import { allowedListFromEnv, normalizeNumber } from "../../utils/allowedNumbers";

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT = process.env.TELEGRAM_CHAT_ID;

function maskNumber(num) {
  if (!num) return "";
  // show only last 4 digits, mask rest
  return num.replace(/\d(?=\d{4})/g, "*");
}

async function sendTelegramMessage(text) {
  if (!TELEGRAM_TOKEN || !TELEGRAM_CHAT) return;
  try {
    // Node 18+ has global fetch on Vercel
    await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: TELEGRAM_CHAT, text, parse_mode: "HTML" })
    });
  } catch (e) {
    console.error("Telegram notify failed:", e?.message || e);
  }
}

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

      // send telegram (fallback)
      const opt = poll.options.find((o) => o.id === optionId);
      const label = opt ? opt.label : optionId;
      const text = `Vote (fallback): <b>${label}</b>\nVoter: ${maskNumber(num)}\nTotal: ${opt?.votes || 0}`;
      sendTelegramMessage(text).catch(() => {});

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

    // find option label & votes after update
    const opt = updated.options.find((o) => o.id === optionId);
    const label = opt ? opt.label : optionId;
    const votesCount = opt?.votes || 0;

    // send telegram
    const text = `Vote: <b>${label}</b>\nVoter: ${maskNumber(num)}\nTotal: ${votesCount}`;
    sendTelegramMessage(text).catch(() => {});

    return res.status(200).json({
      ok: true,
      poll: {
        id: updated._id.toString(),
        title: updated.title,
        description: updated.description,
        options: updated.options
      }
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "server_error" });
  }
}
