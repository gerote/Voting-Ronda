import React from "react";

export default function Logo({ className = "w-12 h-12", alt = "logo" }) {
  return (
    <div className={className} role="img" aria-label={alt}>
      <img src="/logo.png" alt={alt} className="w-full h-full object-contain" />
    </div>
  );
}
