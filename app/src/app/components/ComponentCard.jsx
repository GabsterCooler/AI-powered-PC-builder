"use client";

import { motion } from "framer-motion";
import { FaMicrochip, FaMemory, FaHdd, FaDesktop, FaBolt, FaVideo } from "react-icons/fa";

const icons = {
  CPU: <FaMicrochip className="text-[#C6A75E]" />,
  GPU: <FaVideo className="text-[#C6A75E]" />,
  RAM: <FaMemory className="text-[#C6A75E]" />,
  Storage: <FaHdd className="text-[#C6A75E]" />,
  Motherboard: <FaDesktop className="text-[#C6A75E]" />,
  PSU: <FaBolt className="text-[#C6A75E]" />,
};

export default function ComponentCard({ component, value }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative bg-[#18181C] border border-white/5 p-8 rounded-3xl flex items-center gap-6 hover:border-[#C6A75E]/40 transition-all duration-500"
    >
      <div className="text-3xl">{icons[component]}</div>
      <div className="flex-1">
        <h3 className="uppercase tracking-widest text-xs text-[#C6A75E]">{component}</h3>
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