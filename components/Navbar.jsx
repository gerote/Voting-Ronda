import React from "react";
import Link from "next/link";
import Logo from "./Logo";

export default function Navbar() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto flex items-center justify-between py-3 px-4">
        <Link href="/">
          <a className="flex items-center gap-3">
            <Logo className="w-10 h-10" />
            <div>
              <div className="text-lg font-semibold text-slate-800">Voting Ronda rt 1</div>
              <div className="text-xs text-slate-500">silakan Vote sesuai yang anda inginkan. untuk kemajuan Rt kita.</div>
            </div>
          </a>
        </Link>
      </div>
    </header>
  );
}
