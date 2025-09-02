// Redesigned Features Section with Card Grid Layout
"use client"

import React, { useState, useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { 
  ArrowRight, 
  Play, 
  Sparkles, 
  Code, 
  Zap,
  Download,
  Globe,
  ChevronRight,
  FolderOpen,
  Database,
  Navigation,
  Search,
  Users,
  Share2,
  Code2,
  Layers,
  Cloud,
  Lock,
  RefreshCw,
  Smartphone,
  Shield,
  Rocket,
  Star,
  Check,
  Mail,
  MessageSquare,
  Github,
  Twitter,
  Linkedin,
  ExternalLink
} from "lucide-react";

const AboutSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  return (
   <div id="about" className="relative py-32 bg-gradient-to-br from-black via-gray-950 to-black">
      <div className="relative z-10 container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            ref={sectionRef}
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-indigo-300 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">
              Built by Developers,
              <br />
              <span className="text-white">For Developers</span>
            </h2>
            
            <p className="text-xl text-gray-400 mb-8 leading-relaxed">
              We understand the pain of managing code snippets across different platforms. 
              That's why we built Snippet Sync - to make your development workflow seamless 
              and efficient.
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center border border-white/10">
                  <Zap className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg">Lightning Fast</h3>
                  <p className="text-gray-400">Optimized for speed and performance</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center border border-white/10">
                  <Shield className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg">Secure & Private</h3>
                  <p className="text-gray-400">Your code is encrypted and protected</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center border border-white/10">
                  <Rocket className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg">Always Improving</h3>
                  <p className="text-gray-400">Regular updates and new features</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="bg-gray-800/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Get in Touch</h3>
              
              <form className="space-y-6">
                <div>
                  <input 
                    type="text" 
                    placeholder="Your Name"
                    className="w-full px-4 py-3 bg-gray-700/50 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors"
                  />
                </div>
                
                <div>
                  <input 
                    type="email" 
                    placeholder="Your Email"
                    className="w-full px-4 py-3 bg-gray-700/50 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors"
                  />
                </div>
                
                <div>
                  <textarea 
                    rows={4}
                    placeholder="Your Message"
                    className="w-full px-4 py-3 bg-gray-700/50 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors resize-none"
                  ></textarea>
                </div>
                
                <button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 rounded-xl text-white font-semibold shadow-[0_0_30px_rgba(139,92,246,0.3)] hover:shadow-[0_0_50px_rgba(236,72,153,0.4)] transition-all duration-500 flex items-center justify-center gap-3"
                >
                  <Mail className="w-5 h-5" />
                  Send Message
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;