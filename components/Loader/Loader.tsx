"use client";

import { motion } from "framer-motion";

export default function PageLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 pointer-events-none">
      {/* Animated loader */}
      <motion.div
        className="w-16 h-16 rounded-full border-4 border-t-blue-500 border-blue-300"
        animate={{ rotate: 360 }}
        transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}
