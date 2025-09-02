// "use client";
// import React, { useRef, useState } from "react";
// import { motion, useInView, Variants } from "framer-motion";
// import { 
//   Zap, 
//   Shield, 
//   Rocket, 
//   Globe, 
//   Sparkles, 
//   ArrowRight,
//   Play,
//   ChevronRight
// } from "lucide-react";

// export type Feature = {
//   icon: any;
//   title: string;
//   text: string;
//   subtitle?: string;
//   metrics?: string;
//   color: string;
// };

// type FeaturesSectionProps = {
//   features: Feature[];
//   layout?: 'timeline' | 'grid' | 'alternating' | 'cards';
//   variant?: 'default' | 'minimal' | 'premium';
// };

// const sampleFeatures: Feature[] = [
//   {
//     icon: Zap,
//     title: "Lightning Fast",
//     subtitle: "Optimized Performance",
//     text: "Experience blazing-fast load times and seamless interactions with our optimized infrastructure built for speed.",
//     metrics: "3x faster",
//     color: "from-yellow-400 to-orange-500"
//   },
//   {
//     icon: Shield,
//     title: "Enterprise Security",
//     subtitle: "Bank-Grade Protection",
//     text: "Your data is protected with military-grade encryption and compliance with industry standards.",
//     metrics: "99.9% uptime",
//     color: "from-blue-400 to-cyan-500"
//   },
//   {
//     icon: Rocket,
//     title: "Scale Infinitely",
//     subtitle: "Built for Growth",
//     text: "From startup to enterprise, our platform scales seamlessly with your business needs.",
//     metrics: "10M+ users",
//     color: "from-purple-400 to-pink-500"
//   },
//   {
//     icon: Globe,
//     title: "Global Reach",
//     subtitle: "Worldwide Coverage",
//     text: "Deploy anywhere in the world with our global CDN and multi-region infrastructure.",
//     metrics: "150+ countries",
//     color: "from-green-400 to-emerald-500"
//   }
// ];

// // Timeline Layout Component
// const TimelineFeature = ({ item, index }: { item: Feature; index: number }) => {
//   const cardRef = useRef(null);
//   const isInView = useInView(cardRef, { once: false, amount: 0.25 });
//   const IconComponent = item.icon;

//   const cardVariants: Variants = {
//     hidden: { opacity: 0, scale: 0.85, y: 70 },
//     visible: {
//       opacity: 1,
//       scale: 1,
//       y: 0,
//       transition: { type: "spring", stiffness: 120, damping: 18 },
//     },
//   };

//   const textVariants: Variants = {
//     hidden: { opacity: 0, x: index % 2 === 0 ? -70 : 70 },
//     visible: {
//       opacity: 1,
//       x: 0,
//       transition: { type: "spring", stiffness: 90, damping: 18, delay: 0.2 },
//     },
//   };

//   return (
//     <motion.div
//       ref={cardRef}
//       className="flex flex-col md:flex-row items-center gap-14 relative mb-20"
//     >
//       {/* Timeline Dot */}
//       <motion.div
//         className="absolute left-1/2 -translate-x-1/2 w-6 h-6 rounded-full border-2 border-indigo-400 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 shadow-[0_0_25px_rgba(139,92,246,0.7)] z-20"
//         initial={{ scale: 0 }}
//         animate={isInView ? { scale: 1 } : { scale: 0 }}
//         transition={{ duration: 0.4, ease: "easeOut" }}
//       />

//       {/* Icon Block */}
//       <motion.div
//         className={`flex-shrink-0 w-full md:w-1/2 flex justify-center ${
//           index % 2 !== 0 ? "order-2" : "order-1"
//         }`}
//         variants={cardVariants}
//         initial="hidden"
//         animate={isInView ? "visible" : "hidden"}
//       >
//         <div className="relative group">
//           <div className={`w-56 h-56 p-12 rounded-3xl bg-gradient-to-br ${item.color}/20 border border-white/10 backdrop-blur-xl shadow-[0_0_40px_rgba(139,92,246,0.4)] group-hover:shadow-[0_0_70px_rgba(236,72,153,0.6)] transition-all duration-500`}>
//             <IconComponent className="w-full h-full text-white/90" />
//           </div>
//           {item.metrics && (
//             <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 rounded-full text-sm font-bold text-white shadow-lg">
//               {item.metrics}
//             </div>
//           )}
//         </div>
//       </motion.div>

