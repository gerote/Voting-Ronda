// Minimal in-memory store when MONGODB_URI is not provided.
// Not persistent across server restarts. Suitable for local/dev quick start.
import { v4 as uuidv4 } from "uuid";

const store = {
  poll: null,
  voters: new Set() // store numbers that voted
};

function init() {
  if (!store.poll) {
    const id = uuidv4();
    const opt1 = { id: uuidv4(), label: "ya lanjut", votes: 0 };
    const opt2 = { id: uuidv4(), label: "tidak lanjut", votes: 0 };
    store.poll = {
      id,
      title: "Voting Ronda rt 1",
      description: "silakan Vote sesuai yang anda inginkan. untuk kemajuan Rt kita.",
      options: [opt1, opt2],
      createdAt: new Date().toISOString()
    };
  }
}

init();

export default {
  async getPoll() {
    return store.poll;
  },
  async vote(number, optionId) {
    if (store.voters.has(number)) {
      const err = new Error("already_voted");
      err.code = "already_voted";
      throw err;
    }
    const opt = store.poll.options.find(o => o.id === optionId);
    if (!opt) throw new Error("option_not_found");
    opt.votes = (opt.votes || 0) + 1;
    store.voters.add(number);
    return store.poll;
  },
  async hasVoted(number) {
    return store.voters.has(number);
  },
  async reset() {
    store.poll.options.forEach(o => (o.votes = 0));
    store.voters.clear();
  }
};
