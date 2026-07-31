"use client";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function MagneticButton({ children, className, onClick, pushOffset = 20 }) {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouse = (e) => {
    setIsHovered(true);
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.2, y: middleY * 0.2 });
  };

  const reset = () => {
    setIsHovered(false);
    setPosition({ x: 0, y: 0 });
  };

  const targetX = (isHovered ? pushOffset : 0) + position.x;
  const targetY = (isHovered ? pushOffset : 0) + position.y;

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouse}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={reset}
      onClick={onClick}
      animate={{ x: targetX, y: targetY }}
      transition={{ type: "spring", stiffness: 180, damping: 14, mass: 0.1 }}
      className={cn("relative z-20 overflow-hidden group", className)}
    >
      <div className="absolute inset-0 bg-white transform translate-y-[101%] group-hover:translate-y-0 transition-transform duration-300 ease-out z-0"></div>
      <span className="relative z-10 text-white group-hover:text-black transition-colors duration-300 block">
        {children}
      </span>
    </motion.button>
  );
}
