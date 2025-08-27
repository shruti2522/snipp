"use client";
import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import BackgroundFX from "../LandingPage/BackgroundFX";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const Signup: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password || !confirmPassword) {
      setError("Please fill all fields.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: undefined, email, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data?.error || "Signup failed");
        setLoading(false);
        return;
      }

      // Auto sign-in (credentials). On success, redirect client-side 
      const signInResult = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      setLoading(false);

      if (signInResult?.error) {
        // If sign-in failed for some reason, send user to login page
        setError(signInResult.error || "Signup succeeded but auto sign-in failed. Please login.");
        return;
      }

      // Success -> go to dashboard
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Try again.");
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-[#0E1116] via-[#1A1D29] to-[#0E1116] overflow-hidden flex flex-col">
      <BackgroundFX />
      <nav className="relative z-50">
        <div className="mx-auto container flex justify-between items-center px-6 py-6">
          <Link href="/">
            <Image width={140} height={35} src="/fullLogo.png" alt="logo" className="cursor-pointer" priority />
          </Link>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center z-10 px-4">
        <motion.div className="w-full max-w-sm bg-[#1E2230]/90 backdrop-blur-md rounded-2xl shadow-2xl p-6 text-white" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h2 className="text-xl font-bold text-center mb-4">Create an Account</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" required className="w-full px-3 py-2 rounded-lg bg-[#11141C] border border-gray-600 focus:border-green-400 focus:ring-2 focus:ring-green-400 outline-none text-sm" />
            </div>

            <div>
              <label className="block text-sm mb-1">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 6 characters" autoComplete="new-password" required className="w-full px-3 py-2 rounded-lg bg-[#11141C] border border-gray-600 focus:border-green-400 focus:ring-2 focus:ring-green-400 outline-none text-sm" />
            </div>

            <div>
              <label className="block text-sm mb-1">Confirm Password</label>
              <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Repeat password" autoComplete="new-password" required className="w-full px-3 py-2 rounded-lg bg-[#11141C] border border-gray-600 focus:border-green-400 focus:ring-2 focus:ring-green-400 outline-none text-sm" />
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button type="submit" disabled={loading} className={`w-full py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 font-semibold rounded-lg shadow-lg hover:scale-[1.02] transition-all text-sm ${loading ? "opacity-60 cursor-not-allowed" : ""}`}>
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <div className="flex items-center my-4">
            <hr className="flex-grow border-gray-700" />
            <span className="px-2 text-gray-400 text-xs">or</span>
            <hr className="flex-grow border-gray-700" />
          </div>

          <div className="space-y-2">
            <button onClick={() => signIn("google", { callbackUrl: "/dashboard" })} className="w-full flex items-center justify-center gap-2 py-2.5 bg-white text-gray-800 font-medium rounded-lg shadow-lg hover:scale-[1.02] transition-all text-sm">
              <Image src="/google.svg" alt="Google" width={18} height={18} /> Sign up with Google
            </button>
            <button onClick={() => signIn("github", { callbackUrl: "/dashboard" })} className="w-full flex items-center justify-center gap-2 py-2.5 bg-gray-900 text-white font-medium rounded-lg shadow-lg hover:scale-[1.02] transition-all text-sm">
              <Image src="/github.png" alt="GitHub" width={18} height={18} /> Sign up with GitHub
            </button>
          </div>

          <p className="mt-4 text-center text-gray-400 text-sm">
            Already have an account? <Link href="/login" className="text-indigo-400 hover:underline">Login</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
