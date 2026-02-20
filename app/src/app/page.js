"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Listbox } from "@headlessui/react";
import {
  FaMicrochip,
  FaMemory,
  FaHdd,
  FaDesktop,
  FaBolt,
  FaVideo,
  FaChevronDown,
} from "react-icons/fa";

const icons = {
  CPU: <FaMicrochip className="text-[#C6A75E]" />,
  GPU: <FaVideo className="text-[#C6A75E]" />,
  RAM: <FaMemory className="text-[#C6A75E]" />,
  Storage: <FaHdd className="text-[#C6A75E]" />,
  Motherboard: <FaDesktop className="text-[#C6A75E]" />,
  PSU: <FaBolt className="text-[#C6A75E]" />,
};

const inputStyles =
  "bg-[#121216] border border-white/10 text-white p-3 rounded-xl w-full focus:border-[#C6A75E] transition";

function Spinner() {
  return (
    <motion.div
      className="w-5 h-5 border-2 border-t-transparent border-black rounded-full"
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
    />
  );
}

function AnimatedNumber({ value, duration = 0.5, decimals = 0 }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const end = Number(value);
    const totalFrames = duration * 60;
    let frame = 0;

    const interval = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const randomOffset = Math.random() * end * 0.1;
      const current =
        Math.floor(end * progress + randomOffset * (1 - progress) * 100) / 100;

      setDisplay(current);

      if (frame >= totalFrames) {
        setDisplay(end);
        clearInterval(interval);
      }
    }, 1000 / 60);

    return () => clearInterval(interval);
  }, [value, duration]);

  return (
    <span>
      {display.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
    </span>
  );
}

function Field({ label, children }) {
  return (
    <div className="mb-6">
      <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-3">
        {label}
      </label>
      {children}
    </div>
  );
}

function CustomSelect({ label, value, onChange, options }) {
  return (
    <Field label={label}>
      <Listbox value={value} onChange={onChange}>
        <div className="relative">
          <Listbox.Button className="w-full bg-[#121216] border border-white/10 rounded-xl p-3 text-left flex justify-between items-center focus:outline-none focus:border-[#C6A75E] transition-all">
            <span>{value ? options.find((o) => o.value === value)?.label : "Select"}</span>
            <FaChevronDown className="text-[#C6A75E]" />
          </Listbox.Button>
          <Listbox.Options className="absolute mt-2 w-full bg-[#18181C] border border-white/10 rounded-xl shadow-lg max-h-60 overflow-auto z-10">
            {options.map((option) => (
              <Listbox.Option
                key={option.value}
                value={option.value}
                className={({ active, selected }) =>
                  `cursor-pointer select-none p-3 ${active ? "bg-[#C6A75E]/20 text-[#C6A75E]" : "text-white"
                  } ${selected ? "font-medium" : "font-normal"}`
                }
              >
                {option.label}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>
    </Field>
  );
}

function ComponentCard({ component, value }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative bg-[#18181C] border border-white/5 p-8 rounded-3xl flex items-center gap-6 hover:border-[#C6A75E]/40 transition-all duration-500"
    >
      <div className="text-3xl">{icons[component]}</div>
      <div className="flex-1">
        <h3 className="uppercase tracking-widest text-xs text-[#C6A75E]">
          {component}
        </h3>
        <p className="text-lg mt-2 font-light text-white line-clamp-3 leading-relaxed">
          {value?.name || "Not Found"}
        </p>
      </div>
      {value?.price !== undefined && (
        <div className="text-[#C6A75E] text-lg font-medium">
          {value.price === "Unknown" ? "Price Unknown" : `$${value.price}`}
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
      console.log("API response:", data);
      if (data?.error) setError(data.error);
      else setBuild(data.build || data);
    } catch (err) {
      console.error(err);
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
          `${key}: ${item?.name || "Not Found"} (${item?.price === "Unknown" ? "Price Unknown" : `$${item.price}`
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
      style={{
        backgroundImage: `radial-gradient(circle at center, #000 30%, #3b3a3a 45%, #000 75%)`,
      }}
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
                className={inputStyles}
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
              {loading ? (
                <>
                  <Spinner /> Generating...
                </>
              ) : (
                "Generate Build"
              )}
            </button>

            {error && <div className="mt-6 text-sm text-red-400">{error}</div>}
          </div>

          <div className="lg:col-span-2 flex flex-col items-center">
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
                    style={{
                      scrollbarWidth: "thin",
                      scrollbarColor: "#C6A75E #121216",
                    }}
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

      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-10 right-10 bg-[#18181C] border border-[#C6A75E]/30 px-6 py-4 rounded-xl shadow-2xl flex items-center justify-center text-white"
          >
            <span className="text-sm font-medium">Build copied to clipboard</span>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}