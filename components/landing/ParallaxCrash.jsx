"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function ParallaxCrash() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], ["-100%", "-350%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["200%", "-250%"]);
  const y3 = useTransform(scrollYProgress, [0, 1], ["-150%", "250%"]);
  const y4 = useTransform(scrollYProgress, [0, 1], ["300%", "-350%"]);
  const y5 = useTransform(scrollYProgress, [0, 1], ["-50%", "250%"]);

  return (
    <div ref={containerRef} className="h-[250vh] w-full relative overflow-hidden bg-black flex items-center justify-center border-t-[24px] border-b-[24px] border-white transform -skew-y-3 mb-32">
      <motion.div style={{ y: y1 }} className="absolute z-10 opacity-90 mix-blend-difference pointer-events-none">
        <h2 className="fl-display text-[18vw] tracking-tighter leading-none text-white uppercase whitespace-nowrap transform -rotate-12">
          SYSTEM ERROR
        </h2>
      </motion.div>
      
      <motion.div style={{ y: y2 }} className="absolute z-20 opacity-90 mix-blend-difference pointer-events-none">
        <h2 className="fl-display text-[20vw] tracking-tighter leading-none text-transparent uppercase whitespace-nowrap transform -rotate-12" style={{ WebkitTextStroke: "6px #ff0000" }}>
          CORE DUMP
        </h2>
      </motion.div>
      
      <motion.div style={{ y: y3 }} className="absolute z-30 opacity-90 mix-blend-difference pointer-events-none">
        <h2 className="fl-display text-[30vw] tracking-tighter leading-none text-white uppercase whitespace-nowrap transform -rotate-3">
          FATAL
        </h2>
      </motion.div>
      
      <motion.div style={{ y: y4 }} className="absolute z-40 opacity-90 mix-blend-difference pointer-events-none">
        <h2 className="fl-display text-[15vw] tracking-tighter leading-none text-transparent uppercase whitespace-nowrap transform rotate-12" style={{ WebkitTextStroke: "4px white" }}>
          UNRECOVERABLE
        </h2>
      </motion.div>

      <motion.div style={{ y: y5 }} className="absolute z-50 opacity-90 mix-blend-difference pointer-events-none">
        <h2 className="fl-display text-[20vw] tracking-tighter leading-none text-[#ff0000] uppercase whitespace-nowrap transform -rotate-6">
          CORRUPTION
        </h2>
      </motion.div>
    </div>
  );
}
