"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaMicrochip, FaMemory, FaHdd, FaDesktop, FaBolt, FaVideo } from "react-icons/fa";

const icons = {
  CPU: <FaMicrochip className="text-blue-600" />,
  GPU: <FaVideo className="text-red-500" />,
  RAM: <FaMemory className="text-green-600" />,
  Storage: <FaHdd className="text-yellow-600" />,
  Motherboard: <FaDesktop className="text-purple-600" />,
  PSU: <FaBolt className="text-orange-600" />,
};

const inputStyles =
  "bg-white text-gray-900 border border-gray-300 p-2 rounded w-full shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none";

const labelStyles =
  "block mb-2 font-semibold text-gray-700";

const primaryButton =
  "bg-blue-600 text-white px-6 py-3 rounded text-lg font-semibold transition-transform hover:scale-105 hover:shadow-xl";

const cardStyles =
  "bg-white p-5 rounded-xl shadow-lg border-l-4 border-blue-500 flex items-center gap-4 will-change-transform";

function Field({ label, children }) {
  return (
    <div>
      <label className={labelStyles}>{label}</label>
      {children}
    </div>
  );
}

function ComponentCard({ component, value }) {
  return (
    <motion.div
      className={cardStyles}
      whileHover={{ scale: 1.05 }}
    >
      <div className="text-3xl">{icons[component]}</div>

      <div className="flex-1">
        <h3 className="font-bold text-lg mb-1 text-blue-600">
          {component}
        </h3>
        <p className="text-gray-700">{value?.name || "Not Found"}</p>
      </div>

      {value?.price !== undefined && (
        <div className="bg-blue-500 text-white font-semibold px-3 py-1 rounded-full text-sm shadow-md">
          {value.price === "Unknown"
            ? "Price Unknown"
            : `$${value.price}`}
        </div>
      )}
    </motion.div>
  );
}


export default function Home() {
  const [form, setForm] = useState({
    usage: "",
    budget: "",
    resolution: "",
    performance: "",
  });

  const [build, setBuild] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = ({ target: { name, value } }) => {
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "budget"
          ? value === ""
            ? ""
            : Math.max(0, Number(value))
          : value,
    }));
  };

  const handleGenerate = async () => {
    if (Object.values(form).some(v => !v)) {
      setError("Please fill out all fields before generating a build.");
      setBuild(null);
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data?.error) {
        setError(data.error);
        setBuild(null);
      } else {
        setBuild(data.build);
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setBuild(null);
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = build
    ? Object.values(build).reduce((sum, item) => {
      const price = Number(item?.price);
      return isNaN(price) ? sum : sum + price;
    }, 0) : 0;

  const handleCopy = () => {
    if (!build) return;

    const formatted = Object.entries(build)
      .map(([key, item]) =>
        `${key}: ${item?.name || "Not Found"} (${item?.price === "Unknown" ? "Price Unknown" : `$${item.price}`})`
      )
      .join("\n");

    navigator.clipboard.writeText(formatted);
    alert("Build copied to clipboard!");
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <h1 className="text-4xl font-bold mb-6 text-center text-blue-700 drop-shadow-lg">
        🚀 PC Builder AI
      </h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleGenerate();
        }}
      >
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <Field label="Usage">
            <select
              name="usage"
              value={form.usage}
              onChange={handleChange}
              className={inputStyles}
            >
              <option value="">Select usage</option>
              <option value="gaming">Gaming</option>
              <option value="work">Work / Office</option>
              <option value="video_editing">Video Editing</option>
              <option value="3d">3D / Rendering</option>
              <option value="streaming">Streaming</option>
              <option value="general">General Use</option>
            </select>
          </Field>

          <Field label="Budget ($)">
            <input
              name="budget"
              type="number"
              value={form.budget}
              onChange={handleChange}
              placeholder="Max"
              className={inputStyles}
            />
          </Field>

          <Field label="Resolution">
            <select
              name="resolution"
              value={form.resolution}
              onChange={handleChange}
              className={inputStyles}
            >
              <option value="">Select resolution</option>
              <option value="1080p">1080p</option>
              <option value="1440p">1440p</option>
              <option value="4k">4K</option>
            </select>
          </Field>

          <Field label="Performance">
            <select
              name="performance"
              value={form.performance}
              onChange={handleChange}
              className={inputStyles}
            >
              <option value="">Select</option>
              <option value="best_value">Best Value</option>
              <option value="high_end">High End</option>
              <option value="future_proof">Future Proof</option>
            </select>
          </Field>
        </div>

        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <button
            type="submit"
            disabled={loading}
            className={`${primaryButton} ${loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
          >
            {loading ? "Generating..." : "Generate Build"}
          </button>

          {build && (
            <button
              type="button"
              onClick={handleCopy}
              className="bg-green-500 text-white px-4 py-2 rounded text-lg font-semibold hover:scale-105 hover:shadow-lg transition-transform"
            >
              Copy Build
            </button>
          )}
        </div>
      </form>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-red-100 text-red-700 p-4 rounded mb-4 text-center font-medium shadow-md"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {build && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-right text-xl font-bold mb-4 text-gray-800"
        >
          Total: ${totalPrice.toFixed(2)}
        </motion.div>
      )}

      <AnimatePresence>
        {build && (
          <motion.div
            key="build"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="grid md:grid-cols-2 gap-6"
          >
            {Object.entries(build).map(([component, value]) => (
              <ComponentCard
                key={component}
                component={component}
                value={value}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}