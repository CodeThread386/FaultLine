"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function ParallaxCrash() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "200%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["0%", "-100%"]);
  const y3 = useTransform(scrollYProgress, [0, 1], ["-50%", "150%"]);
  const y4 = useTransform(scrollYProgress, [0, 1], ["50%", "-150%"]);

  return (
    <div ref={containerRef} className="h-[150vh] relative overflow-hidden bg-black flex items-center justify-center border-t-[24px] border-b-[24px] border-white transform -skew-y-3 my-32">
      <motion.div style={{ y: y1 }} className="absolute z-10 opacity-80 mix-blend-difference pointer-events-none">
        <h2 className="fl-display text-[20vw] tracking-tighter leading-none text-white uppercase whitespace-nowrap transform -rotate-12">
          SYSTEM ERROR
        </h2>
      </motion.div>
      
      <motion.div style={{ y: y2 }} className="absolute z-20 opacity-80 mix-blend-difference pointer-events-none">
        <h2 className="fl-display text-[15vw] tracking-tighter leading-none text-transparent uppercase whitespace-nowrap transform rotate-6" style={{ WebkitTextStroke: "4px white" }}>
          CORE DUMP
        </h2>
      </motion.div>
      
      <motion.div style={{ y: y3 }} className="absolute z-30 opacity-80 mix-blend-difference pointer-events-none">
        <h2 className="fl-display text-[25vw] tracking-tighter leading-none text-white uppercase whitespace-nowrap">
          FATAL
        </h2>
      </motion.div>
      
      <motion.div style={{ y: y4 }} className="absolute z-40 opacity-80 mix-blend-difference pointer-events-none">
        <h2 className="fl-display text-[12vw] tracking-tighter leading-none text-transparent uppercase whitespace-nowrap transform rotate-12" style={{ WebkitTextStroke: "2px white" }}>
          UNRECOVERABLE
        </h2>
      </motion.div>
    </div>
  );
}
