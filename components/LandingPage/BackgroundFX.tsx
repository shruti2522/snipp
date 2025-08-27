"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const BackgroundFX: React.FC = () => {
  const cards = Array.from({ length: 18 }).map((_, i) => ({
    left: `${(i * 11.7) % 100}%`,
    bottom: `${(i * 7.9) % 100}%`,
    width: [120, 140, 160][i % 3],
    height: [60, 68, 76][(i + 1) % 3],
    delay: i * 0.35,
    duration: 18 + (i % 5) * 3,
    rotate: i % 2 === 0 ? 3 : -3,
    yTravel: 220 + (i % 4) * 40,
  }));

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Dimmed background image */}
      <div className="hidden md:block absolute inset-0">
        <Image
          className="object-cover opacity-20"
          src="/hero.png"
          alt=""
          fill
          sizes="100vw"
          priority
        />
      </div>

      {/* Gradient blobs */}
      <motion.div
        aria-hidden
        className="absolute -top-32 -left-32 h-96 w-96 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(40% 40% at 50% 50%, rgba(99,102,241,0.55) 0%, rgba(147,51,234,0.35) 35%, rgba(14,17,22,0) 70%)",
        }}
        animate={{ x: [0, 20, -10, 0], y: [0, -10, 10, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="absolute -bottom-24 -right-24 h-[28rem] w-[28rem] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(40% 40% at 50% 50%, rgba(147,51,234,0.45) 0%, rgba(59,130,246,0.30) 35%, rgba(14,17,22,0) 70%)",
        }}
        animate={{ x: [0, -20, 10, 0], y: [0, 15, -15, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Sync orbits */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.svg
          width="900"
          height="900"
          viewBox="0 0 900 900"
          className="opacity-25"
          aria-hidden
        >
          <defs>
            <radialGradient id="ringGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#9333ea" stopOpacity="0.1" />
            </radialGradient>
          </defs>
          {[220, 280, 340].map((r, i) => (
            <motion.circle
              key={r}
              cx="450"
              cy="450"
              r={r}
              fill="none"
              stroke="url(#ringGrad)"
              strokeWidth={i === 1 ? 1.5 : 1}
              strokeDasharray={i === 1 ? "6 10" : "4 12"}
              initial={{ rotate: 0 }}
              animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
              style={{ originX: 450, originY: 450 }}
              transition={{
                repeat: Infinity,
                ease: "linear",
                duration: 80 - i * 10,
              }}
            />
          ))}

          {/* Tiny nodes */}
          {[...Array(16)].map((_, idx) => (
            <motion.circle
              key={idx}
              cx={450 + Math.cos((idx / 16) * Math.PI * 2) * 340}
              cy={450 + Math.sin((idx / 16) * Math.PI * 2) * 340}
              r={2.2}
              fill="#a78bfa"
              initial={{ opacity: 0.4, scale: 0.8 }}
              animate={{
                opacity: [0.4, 1, 0.4],
                scale: [0.8, 1.1, 0.8],
              }}
              transition={{ duration: 4 + (idx % 5), repeat: Infinity }}
            />
          ))}
        </motion.svg>
      </div>

      {/* Grid */}
      <div className="absolute inset-0 opacity-[0.10]">
        <svg
          className="w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden
        >
          <defs>
            <pattern
              id="grid"
              width="10"
              height="10"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 10 0 L 0 0 0 10"
                fill="none"
                stroke="#93c5fd"
                strokeWidth="0.25"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
    </div>
  );
};

export default BackgroundFX;
