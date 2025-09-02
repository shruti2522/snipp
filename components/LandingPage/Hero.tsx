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

// Background Effects Component
const BackgroundFX = () => {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-indigo-500/5 via-purple-500/10 to-pink-500/5 rounded-full blur-3xl" />
      </div>
      
      <div className="absolute inset-0 opacity-[0.03]">
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: "50px 50px",
          }}
          animate={{ backgroundPosition: ["0px 0px", "50px 50px"] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
      </div>
    </div>
  );
};

// Hero Section
const Hero = () => {
  const [menu, setMenu] = useState(false);
  const heroRef = useRef(null);
  const dashboardRef = useRef(null);
  const isInView = useInView(heroRef, { once: false, amount: 0.1 });
  const isDashboardInView = useInView(dashboardRef, { once: true, amount: 0.2 });

  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 1000], [0, 300]);
  const dashboardY = useTransform(scrollY, [0, 800], [0, -100]);
  const dashboardScale = useTransform(scrollY, [0, 400], [1, 0.95]);

  return (
    <>
      <div className="relative w-full min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black overflow-hidden flex flex-col" style={{ zIndex: 1 }}>
        <motion.div style={{ y: backgroundY }}>
          <BackgroundFX />
        </motion.div>

        {/* Navbar */}
        <nav className="relative z-50">
          <div className="mx-auto container flex justify-between items-center px-6 py-6">
            <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
              <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Snippet Sync
              </div>
            </motion.div>

            <ul className="hidden lg:flex items-center space-x-8 text-white font-medium">
              {["Home", "Features", "Pricing", "About"].map((item, index) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <a
                    href={`#${item.toLowerCase()}`}
                    className="relative group hover:text-purple-400 transition-colors duration-300"
                  >
                    {item}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 group-hover:w-full transition-all duration-300"></span>
                  </a>
                </motion.li>
              ))}
            </ul>

            <motion.button
              className="lg:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
              onClick={() => setMenu(!menu)}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                <motion.span
                  className="block h-0.5 bg-white rounded-full"
                  animate={menu ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }}
                />
                <motion.span
                  className="block h-0.5 bg-white rounded-full"
                  animate={menu ? { opacity: 0 } : { opacity: 1 }}
                />
                <motion.span
                  className="block h-0.5 bg-white rounded-full"
                  animate={menu ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }}
                />
              </div>
            </motion.button>
          </div>
        </nav>

        <motion.div
          className="absolute top-20 left-0 right-0 mx-6 bg-red-900/60 backdrop-blur-xl border border-white/10 rounded-2xl text-white p-6 space-y-4 lg:hidden z-50"
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={menu ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          style={{ display: menu ? "block" : "none" }}
        >
          {["Home", "Features", "Pricing", "About"].map((item, index) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, x: -10 }}
              animate={menu ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
              transition={{ duration: 0.2, delay: index * 0.1 }}
            >
              <a
                href={`#${item.toLowerCase()}`}
                className="block py-3 px-4 rounded-lg hover:bg-purple-500/20 hover:text-purple-300 transition-all duration-300"
                onClick={() => setMenu(false)}
              >
                {item}
              </a>
            </motion.div>
          ))}
        </motion.div>

        {/* Hero Content */}
        <div ref={heroRef} className="relative flex-1 flex flex-col items-center justify-center text-center z-10 px-6 pb-20">
          <motion.h1
            className="text-6xl md:text-7xl font-extrabold leading-tight max-w-5xl mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <span className="bg-gradient-to-r from-indigo-300 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Snippet Sync
            </span>
            <span className="text-white block mt-2">Everywhere You Code</span>
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-gray-300/90 max-w-3xl mb-4 leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Use Snippet Sync anywhere: in your browser or inside VS Code.
            Your snippets stay in sync{" "}
            <span className="font-bold text-purple-400">instantly</span> in both
            directions.
          </motion.p>

          <motion.div
            className="flex flex-wrap justify-center gap-3 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {[
              { icon: Code, text: "VS Code Extension" },
              { icon: Globe, text: "Web Interface" },
              { icon: Zap, text: "Real-time Sync" },
            ].map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={index}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-800/40 border border-white/10 rounded-full text-gray-300 text-sm backdrop-blur-xl"
                >
                  <IconComponent className="w-4 h-4 text-purple-400" />
                  <span>{feature.text}</span>
                </div>
              );
            })}
          </motion.div>

          <motion.div
            className="flex flex-col sm:flex-row gap-6 mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <motion.button
              className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-2xl shadow-[0_0_30px_rgba(139,92,246,0.3)] hover:shadow-[0_0_50px_rgba(236,72,153,0.4)] transition-all duration-500 flex items-center gap-3 min-w-[200px] justify-center"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Play className="w-5 h-5" />
              <span>Get Started Now</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </motion.button>

            <motion.button
              className="group relative px-8 py-4 bg-gray-900/50 border-2 border-purple-400/50 text-purple-300 font-bold rounded-2xl backdrop-blur-xl hover:border-purple-400 hover:bg-purple-500/10 transition-all duration-500 flex items-center gap-3 min-w-[200px] justify-center"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Download className="w-5 h-5" />
              <span>Install VS Code Extension</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Enhanced Dashboard Showcase Section */}
      <motion.div 
        ref={dashboardRef}
        className="relative -mt-20 z-30 px-6 pb-40"
        style={{ y: dashboardY }}
      >
        <div className="container mx-auto max-w-8xl">
          {/* Section Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={isDashboardInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-500/10 border border-purple-400/30 rounded-full text-purple-300 text-sm mb-6 backdrop-blur-xl"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isDashboardInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Sparkles className="w-4 h-4" />
              <span className="font-semibold">Dashboard Preview</span>
            </motion.div>
            
            <h2 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-indigo-300 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
              Your Code, Beautifully Organized
            </h2>
            
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Experience the power of organized development with our intuitive dashboard interface
            </p>
          </motion.div>

          {/* Main Dashboard Display */}
          <motion.div
            initial={{ opacity: 0, y: 80, rotateX: 15 }}
            animate={isDashboardInView ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 80, rotateX: 15 }}
            transition={{ duration: 1.4, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.3 }}
            className="relative group perspective-1000"
          >
            {/* Enhanced Glow Effects */}
            <div className="absolute -inset-8 bg-gradient-to-r from-purple-600/25 via-pink-600/25 to-indigo-600/25 rounded-[2rem] blur-3xl group-hover:blur-[4rem] transition-all duration-1000 opacity-80" />
            <div className="absolute -inset-4 bg-gradient-to-r from-purple-400/20 via-pink-400/20 to-indigo-400/20 rounded-3xl blur-xl opacity-60" />
            
            {/* Floating Elements Around Dashboard */}
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-purple-500/10 rounded-full blur-2xl animate-pulse"></div>
            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-pink-500/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
            
            {/* Main Dashboard Container */}
           <div className="relative bg-gradient-to-br from-gray-700/30 via-gray-00/30 to-slate-900/30 
  backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden 
  shadow-[0_0_60px_rgba(139,92,246,0.3)] group-hover:shadow-[0_0_100px_rgba(236,72,153,0.4)] 
  transition-all duration-1000">

              {/* Enhanced Browser Header */}
              <div className="flex items-center justify-between px-6 py-4 bg-gray-800/90 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full shadow-lg"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full shadow-lg"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full shadow-lg"></div>
                  </div>
                  <div className="flex items-center gap-2 ml-4 px-4 py-2 bg-gray-700/70 rounded-xl text-gray-300 text-sm min-w-[300px]">
                    <Globe className="w-4 h-4 text-purple-400" />
                    <span>snippetsync.dev/dashboard</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="px-3 py-1 bg-green-500/20 border border-green-400/30 rounded-lg text-green-300 text-xs flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>Live</span>
                  </div>
                  <button className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors">
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
              
              {/* Dashboard Content */}
              <div className="p-8 bg-gradient-to-br from-gray-900/95 to-gray-950">
                {/* Top Navigation & Stats */}
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 gap-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <Code2 className="w-4 h-4 text-white" />
                      </div>
                      My Code Vault
                    </h3>
                    <p className="text-gray-400">Your personal snippet collection</p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="px-4 py-2 bg-purple-500/20 border border-purple-400/30 rounded-xl text-purple-300 text-sm font-semibold">
                      🔥 React
                    </div>
                    <div className="px-4 py-2 bg-blue-500/20 border border-blue-400/30 rounded-xl text-blue-300 text-sm font-semibold">
                      ⚡ TypeScript
                    </div>
                    <div className="px-4 py-2 bg-green-500/20 border border-green-400/30 rounded-xl text-green-300 text-sm font-semibold">
                      🚀 Node.js
                    </div>
                  </div>
                </div>

                {/* Quick Stats Bar */}
                <div className="grid grid-cols-4 gap-4 mb-8">
                  {[
                    { label: "Total Snippets", value: "247", icon: Code2, color: "purple" },
                    { label: "Collections", value: "18", icon: FolderOpen, color: "blue" },
                    { label: "Languages", value: "12", icon: Layers, color: "green" },
                    { label: "This Week", value: "+23", icon: Zap, color: "pink" }
                  ].map((stat, index) => {
                    const IconComponent = stat.icon;
                    return (
                      <motion.div
                        key={index}
                        className={`bg-gradient-to-br from-${stat.color}-500/10 to-${stat.color}-600/5 border border-${stat.color}-400/20 rounded-2xl p-4 text-center`}
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={isDashboardInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.9 }}
                        transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                      >
                        <IconComponent className={`w-6 h-6 text-${stat.color}-400 mx-auto mb-2`} />
                        <div className="text-2xl font-bold text-white">{stat.value}</div>
                        <div className="text-xs text-gray-400">{stat.label}</div>
                      </motion.div>
                    );
                  })}
                </div>
                
                {/* Enhanced Snippet Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[
                    { title: "Custom React Hook", language: "React", lines: 24, category: "Hooks", popularity: "High", color: "blue" },
                    { title: "API Client Setup", language: "TypeScript", lines: 45, category: "Utilities", popularity: "Medium", color: "green" },
                    { title: "Styled Components", language: "CSS-in-JS", lines: 18, category: "Styling", popularity: "High", color: "purple" },
                    { title: "Express Middleware", language: "Node.js", lines: 32, category: "Backend", popularity: "Medium", color: "yellow" },
                    { title: "MongoDB Queries", language: "JavaScript", lines: 28, category: "Database", popularity: "Low", color: "red" },
                    { title: "GitHub Actions", language: "YAML", lines: 56, category: "CI/CD", popularity: "High", color: "indigo" }
                  ].map((snippet, index) => (
                    <motion.div
                      key={index}
                      className="group relative bg-gray-800/60 hover:bg-gray-800/80 border border-white/10 hover:border-purple-400/30 rounded-2xl p-5 transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(139,92,246,0.2)]"
                      initial={{ opacity: 0, y: 30, scale: 0.9 }}
                      animate={isDashboardInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.9 }}
                      transition={{ duration: 0.7, delay: 0.8 + index * 0.1 }}
                    >
                      {/* Card Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 bg-gradient-to-r from-${snippet.color}-500/20 to-${snippet.color}-600/20 rounded-xl flex items-center justify-center border border-${snippet.color}-400/30`}>
                            <Code className={`w-5 h-5 text-${snippet.color}-400`} />
                          </div>
                          <div>
                            <h4 className="text-white font-semibold text-sm group-hover:text-purple-300 transition-colors">{snippet.title}</h4>
                            <p className="text-xs text-gray-400">{snippet.category}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${snippet.popularity === 'High' ? 'bg-green-400' : snippet.popularity === 'Medium' ? 'bg-yellow-400' : 'bg-red-400'}`}></div>
                          <span className="text-xs text-gray-500">●●●</span>
                        </div>
                      </div>
                      
                      {/* Code Preview */}
                      <div className="mb-4 p-3 bg-black/40 rounded-xl border border-white/5">
                        <div className="space-y-2">
                          <div className={`h-2 bg-gradient-to-r from-${snippet.color}-500/40 to-transparent rounded-full`} style={{width: '90%'}}></div>
                          <div className={`h-2 bg-gradient-to-r from-${snippet.color}-500/30 to-transparent rounded-full`} style={{width: '75%'}}></div>
                          <div className={`h-2 bg-gradient-to-r from-${snippet.color}-500/20 to-transparent rounded-full`} style={{width: '85%'}}></div>
                        </div>
                      </div>
                      
                      {/* Card Footer */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <Globe className="w-3 h-3" />
                            {snippet.language}
                          </span>
                          <span>{snippet.lines} lines</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-purple-500/20 rounded-lg transition-all duration-300">
                            <Share2 className="w-3 h-3 text-purple-400" />
                          </button>
                          <button className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-purple-500/20 rounded-lg transition-all duration-300">
                            <ArrowRight className="w-3 h-3 text-purple-400" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                {/* Enhanced Bottom Stats & Actions */}
                <div className="flex flex-col lg:flex-row items-center justify-between mt-10 pt-8 border-t border-white/10 gap-6">
                  <div className="flex items-center gap-8">
                    <div className="flex items-center gap-3 text-gray-400 text-sm">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center">
                        <Cloud className="w-5 h-5 text-purple-400" />
                      </div>
                      <div>
                        <div className="text-white font-semibold">Cloud Synced</div>
                        <div className="text-xs">Last sync: 2 min ago</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 text-gray-400 text-sm">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center">
                        <Shield className="w-5 h-5 text-green-400" />
                      </div>
                      <div>
                        <div className="text-white font-semibold">Encrypted</div>
                        <div className="text-xs">End-to-end security</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button className="px-4 py-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-400/30 rounded-xl text-purple-300 text-sm hover:bg-purple-600/30 transition-all duration-300 flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      Export All
                    </button>
                    <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white text-sm font-semibold hover:shadow-lg transition-all duration-300 flex items-center gap-2">
                      <Play className="w-4 h-4" />
                      Try Dashboard
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};


// Main App Component
export default function Hero1() {
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <Hero />
    </div>
  );
}