//       {/* Text Block */}
//       <motion.div
//         className={`w-full md:w-1/2 text-center md:text-left ${
//           index % 2 !== 0 ? "order-1" : "order-2"
//         }`}
//         variants={textVariants}
//         initial="hidden"
//         animate={isInView ? "visible" : "hidden"}
//       >
//         {item.subtitle && (
//           <span className="text-purple-400 text-sm font-semibold uppercase tracking-wide">
//             {item.subtitle}
//           </span>
//         )}
//         <h3 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-indigo-300 via-purple-400 to-pink-400 bg-clip-text text-transparent tracking-tight">
//           {item.title}
//         </h3>
//         <div className="h-1 w-16 bg-gradient-to-r from-indigo-400 to-pink-400 rounded-full mb-6 mx-auto md:mx-0" />
//         <p className="text-gray-300/90 text-lg md:text-xl leading-relaxed max-w-lg mx-auto md:mx-0 mb-6">
//           {item.text}
//         </p>
//         <button className="group flex items-center gap-2 text-purple-400 hover:text-white transition-colors duration-300">
//           Learn more 
//           <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
//         </button>
//       </motion.div>
//     </motion.div>
//   );
// };

// // Grid Layout Component
// const GridFeature = ({ item, index }: { item: Feature; index: number }) => {
//   const cardRef = useRef(null);
//   const isInView = useInView(cardRef, { once: false, amount: 0.25 });
//   const IconComponent = item.icon;
//   const [isHovered, setIsHovered] = useState(false);

//   return (
//     <motion.div
//       ref={cardRef}
//       className="relative group cursor-pointer"
//       initial={{ opacity: 0, y: 50 }}
//       animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
//       transition={{ duration: 0.6, delay: index * 0.1 }}
//       onHoverStart={() => setIsHovered(true)}
//       onHoverEnd={() => setIsHovered(false)}
//     >
//       <div className="h-full p-8 rounded-3xl bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-white/10 backdrop-blur-xl transition-all duration-500 group-hover:border-purple-400/50 group-hover:shadow-[0_0_40px_rgba(139,92,246,0.3)]">
//         {/* Icon */}
//         <div className={`w-16 h-16 p-3 rounded-2xl bg-gradient-to-br ${item.color}/20 border border-white/10 mb-6 group-hover:scale-110 transition-transform duration-300`}>
//           <IconComponent className="w-full h-full text-white/90" />
//         </div>

//         {/* Content */}
//         <div className="space-y-4">
//           {item.subtitle && (
//             <span className="text-purple-400 text-xs font-semibold uppercase tracking-wide">
//               {item.subtitle}
//             </span>
//           )}
//           <h3 className="text-2xl font-bold text-white group-hover:text-purple-300 transition-colors duration-300">
//             {item.title}
//           </h3>
//           <p className="text-gray-400 leading-relaxed">
//             {item.text}
//           </p>
//         </div>

//         {/* Metrics Badge */}
//         {item.metrics && (
//           <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-600/80 to-pink-600/80 px-3 py-1 rounded-full text-xs font-bold text-white backdrop-blur-sm">
//             {item.metrics}
//           </div>
//         )}

//         {/* Hover Arrow */}
//         <motion.div
//           className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
//           animate={isHovered ? { x: 5 } : { x: 0 }}
//           transition={{ duration: 0.3 }}
//         >
//           <ChevronRight className="w-6 h-6 text-purple-400" />
//         </motion.div>
//       </div>
//     </motion.div>
//   );
// };

// // Card Layout Component
// const CardFeature = ({ item, index }: { item: Feature; index: number }) => {
//   const cardRef = useRef(null);
//   const isInView = useInView(cardRef, { once: false, amount: 0.25 });
//   const IconComponent = item.icon;

