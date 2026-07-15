"use client";
import { motion, useScroll, useTransform, useVelocity, useSpring } from "framer-motion";

export default function TesseractSvg() {
  const { scrollYProgress, scrollY } = useScroll();
  
  const scrollVelocity = useVelocity(scrollYProgress);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  
  // Transform scroll progress into intense rotations
  const rotateX = useTransform(scrollYProgress, [0, 1], [0, 1080]);
  const rotateY = useTransform(scrollYProgress, [0, 1], [0, -720]);
  const rotateZ = useTransform(scrollYProgress, [0, 1], [45, 360]);

  // Velocity affects scale and perspective heavily
  const scale = useTransform(smoothVelocity, [-1, 1], [0.5, 2]);
  const skew = useTransform(smoothVelocity, [-1, 1], [-30, 30]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 flex justify-center items-center overflow-hidden perspective-1000">
      <motion.div
        style={{
          rotateX,
          rotateY,
          rotateZ,
          scale,
          skew,
        }}
        className="w-[100vw] h-[100vw] md:w-[60vw] md:h-[60vw] opacity-10 mix-blend-difference"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
          {/* Inner Cube */}
          <path d="M25 25 L75 25 L75 75 L25 75 Z" fill="none" stroke="white" strokeWidth="0.5" />
          {/* Outer Cube */}
          <path d="M10 10 L90 10 L90 90 L10 90 Z" fill="none" stroke="white" strokeWidth="1" />
          {/* Connecting Lines */}
          <line x1="10" y1="10" x2="25" y2="25" stroke="white" strokeWidth="0.5" />
          <line x1="90" y1="10" x2="75" y2="25" stroke="white" strokeWidth="0.5" />
          <line x1="90" y1="90" x2="75" y2="75" stroke="white" strokeWidth="0.5" />
          <line x1="10" y1="90" x2="25" y2="75" stroke="white" strokeWidth="0.5" />

          {/* Glitch offsets */}
          <motion.path 
            d="M 50 0 L 50 100 M 0 50 L 100 50" 
            stroke="white" 
            strokeWidth="0.2" 
            strokeDasharray="2 4"
            style={{ rotate: rotateZ }}
          />

          <motion.circle 
            cx="50" cy="50" r="40" 
            fill="none" 
            stroke="white" 
            strokeWidth="0.5"
            style={{ scale }}
          />
          <motion.circle 
            cx="50" cy="50" r="60" 
            fill="none" 
            stroke="white" 
            strokeWidth="0.2"
            strokeDasharray="1 10"
            style={{ scale: useTransform(scale, s => s * 1.5) }}
          />
        </svg>
      </motion.div>
    </div>
  );
}
