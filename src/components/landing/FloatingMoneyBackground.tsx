import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Sparkles, ShieldCheck, ArrowUpRight, Zap, Target } from 'lucide-react';

interface FloatingMoneyProps {
  interactive?: boolean;
}

export const FloatingMoneyBackground: React.FC<FloatingMoneyProps> = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate normalized mouse position from center (-1 to 1)
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-0 select-none">
      
      {/* 1. Ambient Background Glow Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.35, 0.5, 0.35],
          x: mousePos.x * 25,
          y: mousePos.y * 25,
        }}
        transition={{
          scale: { duration: 8, repeat: Infinity, ease: "easeInOut" },
          opacity: { duration: 8, repeat: Infinity, ease: "easeInOut" },
          x: { type: "spring", stiffness: 50, damping: 20 },
          y: { type: "spring", stiffness: 50, damping: 20 },
        }}
        className="absolute top-12 left-1/4 -translate-x-1/2 w-[500px] h-[350px] bg-gradient-to-tr from-purple-300/30 via-indigo-200/25 to-amber-200/20 blur-3xl rounded-full"
      />
      
      <motion.div
        animate={{
          scale: [1.1, 1, 1.1],
          opacity: [0.3, 0.45, 0.3],
          x: -mousePos.x * 20,
          y: -mousePos.y * 20,
        }}
        transition={{
          scale: { duration: 9, repeat: Infinity, ease: "easeInOut" },
          opacity: { duration: 9, repeat: Infinity, ease: "easeInOut" },
          x: { type: "spring", stiffness: 50, damping: 20 },
          y: { type: "spring", stiffness: 50, damping: 20 },
        }}
        className="absolute top-24 right-1/4 translate-x-1/2 w-[450px] h-[320px] bg-gradient-to-br from-amber-200/25 via-purple-200/30 to-emerald-200/20 blur-3xl rounded-full"
      />

      {/* 2. Floating 3D Gold & Glass Rupee Medallion (Top Left) */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{
          opacity: 1,
          y: [0, -16, 0],
          rotate: [0, 5, -3, 0],
          x: mousePos.x * 35,
        }}
        transition={{
          opacity: { duration: 0.8 },
          y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 7, repeat: Infinity, ease: "easeInOut" },
          x: { type: "spring", stiffness: 45, damping: 15 }
        }}
        className="absolute top-16 left-6 lg:left-16 hidden sm:flex items-center justify-center"
      >
        <div className="relative group">
          {/* Glowing Aura */}
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-400/40 via-yellow-300/40 to-amber-500/30 rounded-full blur-md opacity-75 group-hover:opacity-100 transition-opacity" />
          
          {/* Coin Body */}
          <div className="relative w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-gradient-to-br from-amber-100 via-amber-300 to-yellow-500 border-2 border-amber-200/80 shadow-xl shadow-amber-900/10 flex items-center justify-center backdrop-blur-md">
            {/* Inner Ring */}
            <div className="w-13 h-13 lg:w-16 lg:h-16 rounded-full border border-amber-400/60 bg-gradient-to-tr from-amber-300/60 via-yellow-100/70 to-amber-200/50 flex items-center justify-center shadow-inner">
              <span className="text-2xl lg:text-3xl font-black text-amber-900 drop-shadow-xs font-sans tracking-tight">
                ₹
              </span>
            </div>
            {/* Shimmer Light Reflection */}
            <div className="absolute top-1.5 left-3 w-4 h-2 bg-white/70 rounded-full blur-[1px] transform -rotate-45" />
          </div>
        </div>
      </motion.div>

      {/* 3. Floating Alpha Performance Pill (Mid Left) */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{
          opacity: 1,
          y: [0, 14, 0],
          rotate: [-1, 2, -1],
          x: mousePos.x * 25,
        }}
        transition={{
          opacity: { duration: 1, delay: 0.2 },
          y: { duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 },
          rotate: { duration: 6.5, repeat: Infinity, ease: "easeInOut" },
          x: { type: "spring", stiffness: 40, damping: 18 }
        }}
        className="absolute top-48 left-4 lg:left-14 hidden md:flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white/85 backdrop-blur-md border border-emerald-200/80 shadow-lg shadow-emerald-950/5"
      >
        <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
          <TrendingUp className="w-4 h-4" />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Research Alpha</span>
          <span className="text-xs font-extrabold text-emerald-700 font-mono">+18.4% vs Nifty</span>
        </div>
      </motion.div>

      {/* 4. Floating ROCE Metric Pill (Lower Left) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: 1,
          y: [0, -12, 0],
          rotate: [1, -2, 1],
          x: mousePos.x * 18,
        }}
        transition={{
          opacity: { duration: 1, delay: 0.4 },
          y: { duration: 6.8, repeat: Infinity, ease: "easeInOut", delay: 1 },
          rotate: { duration: 8, repeat: Infinity, ease: "easeInOut" },
          x: { type: "spring", stiffness: 35, damping: 20 }
        }}
        className="absolute top-80 left-10 lg:left-24 hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50/90 backdrop-blur-md border border-purple-200/70 shadow-sm"
      >
        <Sparkles className="w-3.5 h-3.5 text-purple-700" />
        <span className="text-[11px] font-bold text-purple-900">ROCE: 28.4% (Moat: High)</span>
      </motion.div>


      {/* 5. Floating Purple/Indigo 3D Rupee Medallion (Top Right) */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{
          opacity: 1,
          y: [0, -18, 0],
          rotate: [0, -6, 4, 0],
          x: -mousePos.x * 30,
        }}
        transition={{
          opacity: { duration: 0.8, delay: 0.1 },
          y: { duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 },
          rotate: { duration: 7.5, repeat: Infinity, ease: "easeInOut" },
          x: { type: "spring", stiffness: 45, damping: 15 }
        }}
        className="absolute top-14 right-6 lg:right-16 hidden sm:flex items-center justify-center"
      >
        <div className="relative group">
          {/* Glowing Aura */}
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/35 via-indigo-400/35 to-purple-600/30 rounded-full blur-md opacity-80 group-hover:opacity-100 transition-opacity" />
          
          {/* Coin Body */}
          <div className="relative w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-gradient-to-br from-purple-100 via-purple-300 to-indigo-600 border-2 border-purple-200/90 shadow-xl shadow-purple-950/15 flex items-center justify-center backdrop-blur-md">
            {/* Inner Ring */}
            <div className="w-13 h-13 lg:w-16 lg:h-16 rounded-full border border-purple-300/60 bg-gradient-to-tr from-purple-400/50 via-purple-100/80 to-indigo-300/60 flex items-center justify-center shadow-inner">
              <span className="text-2xl lg:text-3xl font-black text-purple-950 drop-shadow-xs font-sans tracking-tight">
                ₹
              </span>
            </div>
            {/* Shimmer Light Reflection */}
            <div className="absolute top-1.5 left-3 w-4 h-2 bg-white/80 rounded-full blur-[1px] transform -rotate-45" />
          </div>
        </div>
      </motion.div>

      {/* 6. Floating Virtual Token Capital Badge (Mid Right) */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{
          opacity: 1,
          y: [0, 15, 0],
          rotate: [2, -1, 2],
          x: -mousePos.x * 25,
        }}
        transition={{
          opacity: { duration: 1, delay: 0.3 },
          y: { duration: 5.8, repeat: Infinity, ease: "easeInOut", delay: 0.7 },
          rotate: { duration: 7, repeat: Infinity, ease: "easeInOut" },
          x: { type: "spring", stiffness: 40, damping: 18 }
        }}
        className="absolute top-44 right-4 lg:right-14 hidden md:flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white/90 backdrop-blur-md border border-purple-200/80 shadow-lg shadow-purple-950/5"
      >
        <div className="w-7 h-7 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-xs">
          ₹
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Lab Simulator</span>
          <span className="text-xs font-extrabold text-purple-900 font-mono">₹100,000 Tokens</span>
        </div>
      </motion.div>

      {/* 7. Floating ArthSetu Score Pill (Lower Right) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: 1,
          y: [0, -14, 0],
          rotate: [-1, 2, -1],
          x: -mousePos.x * 20,
        }}
        transition={{
          opacity: { duration: 1, delay: 0.5 },
          y: { duration: 6.2, repeat: Infinity, ease: "easeInOut", delay: 1.2 },
          rotate: { duration: 8, repeat: Infinity, ease: "easeInOut" },
          x: { type: "spring", stiffness: 35, damping: 20 }
        }}
        className="absolute top-76 right-10 lg:right-24 hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50/90 backdrop-blur-md border border-emerald-200/70 shadow-sm"
      >
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[11px] font-bold text-emerald-800">Quality Score: 88/100</span>
      </motion.div>


      {/* 8. Floating Micro Currency Particles & Sparkles */}
      {/* Particle 1 */}
      <motion.div
        animate={{
          y: [-10, -50, -10],
          opacity: [0.2, 0.7, 0.2],
          scale: [0.8, 1.1, 0.8],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.2,
        }}
        className="absolute top-36 left-1/3 hidden lg:flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-100/60 border border-amber-200/50 px-2 py-0.5 rounded-full backdrop-blur-xs"
      >
        <span>₹</span>
        <ArrowUpRight className="w-3 h-3" />
      </motion.div>

      {/* Particle 2 */}
      <motion.div
        animate={{
          y: [0, -40, 0],
          opacity: [0.2, 0.75, 0.2],
          scale: [0.9, 1.15, 0.9],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5,
        }}
        className="absolute top-28 right-1/3 hidden lg:flex items-center gap-1 text-[11px] font-bold text-purple-700 bg-purple-100/60 border border-purple-200/50 px-2 py-0.5 rounded-full backdrop-blur-xs"
      >
        <span>₹ P/E Fair</span>
      </motion.div>

      {/* Particle 3 */}
      <motion.div
        animate={{
          y: [-5, -35, -5],
          opacity: [0.15, 0.6, 0.15],
        }}
        transition={{
          duration: 4.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2.2,
        }}
        className="absolute top-64 left-1/4 hidden xl:block text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50/70 border border-emerald-100 px-2 py-0.5 rounded-md"
      >
        +2.35% Catalyst
      </motion.div>

      {/* Particle 4 */}
      <motion.div
        animate={{
          y: [0, -30, 0],
          opacity: [0.15, 0.55, 0.15],
        }}
        transition={{
          duration: 5.2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.8,
        }}
        className="absolute top-60 right-1/4 hidden xl:block text-[10px] font-mono font-bold text-purple-700 bg-purple-50/70 border border-purple-100 px-2 py-0.5 rounded-md"
      >
        D/E: 0.12x Safe
      </motion.div>

      {/* Subtle Financial Wave Grid Line at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />

    </div>
  );
};

export default FloatingMoneyBackground;
