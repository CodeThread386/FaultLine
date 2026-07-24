"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function InfiniteZoom() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Animate across the entire scroll
  const scale = useTransform(scrollYProgress, [0, 1], [1, 30]);
  const opacity = useTransform(scrollYProgress, [0.85, 1], [1, 0]);
  
  // Flashbang hits exactly when the O completely engulfs the camera at 33%
  // It then stays on screen for the entire remaining 66% of the scroll
  //const flashbangOpacity = useTransform(scrollYProgress, [0.33, 0.35, 1], [0, 1, 1]);

  return (
    <div ref={containerRef} className="h-[300vh] relative bg-black">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        <motion.div 
          className="fl-display tracking-tighter text-white mix-blend-difference flex flex-col items-center justify-center"
          style={{ scale, opacity }}
        >
          <div className="text-[15vw] leading-none text-transparent" style={{ WebkitTextStroke: "2px white" }}>
            GRAVITAS
          </div>
          <div className="text-[20vw] leading-none transform -mt-16">
            '27
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

        {/* Literal Flashbang Grenade */}
        {/* <motion.div 
          className="absolute inset-0 bg-white pointer-events-none z-[100] flex items-center justify-center overflow-hidden"
          style={{ opacity: flashbangOpacity }}
        >
          <motion.div 
            className="font-sans font-thin text-[8vw] md:text-[6vw] text-black tracking-[0.2em] uppercase whitespace-nowrap opacity-80"
            style={{ 
              scale: useTransform(scrollYProgress, [0.33, 1], [0.9, 1.1]),
            }}
          >
            SHBAAANNGGG
          </motion.div>
        </motion.div> */}
      </div>
    </div>
  );
}
