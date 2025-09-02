"use client";
import React, { useRef, useState, useEffect } from "react";
import { motion, useInView, Variants, useScroll, useTransform } from "framer-motion";
import { 
  Zap, 
  Shield, 
  Rocket, 
  Globe, 
  Sparkles, 
  ArrowRight,
  Play,
  ChevronRight,
  FolderOpen,
  Database,
  Navigation,
  Search,
  Users,
  Share2
} from "lucide-react";

export type Feature = {
  icon: any;
  title: string;
  text: string;
  subtitle?: string;
  metrics?: string;
  color: string;
};

type FeaturesSectionProps = {
  features: Feature[];
};

const sampleFeatures: Feature[] = [
  {
    icon: FolderOpen,
    title: "Workspace Management",
    subtitle: "Organize Everything",
    text: "Create, organize workspaces, collections for efficient project and code management.",
    metrics: "Unlimited",
    color: "from-blue-400 to-indigo-500"
  },
  {
    icon: Database,
    title: "Effortless Storage",
    subtitle: "Never Lose Code",
    text: "Unlimited code snippets saved per collection for easy access.",
    metrics: "∞ Snippets",
    color: "from-green-400 to-emerald-500"
  },
  {
    icon: Navigation,
    title: "Intuitive Navigation",
    subtitle: "Smooth Transitions",
    text: "Smooth transition between workspaces and collections for streamlined management.",
    metrics: "Zero Friction",
    color: "from-purple-400 to-pink-500"
  },
  {
    icon: Search,
    title: "Global Search",
    subtitle: "Find Anything Fast",
    text: "Powerful search across all workspaces and collections for code retrieval.",
    metrics: "Lightning Fast",
    color: "from-yellow-400 to-orange-500"
  },
  {
    icon: Users,
    title: "Team Collaboration",
    subtitle: "Work Together",
    text: "Share workspaces with team members for seamless project collaboration.",
    metrics: "Team Ready",
    color: "from-cyan-400 to-blue-500"
  },
  {
    icon: Share2,
    title: "Flexible Sharing",
    subtitle: "Share Your Way",
    text: "Share snippets via links or email for easy collaboration.",
    metrics: "Multi-Channel",
    color: "from-pink-400 to-rose-500"
  }
];

// Card Layout Component
const CardFeature = ({ item, index }: { item: Feature; index: number }) => {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: false, amount: 0.25 });
  const IconComponent = item.icon;

  return (
    <motion.div
      ref={cardRef}
      className="group relative"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
    >
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900/80 to-gray-800/40 border border-white/10 backdrop-blur-xl p-8 h-full transition-all duration-500 group-hover:border-purple-400/50">
        {/* Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-pink-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Icon */}
        <div className="relative z-10">
          <div className={`w-20 h-20 p-4 rounded-2xl bg-gradient-to-br ${item.color}/20 border border-white/10 mb-6 group-hover:scale-110 transition-all duration-300`}>
            <IconComponent className="w-full h-full text-white/90" />
          </div>

          {/* Content */}
          <div className="space-y-4">
            {item.subtitle && (
              <span className="text-purple-400 text-sm font-semibold uppercase tracking-wide">
                {item.subtitle}
              </span>
            )}
            <h3 className="text-3xl font-bold text-white group-hover:text-purple-300 transition-colors duration-300">
              {item.title}
            </h3>
            <p className="text-gray-400 leading-relaxed text-lg">
              {item.text}
            </p>
            
            {item.metrics && (
              <div className="flex items-center gap-2 pt-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="text-purple-400 font-semibold">{item.metrics}</span>
              </div>
            )}
          </div>
        </div>

        {/* Interactive Element */}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-400/30 flex items-center justify-center">
            <Play className="w-3 h-3 text-purple-400" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Main Features Component
const FeaturesSection = ({ 
  features = sampleFeatures, 
}: FeaturesSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.1 });
  
  // Use Framer Motion's useScroll for smoother scroll tracking

  return (
   <div className="relative min-h-screen bg-gradient-to-br from-black via-gray-950 to-slate-900 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-20">
        {/* Header */}
        <motion.div
          ref={sectionRef}
          className="text-center mb-30"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-indigo-300 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">
            Code Management Features
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Everything you need to organize, store, and collaborate on your code snippets. 
            Built for developers who value efficiency and seamless workflow.
          </p>
        </motion.div>

        {/* Features */}
        <div className="relative mt-20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <CardFeature key={index} item={feature} index={index} />
              ))}
            </div>
    
        </div>
      </div>
    </div>
  );
};

// Demo Component with Layout Switcher
export default function Features() {

  return (
    <div>

      <FeaturesSection features={sampleFeatures} />
    </div>
  );
}