"use client"

import { useState } from "react";

export default function Home() {
  const [usage, setUsage] = useState("");
  const [build, setBuild] = useState(null);

  const handleGenerate = async () => {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usage }),
    });
    const data = await res.json();
    setBuild(data.build);
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">PC Builder AI</h1>

      <input
        type="text"
        placeholder="How will you use your PC?"
        value={usage}
        onChange={(e) => setUsage(e.target.value)}
        className="border p-2 mb-4 w-full rounded"
      />

      <button
        onClick={handleGenerate}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Generate Build
      </button>

      {build && (
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Recommended PC Build:</h2>
          <ul className="list-disc list-inside space-y-1">
            {Object.entries(build).map(([component, value]) => (
              <li key={component}>
                <strong>{component}:</strong> {Array.isArray(value) ? value.join(", ") : value}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
