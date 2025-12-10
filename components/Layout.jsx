import React from "react";
import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="container mx-auto w-full py-8 px-4">{children}</main>
      <footer className="w-full mt-auto py-6 text-center text-sm text-slate-600">
        © {new Date().getFullYear()} Voting Ronda RT 1
      </footer>
    </div>
  );
}
