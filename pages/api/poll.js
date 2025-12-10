import { getDb } from "../../utils/mongodb";
import fallbackStore from "../../utils/fallbackStore";
import { ObjectId } from "mongodb";

async function getPollFromDb(db) {
  const doc = await db.collection("poll").findOne({});
  if (!doc) return null;
  return {
    id: doc._id.toString(),
    title: doc.title,
    description: doc.description,
    options: doc.options,
    createdAt: doc.createdAt
  };
}

export default async function handler(req, res) {
  const db = await getDb();
  if (req.method === "GET") {
    if (!db) {
      const p = await fallbackStore.getPoll();
      return res.status(200).json({ poll: p });
    }
    const poll = await getPollFromDb(db);
    if (!poll) {
      // seed default poll
      const now = new Date();
      const opts = [
        { id: String(Date.now()) + "-1", label: "ya lanjut", votes: 0 },
        { id: String(Date.now()) + "-2", label: "tidak lanjut", votes: 0 }
      ];
      const r = await db.collection("poll").insertOne({ title: "Voting Ronda rt 1", description: "silakan Vote sesuai yang anda inginkan. untuk kemajuan Rt kita.", options: opts, createdAt: now });
      const pdoc = await db.collection("poll").findOne({ _id: r.insertedId });
      return res.status(200).json({ poll: { id: pdoc._id.toString(), title: pdoc.title, description: pdoc.description, options: pdoc.options, createdAt: pdoc.createdAt }});
    }
    return res.status(200).json({ poll });
  }

  res.setHeader("Allow", ["GET"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
