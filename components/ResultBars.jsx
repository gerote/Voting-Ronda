import React, { useEffect, useState } from "react";
import clsx from "clsx";

export default function ResultBars({ poll }) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    // trigger animation after mount
    const t = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(t);
  }, [poll]);

  const total = poll.options.reduce((s, o) => s + (o.votes || 0), 0) || 0;

  return (
    <div className="space-y-3">
      {poll.options.map((o) => {
        const pct = total ? Math.round(((o.votes || 0) / total) * 100) : 0;
        return (
          <div key={o.id}>
            <div className="flex justify-between mb-1">
              <div className="text-sm font-medium text-slate-700">{o.label}</div>
              <div className="text-sm text-slate-500">{o.votes || 0} ({pct}%)</div>
            </div>
            <div className="w-full bg-slate-100 h-4 rounded overflow-hidden">
              <div
                className={clsx("h-full bg-accent rounded transition-all duration-900")}
                style={{ width: animated ? `${pct}%` : "0%" }}
              />
            </div>
          </div>
        );
      })}
      <div className="text-xs text-slate-500 mt-2">Total suara: {total}</div>
    </div>
  );
}