//   return (
//     <motion.div
//       ref={cardRef}
//       className="group relative"
//       initial={{ opacity: 0, scale: 0.9 }}
//       animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
//       transition={{ duration: 0.5, delay: index * 0.1 }}
//       whileHover={{ y: -5 }}
//     >
//       <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900/80 to-gray-800/40 border border-white/10 backdrop-blur-xl p-8 h-full transition-all duration-500 group-hover:border-purple-400/50">
//         {/* Background Glow */}
//         <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-pink-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
//         {/* Icon */}
//         <div className="relative z-10">
//           <div className={`w-20 h-20 p-4 rounded-2xl bg-gradient-to-br ${item.color}/20 border border-white/10 mb-6 group-hover:scale-110 transition-all duration-300`}>
//             <IconComponent className="w-full h-full text-white/90" />
//           </div>

//           {/* Content */}
//           <div className="space-y-4">
//             {item.subtitle && (
//               <span className="text-purple-400 text-sm font-semibold uppercase tracking-wide">
//                 {item.subtitle}
//               </span>
//             )}
//             <h3 className="text-3xl font-bold text-white group-hover:text-purple-300 transition-colors duration-300">
//               {item.title}
//             </h3>
//             <p className="text-gray-400 leading-relaxed text-lg">
//               {item.text}
//             </p>
            
//             {item.metrics && (
//               <div className="flex items-center gap-2 pt-2">
//                 <Sparkles className="w-4 h-4 text-purple-400" />
//                 <span className="text-purple-400 font-semibold">{item.metrics}</span>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Interactive Element */}
//         <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//           <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-400/30 flex items-center justify-center">
//             <Play className="w-3 h-3 text-purple-400" />
//           </div>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// // Main Features Component
// const FeaturesSection = ({ 
//   features = sampleFeatures, 
//   layout = 'timeline',
//   variant = 'default'
// }: FeaturesSectionProps) => {
//   const sectionRef = useRef(null);
//   const isInView = useInView(sectionRef, { once: false, amount: 0.1 });

//   return (
//     <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black overflow-hidden">
//       {/* Background Effects */}
//       <div className="absolute inset-0">
//         <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
//         <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
//       </div>

//       <div className="relative z-10 container mx-auto px-6 py-20">
//         {/* Header */}
//         <motion.div
//           ref={sectionRef}
//           className="text-center mb-20"
//           initial={{ opacity: 0, y: 30 }}
//           animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
//           transition={{ duration: 0.8 }}
//         >
//           <h2 className="text-6xl md:text-7xl font-extrabold bg-gradient-to-r from-indigo-300 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">
//             Powerful Features
//           </h2>
//           <p className="text-xl text-gray-400 max-w-3xl mx-auto">
//             Everything you need to build, scale, and succeed. Our platform combines cutting-edge technology 
//             with intuitive design to deliver exceptional results.
//           </p>
//         </motion.div>

//         {/* Features */}
//         <div className="relative">
//           {/* Timeline Line for Timeline Layout */}
//           {layout === 'timeline' && (
//             <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-purple-400/50 to-transparent transform -translate-x-1/2 hidden md:block" />
//           )}

//           {/* Render Features Based on Layout */}
//           {layout === 'timeline' && (
//             <div className="space-y-0">
//               {features.map((feature, index) => (
//                 <TimelineFeature key={index} item={feature} index={index} />
//               ))}
//             </div>
//           )}

//           {layout === 'grid' && (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
//               {features.map((feature, index) => (
//                 <GridFeature key={index} item={feature} index={index} />
//               ))}
//             </div>
//           )}

//           {layout === 'cards' && (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//               {features.map((feature, index) => (
//                 <CardFeature key={index} item={feature} index={index} />
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// // Demo Component with Layout Switcher
// export default function Features (){
//   const [layout, setLayout] = useState<'timeline' | 'grid' | 'cards'>('timeline');

//   return (
//     <div>
//       {/* Layout Switcher */}
//       <div className="fixed top-6 right-6 z-50 flex gap-2 bg-gray-900/80 backdrop-blur-xl rounded-2xl p-2 border border-white/10">
//         {(['timeline', 'grid', 'cards'] as const).map((layoutType) => (
//           <button
//             key={layoutType}
//             onClick={() => setLayout(layoutType)}
//             className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 capitalize ${
//               layout === layoutType
//                 ? 'bg-purple-500 text-white shadow-lg'
//                 : 'text-gray-400 hover:text-white hover:bg-gray-800'
//             }`}
//           >
//             {layoutType}
//           </button>
//         ))}
//       </div>

//       <FeaturesSection features={sampleFeatures} layout={layout} />
//     </div>
//   );
// }