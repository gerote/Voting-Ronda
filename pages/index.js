import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Logo from "../components/Logo";

export default function Login() {
  const [number, setNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    try {
      const res = await axios.post("/api/validate-number", { number });
      if (res?.data?.alreadyVoted) {
        // store number locally and navigate to vote page to show results (they already voted)
        localStorage.setItem("voter_number", number.replace(/\s+/g, ""));
        router.push("/vote");
        return;
      }
      // proceed to vote
      localStorage.setItem("voter_number", number.replace(/\s+/g, ""));
      router.push("/vote");
    } catch (err) {
      const code = err?.response?.data?.error;
      if (code === "number_not_allowed") setMsg("Nomor tidak terdaftar untuk voting.");
      else setMsg("Terjadi kesalahan. Cek nomor atau hub admin.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="card p-6 flex gap-4 items-center">
        <div className="w-24">
          <Logo className="w-20 h-20" />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Voting Ronda rt 1</h1>
          <p className="text-sm text-slate-600">silakan Vote sesuai yang anda inginkan. untuk kemajuan Rt kita.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card p-6 mt-6">
        <label className="block text-sm font-medium">Masukan Nomor Anda</label>
        <input
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          className="mt-2 w-full border rounded px-3 py-2"
          placeholder="contoh: 08123456789"
        />
        <div className="mt-4 flex items-center gap-3">
          <button type="submit" disabled={loading} className="px-4 py-2 rounded bg-accent text-white">
            {loading ? "Memeriksa..." : "Masuk / Vote"}
          </button>
        </div>

        {msg && <div className="mt-3 text-sm text-red-600">{msg}</div>}
      </form>
    </div>
  );
}
