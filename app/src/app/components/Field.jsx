"use client";

export default function Field({ label, children }) {
  return (
    <div className="mb-6">
      <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-3">
        {label}
      </label>
      {children}
    </div>
  );
}