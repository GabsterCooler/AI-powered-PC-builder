"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaMicrochip, FaMemory, FaHdd, FaDesktop, FaBolt, FaVideo } from "react-icons/fa";

export default function Home() {
  const [form, setForm] = useState({
    usage: "",
    overallBudget: "",
    resolution: "",
    performance: "",
  });

  const [build, setBuild] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "overallBudget"
          ? value === ""
            ? ""
            : Math.max(0, Number(value))
          : value,
    }));
  };

  const handleGenerate = async () => {
    const emptyFields = Object.entries(form).filter(([_, value]) => !value);
    if (emptyFields.length > 0) {
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
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setBuild(null);
    } finally {
      setLoading(false);
    }
  };

  const icons = {
    CPU: <FaMicrochip className="text-blue-600" />,
    GPU: <FaVideo className="text-red-500" />,
    RAM: <FaMemory className="text-green-600" />,
    Storage: <FaHdd className="text-yellow-600" />,
    Motherboard: <FaDesktop className="text-purple-600" />,
    PSU: <FaBolt className="text-orange-600" />,
  };

  const totalPrice = useMemo(() => {
    if (!build) return 0;
    return Object.values(build).reduce((sum, item) => {
      if (item?.price && item.price !== "Unknown") return sum + Number(item.price);
      return sum;
    }, 0);
  }, [build]);

  const handleCopy = () => {
    if (!build) return;
    const formatted = Object.entries(build)
      .map(
        ([key, item]) =>
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

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block mb-2 font-semibold text-gray-700">Usage</label>
          <select
            name="usage"
            value={form.usage}
            onChange={handleChange}
            className="border p-2 rounded w-full shadow-sm focus:ring-2 focus:ring-blue-400 transition"
          >
            <option value="">Select usage</option>
            <option value="gaming">Gaming</option>
            <option value="work">Work / Office</option>
            <option value="video_editing">Video Editing</option>
            <option value="3d">3D / Rendering</option>
            <option value="streaming">Streaming</option>
            <option value="general">General Use</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 font-semibold text-gray-700">Budget ($)</label>
          <input
            name="overallBudget"
            type="number"
            value={form.overallBudget}
            onChange={handleChange}
            placeholder="Max"
            className="border p-2 rounded w-full shadow-sm focus:ring-2 focus:ring-blue-400 transition"
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold text-gray-700">Resolution</label>
          <select
            name="resolution"
            value={form.resolution}
            onChange={handleChange}
            className="border p-2 rounded w-full shadow-sm focus:ring-2 focus:ring-blue-400 transition"
          >
            <option value="">Select resolution</option>
            <option value="1080p">1080p</option>
            <option value="1440p">1440p</option>
            <option value="4k">4K</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 font-semibold text-gray-700">Performance</label>
          <select
            name="performance"
            value={form.performance}
            onChange={handleChange}
            className="border p-2 rounded w-full shadow-sm focus:ring-2 focus:ring-blue-400 transition"
          >
            <option value="">Select</option>
            <option value="best_value">Best Value</option>
            <option value="high_end">High End</option>
            <option value="future_proof">Future Proof</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
        <button
          onClick={handleGenerate}
          disabled={loading}
          className={`bg-blue-600 text-white px-6 py-3 rounded w-full md:w-auto text-lg font-semibold transition-transform hover:scale-105 hover:shadow-xl ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Generating..." : "Generate Build"}
        </button>

        {build && (
          <button
            onClick={handleCopy}
            className="bg-green-500 text-white px-4 py-2 rounded w-full md:w-auto text-lg font-semibold transition-transform hover:scale-105 hover:shadow-lg"
          >
            Copy Build
          </button>
        )}
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-100 text-red-700 p-4 rounded mb-4 text-center font-medium shadow-md"
        >
          {error}
        </motion.div>
      )}

      {build && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
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
            exit={{ opacity: 0, y: 20 }}
            className="grid md:grid-cols-2 gap-6"
          >
            {Object.entries(build).map(([component, value]) => (
              <motion.div
                key={component}
                className="bg-white p-5 rounded-xl shadow-lg border-l-4 border-blue-500 relative overflow-hidden flex items-center gap-4"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-3xl">{icons[component]}</div>

                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1 text-blue-600">{component}</h3>
                  <p className="text-gray-700">{value?.name || "Not Found"}</p>
                </div>

                {value && value.price !== undefined && (
                  <div className="bg-blue-500 text-white font-semibold px-3 py-1 rounded-full text-sm shadow-md">
                    {value.price === "Unknown" ? "Price Unknown" : `$${value.price}`}
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
