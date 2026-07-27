"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function HorizontalScroll({ children }) {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%","-50%"]);

  return (
    <section ref={targetRef} className="relative h-[400vh] bg-black w-full">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden border-t-[12px] border-b-[12px] border-white bg-black">
        {/* Background SVG Watermark */}
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20 z-0" viewBox="0 0 100 100" preserveAspectRatio="none">
          <text x="50" y="50" dominantBaseline="middle" textAnchor="middle" fontSize="6" fontWeight="900" transform="rotate(-15 50 50)" fill="white" className="animate-jitter">CRITICAL_PIPELINE</text>
        </svg>
        
        <motion.div style={{ x }} className="flex gap-24 px-16 relative z-10 items-center">
          {children}
        </motion.div>
      </div>
    </section>
  );
}
