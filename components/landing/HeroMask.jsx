"use client";
import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useMotionTemplate } from "framer-motion";
import { cn } from "@/lib/utils";

export default function HeroMask() {
  const [isHovered, setIsHovered] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
  const mouseXSpring = useSpring(cursorX, springConfig);
  const mouseYSpring = useSpring(cursorY, springConfig);

  const containerRef = useRef(null);

  useEffect(() => {
    const moveCursor = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      cursorX.set(e.clientX - rect.left);
      cursorY.set(e.clientY - rect.top);
    };
    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, [cursorX, cursorY]);

  const maskSize = isHovered ? 400 : 40;

  // Use a hack to pass framer motion spring values into css variables
  // Since maskImage string interpolation with motion values is complex, we use a custom style tag or motion.div styling.

  const maskImageTemplate = useMotionTemplate`circle(${isHovered ? 400 : 40}px at ${mouseXSpring}px ${mouseYSpring}px)`;

  return (
    <div ref={containerRef} className="h-screen w-full flex items-center justify-center bg-transparent relative overflow-hidden hide-native-cursor">
    {/* HUD CORNERS */}
    <div className="absolute top-24 left-12 md:left-24 z-30 w-32 h-32 border-t-8 border-l-8 border-[#ff0000] mix-blend-difference"></div>

    <div className="absolute bottom-24 right-12 md:right-24 z-30 w-32 h-32 border-b-8 border-r-8 border-[#ff0000] mix-blend-difference"></div>
      {/* MASK LAYER (Inverted, revealed by mouse) */}
      <motion.div
        className="absolute inset-0 z-20 flex items-center justify-center bg-white text-black"
        style={{
          clipPath: maskImageTemplate
        }}
      >
        <div
          className="w-full h-full flex flex-col items-center justify-center"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <h1 className="fl-display text-[clamp(4rem,11vw,8rem)] leading-none tracking-tighter text-black uppercase animate-jitter whitespace-nowrap px-4">
            <span className="text-[#ff0000]">FAULT</span>LINE
          </h1>
          <p className="text-2xl font-display font-black uppercase tracking-widest mt-8 px-4 bg-black text-white">
            SYSTEM COMPROMISED // ERROR CODE: 0x6767
          </p>
        </div>
      </motion.div>

      {/* BASE LAYER */}
      <div className="w-full h-full flex flex-col items-center justify-center absolute inset-0 z-10 fl-tech-grid">
        <h1 className="fl-display text-[clamp(4rem,11vw,8rem)] leading-none tracking-tighter uppercase whitespace-nowrap px-4" style={{ WebkitTextStroke: "2px white" }}>
          <span className="text-[#ff0000]" style={{ WebkitTextStroke: "0px" }}>FAULT</span>
          <span className="text-transparent">LINE</span>
        </h1>
        <p className="text-2xl font-display font-bold uppercase tracking-widest mt-8 text-white/50 border border-white/20 p-4">
          SEEK TRUTH IN THE VOID
        </p>
      </div>
    </div>
  );
}
