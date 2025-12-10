import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import useSWR from "swr";
import ResultBars from "../components/ResultBars";
import Fireworks from "../components/Fireworks";

export default function VotePage() {
  const router = useRouter();
  const [number, setNumber] = useState(null);
  const { data, error, mutate } = useSWR("/api/poll");
  const [submitting, setSubmitting] = useState(false);
  const [showThanks, setShowThanks] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    const n = localStorage.getItem("voter_number");
    if (!n) {
      router.push("/").catch(()=>{});
    } else {
      setNumber(n);
    }
  }, [router]);

  if (error) return <div className="p-4 bg-red-50 text-red-700 rounded">Gagal memuat poll.</div>;
  if (!data) return <div className="grid gap-4 md:grid-cols-2"><div className="p-4 card animate-pulse h-36" /></div>;

  const poll = data.poll;

  async function handleVote(optionId) {
    setErrorMsg(null);
    setSubmitting(true);
    try {
      const res = await axios.post("/api/vote", { number, optionId });
      // success -> show fireworks + thanks + update results
      setShowThanks(true);
      // refresh poll data from server
      await mutate();
      // hide fireworks after 3.5s
      setTimeout(() => setShowThanks(false), 3500);
    } catch (err) {
      const code = err?.response?.data?.error;
      if (code === "already_voted") {
        setErrorMsg("Nomor ini sudah melakukan vote.");
        // refresh poll
        await mutate();
      } else if (code === "number_not_allowed") {
        setErrorMsg("Nomor tidak terdaftar.");
      } else {
        setErrorMsg("Gagal mengirim vote, coba lagi.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="card p-4">
        <h2 className="text-lg font-semibold mb-1">{poll.title}</h2>
        <p className="text-sm text-slate-600 mb-4">{poll.description}</p>

        <div className="space-y-3">
          {poll.options.map(o => (
            <button
              key={o.id}
              disabled={submitting}
              onClick={() => handleVote(o.id)}
              className="w-full text-left px-4 py-3 border rounded-md hover:bg-slate-50 transition flex justify-between items-center"
            >
              <div className="font-medium">{o.label}</div>
              <div className="text-sm text-slate-500">{o.votes || 0}</div>
            </button>
          ))}
        </div>

        {errorMsg && <div className="mt-3 text-sm text-red-600">{errorMsg}</div>}
      </div>

      <div className="card p-4">
        <h3 className="text-md font-semibold mb-3">Hasil</h3>
        <ResultBars poll={poll} />
      </div>

      {showThanks && <Fireworks />}
    </div>
  );
}
