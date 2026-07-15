"use client";
import { useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useMotionTemplate } from "framer-motion";
import { cn } from "@/lib/utils";

export default function HeroMask() {
  const [isHovered, setIsHovered] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
  const mouseXSpring = useSpring(cursorX, springConfig);
  const mouseYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, [cursorX, cursorY]);

  const maskSize = isHovered ? 400 : 40;
  
  // Use a hack to pass framer motion spring values into css variables
  // Since maskImage string interpolation with motion values is complex, we use a custom style tag or motion.div styling.

  const maskImageTemplate = useMotionTemplate`circle(${isHovered ? 400 : 40}px at ${mouseXSpring}px ${mouseYSpring}px)`;

  return (
    <div className="h-screen w-full flex items-center justify-center bg-black relative overflow-hidden cursor-none">
      
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
          <h1 className="fl-display text-[15vw] leading-none tracking-tighter text-black uppercase animate-jitter">
            FAULTLINE
          </h1>
          <p className="text-2xl font-display font-black uppercase tracking-widest mt-8 px-4 bg-black text-white">
            SYSTEM COMPROMISED // ERROR CODE: 0xDEADBEEF
          </p>
        </div>
      </motion.div>

      {/* BASE LAYER */}
      <div 
        className="w-full h-full flex flex-col items-center justify-center absolute inset-0 z-10 fl-tech-grid"
      >
        <div className="absolute top-10 left-10 w-32 h-32 border-t-8 border-l-8 border-white"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 border-b-8 border-r-8 border-white"></div>
        
        <h1 className="fl-display text-[15vw] leading-none tracking-tighter text-transparent uppercase" style={{ WebkitTextStroke: "2px white" }}>
          FAULTLINE
        </h1>
        <p className="text-2xl font-display font-bold uppercase tracking-widest mt-8 text-white/50 border border-white/20 p-4">
          HOVER TO EXPOSE TERMINAL
        </p>
      </div>
      
      {/* Custom Cursor Dot */}
      <motion.div
        className="fixed top-0 left-0 w-4 h-4 bg-white rounded-full pointer-events-none z-50 mix-blend-difference"
        style={{
          x: mouseXSpring,
          y: mouseYSpring,
          translateX: "-50%",
          translateY: "-50%"
        }}
      />
    </div>
  );
}
