"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Spinner from "./components/Spinner";
import AnimatedNumber from "./components/AnimatedNumber";
import CustomSelect from "./components/CustomSelect";
import ComponentCard from "./components/ComponentCard";
import Toast from "./components/Toast";
import Field from "./components/Field";

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
  const [copied, setCopied] = useState(false);

  const handleChange = ({ target: { name, value } }) => {
    setForm((prev) => ({
      ...prev,
      [name]: name === "budget" ? (value === "" ? "" : Math.max(0, Number(value))) : value,
    }));
  };

  const handleGenerate = async () => {
    if (Object.values(form).some((v) => !v)) {
      setError("Please complete all configuration fields.");
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
      if (data?.error) setError(data.error);
      else setBuild(data.build || data);
    } catch {
      setError("Unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = build
    ? Object.values(build).reduce((sum, item) => {
        const price = Number(item?.price);
        return isNaN(price) ? sum : sum + price;
      }, 0)
    : 0;

  const handleCopy = () => {
    if (!build) return;
    const formatted = Object.entries(build)
      .map(
        ([key, item]) =>
          `${key}: ${item?.name || "Not Found"} (${
            item?.price === "Unknown" ? "Price Unknown" : `$${item.price}`
          })`
      )
      .join("\n");
    navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section
      className="relative flex flex-col items-center min-h-screen"
      style={{ backgroundImage: `radial-gradient(circle at center, #000 30%, #3b3a3a 45%, #000 75%)` }}
    >
      <div className="relative z-10 max-w-7xl px-8 py-16 w-full">
        <div className="mb-16">
          <h1 className="text-5xl font-light tracking-tight text-white">
            PC Builder <span className="text-[#C6A75E]">AI</span>
          </h1>
          <p className="text-zinc-400 mt-4 max-w-xl">
            Intelligent hardware configurations tailored to your performance goals.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-16 text-white">
          <div className="lg:col-span-1 bg-[#121216] border border-white/5 p-10 rounded-3xl h-fit">
            <CustomSelect
              label="Usage"
              value={form.usage}
              onChange={(val) => setForm((prev) => ({ ...prev, usage: val }))}
              options={[
                { value: "gaming", label: "Gaming" },
                { value: "work", label: "Work / Office" },
                { value: "video_editing", label: "Video Editing" },
                { value: "3d", label: "3D / Rendering" },
                { value: "streaming", label: "Streaming" },
                { value: "general", label: "General Use" },
              ]}
            />

            <Field label="Budget ($)">
              <input
                name="budget"
                type="number"
                value={form.budget}
                onChange={handleChange}
                className="bg-[#121216] border border-white/10 text-white p-3 rounded-xl w-full focus:border-[#C6A75E] transition"
              />
            </Field>

            <CustomSelect
              label="Resolution"
              value={form.resolution}
              onChange={(val) => setForm((prev) => ({ ...prev, resolution: val }))}
              options={[
                { value: "1080p", label: "1080p" },
                { value: "1440p", label: "1440p" },
                { value: "4k", label: "4K" },
              ]}
            />

            <CustomSelect
              label="Performance"
              value={form.performance}
              onChange={(val) => setForm((prev) => ({ ...prev, performance: val }))}
              options={[
                { value: "best_value", label: "Best Value" },
                { value: "high_end", label: "High End" },
                { value: "future_proof", label: "Future Proof" },
              ]}
            />

            <button
              onClick={handleGenerate}
              disabled={loading}
              className={`w-full mt-6 bg-[#C6A75E] text-black font-medium py-3 rounded-full tracking-wide transition-all duration-300 
                hover:bg-[#d4b56f] hover:shadow-[0_0_40px_rgba(198,167,94,0.4)] active:scale-95 
                flex justify-center items-center gap-2 ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              {loading ? <Spinner /> : "Generate Build"}
            </button>

            {error && <div className="mt-6 text-sm text-red-400">{error}</div>}
          </div>

          <div className="lg:col-span-2 flex flex-col items-center w-full">
            {loading ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#121216] border border-[#C6A75E]/30 p-10 rounded-3xl w-full text-center"
              >
                <p className="text-white text-xl font-medium">
                  The AI is building your PC...
                </p>
              </motion.div>
            ) : (
              build && (
                <>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#121216] border border-[#C6A75E]/30 p-10 rounded-3xl mb-8 w-full"
                  >
                    <p className="text-zinc-500 uppercase tracking-widest text-sm">
                      Total Price
                    </p>
                    <p className="text-5xl font-light mt-4 text-white drop-shadow-[0_0_4px_#C6A75E]">
                      $<AnimatedNumber value={totalPrice} decimals={2} />
                    </p>
                    <button
                      onClick={handleCopy}
                      className="mt-6 text-sm text-[#C6A75E] hover:underline"
                    >
                      Copy Build Summary
                    </button>
                  </motion.div>

                  <h2 className="text-2xl font-semibold text-white mb-4 drop-shadow-[0_0_4px_#C6A75E]">
                    Build
                  </h2>

                  <div
                    className="max-h-[600px] overflow-y-auto space-y-6 pr-2 w-full"
                    style={{ scrollbarWidth: "thin", scrollbarColor: "#C6A75E #121216" }}
                  >
                    {Object.entries(build).map(([component, value]) => (
                      <ComponentCard key={component} component={component} value={value} />
                    ))}
                  </div>
                </>
              )
            )}
          </div>
        </div>
      </div>

      <Toast show={copied} message="Build copied to clipboard" />
    </section>
  );
}