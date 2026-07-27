"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function HorizontalScroll({ children }) {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%","-75%"]);

  return (
    <section ref={targetRef} className="relative h-[400vh] bg-black w-full overflow-clip">
      {/* Sticky horizontal viewport */}
      <div className="sticky top-0 flex h-screen items-center overflow-hidden border-t-[8px] border-t-[#ff0000] border-b-[8px] border-b-[#00f0ff] bg-black relative">
        <motion.div style={{ x }} className="flex gap-24 px-16 relative z-10 items-center">
          {children}
        </motion.div>
      </div>
    </section>
  );
}

