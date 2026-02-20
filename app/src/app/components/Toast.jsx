"use client";

import { motion, AnimatePresence } from "framer-motion";

export default function Toast({ show, message }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-10 right-10 bg-[#18181C] border border-[#C6A75E]/30 px-6 py-4 rounded-xl shadow-2xl flex items-center justify-center text-white"
        >
          <span className="text-sm font-medium">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}