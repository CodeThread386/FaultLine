"use client";
import { motion, useScroll, useSpring } from "framer-motion";

export default function SvgBlueprint() {
  const { scrollYProgress } = useScroll();
  const pathLength = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <div className="fixed inset-0 pointer-events-none z-0 opacity-20 flex justify-center items-center overflow-hidden">
      <motion.svg
        viewBox="0 0 1000 1000"
        className="w-[150vw] h-[150vh] transform rotate-12"
        fill="none"
        stroke="white"
        strokeWidth="2"
      >
        <motion.path
          d="M 100 100 L 900 100 L 900 900 L 100 900 Z"
          style={{ pathLength }}
        />
        <motion.path
          d="M 100 100 L 500 500 L 900 100"
          style={{ pathLength }}
        />
        <motion.path
          d="M 100 900 L 500 500 L 900 900"
          style={{ pathLength }}
        />
        <motion.circle
          cx="500" cy="500" r="200"
          style={{ pathLength }}
          strokeDasharray="10 10"
        />
        <motion.rect
          x="400" y="400" width="200" height="200"
          style={{ pathLength }}
          strokeWidth="4"
        />
        <motion.path
          d="M 0 500 L 1000 500"
          style={{ pathLength }}
          strokeDasharray="5 20"
        />
        <motion.path
          d="M 500 0 L 500 1000"
          style={{ pathLength }}
          strokeDasharray="5 20"
        />
      </motion.svg>
    </div>
  );
}
