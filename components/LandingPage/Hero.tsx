"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const BackgroundFX: React.FC = () => {
  // Generate a stable set of cards
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
      {/* 1) Dimmed background image (kept from original) */}
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

      {/* 2) Soft gradient blobs */}
      <motion.div
        aria-hidden
        className="absolute -top-32 -left-32 h-96 w-96 rounded-full blur-3xl"
        style={{ background:
          "radial-gradient(40% 40% at 50% 50%, rgba(99,102,241,0.55) 0%, rgba(147,51,234,0.35) 35%, rgba(14,17,22,0) 70%)" }}
        animate={{ x: [0, 20, -10, 0], y: [0, -10, 10, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="absolute -bottom-24 -right-24 h-[28rem] w-[28rem] rounded-full blur-3xl"
        style={{ background:
          "radial-gradient(40% 40% at 50% 50%, rgba(147,51,234,0.45) 0%, rgba(59,130,246,0.30) 35%, rgba(14,17,22,0) 70%)" }}
        animate={{ x: [0, -20, 10, 0], y: [0, 15, -15, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* 3) Sync orbits (SVG dashed rings rotating in opposite directions) */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.svg
          width="900" height="900" viewBox="0 0 900 900"
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
              transition={{ repeat: Infinity, ease: "linear", duration: 80 - i * 10 }}
            />
          ))}

          {/* Tiny nodes around the ring to hint at bidirectional sync */}
          {[...Array(16)].map((_, idx) => (
            <motion.circle
              key={idx}
              cx={450 + Math.cos((idx / 16) * Math.PI * 2) * 340}
              cy={450 + Math.sin((idx / 16) * Math.PI * 2) * 340}
              r={2.2}
              fill="#a78bfa"
              initial={{ opacity: 0.4, scale: 0.8 }}
              animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.1, 0.8] }}
              transition={{ duration: 4 + (idx % 5), repeat: Infinity }}
            />
          ))}
        </motion.svg>
      </div>

      {/* Subtle corner grid to imply structure */}
      <div className="absolute inset-0 opacity-[0.10]">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#93c5fd" strokeWidth="0.25" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
    </div>
  );
};

const Hero: React.FC = () => {
  const [menu, setMenu] = useState<boolean>(false);

  return (
    <>
      <div className="relative w-full min-h-screen bg-gradient-to-br from-[#0E1116] via-[#1A1D29] to-[#0E1116] overflow-hidden flex flex-col">
        {/* Animated Background */}
        <BackgroundFX />

        {/* Navbar */}
        <nav className="relative z-50">
          <div className="mx-auto container flex justify-between items-center px-6 py-6">
            <Link href="/">
              <Image
                width={160}
                height={40}
                src="/fullLogo.png"
                alt="logo"
                className="cursor-pointer"
                priority
              />
            </Link>
            <ul className="hidden lg:flex items-center space-x-8 text-white font-medium">
              <li><Link href="/" className="hover:text-indigo-400">Home</Link></li>
              <li><Link href="#features" className="hover:text-indigo-400">Features</Link></li>
              <li><Link href="https://github.com/SnipSavvy?tab=repositories" target="_blank" className="hover:text-indigo-400">Github</Link></li>
              <li><Link href="#signup" className="hover:text-indigo-400">Sign Up</Link></li>
            </ul>
            <button
              className="lg:hidden text-white"
              onClick={() => setMenu(!menu)}
              aria-label="Toggle menu"
            >
              ☰
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {/* Note: backdrop blur and a bit of transparency keep the FX visible yet dim */}
        {menu && (
          <div className="absolute top-16 left-0 right-0 bg-[#1A1D29]/90 backdrop-blur text-white p-4 space-y-4 lg:hidden z-50">
            <Link href="/" onClick={() => setMenu(false)}>Home</Link>
            <Link href="#features" onClick={() => setMenu(false)}>Features</Link>
            <Link href="https://github.com/SnipSavvy?tab=repositories" target="_blank" onClick={() => setMenu(false)}>Github</Link>
            <Link href="#signup" onClick={() => setMenu(false)}>Sign Up</Link>
          </div>
        )}

        {/* Hero Content */}
        <div className="relative flex-1 flex flex-col items-center justify-center text-center z-10 px-6">
          <motion.h1
            className="text-5xl md:text-6xl font-extrabold text-white leading-tight max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Snippet Sync – <span className="text-indigo-400">Web + VS Code</span>
          </motion.h1>
          <motion.p
            className="mt-6 text-lg md:text-xl text-gray-300 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Use Snippet Sync anywhere: in your browser or inside VS Code.
            Your snippets stay in sync <span className="font-semibold text-indigo-300">instantly</span> in both directions.
          </motion.p>

          {/* Buttons */}
          <motion.div
            className="mt-10 flex flex-col sm:flex-row gap-4 flex-wrap justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link href="#signup">
              <button className="group px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-xl shadow-lg hover:scale-105 transition-all flex items-center gap-2">
                <span>Get Started Now</span>
              </button>
            </Link>
            <Link href="#signup">
              <button className="px-8 py-4 border-2 border-indigo-300 text-indigo-200 font-semibold rounded-xl shadow-lg hover:border-indigo-500 hover:bg-indigo-500 hover:text-white transition-all">
                Get VS Code Extension
              </button>
            </Link>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Hero;
