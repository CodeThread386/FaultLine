"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function InfiniteZoom() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Scale aggressively from 1 to 150
  const scale = useTransform(scrollYProgress, [0, 1], [1, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.8, 1], [1, 1, 0]);

  return (
    <div ref={containerRef} className="h-[300vh] relative bg-black">
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        <motion.div 
          className="fl-display tracking-tighter text-white mix-blend-difference flex flex-col items-center justify-center"
          style={{ scale, opacity }}
        >
          <div className="text-[15vw] leading-none text-transparent" style={{ WebkitTextStroke: "2px white" }}>
            VOID
          </div>
          <div className="text-[20vw] leading-none transform -mt-16">
            O
          </div>
        </motion.div>
        
        {/* Background grid that zooms in opposite direction to create sickness */}
        <motion.div 
          className="absolute inset-0 fl-tech-grid opacity-20 pointer-events-none mix-blend-difference"
          style={{ 
            scale: useTransform(scrollYProgress, [0, 1], [1, 0.1]),
            rotateZ: useTransform(scrollYProgress, [0, 1], [0, 90])
          }}
        />
      </div>
    </div>
  );
}
