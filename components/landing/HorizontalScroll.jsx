"use client";
import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function HorizontalScroll({ children }) {
  const targetRef = useRef(null);
  const contentRef = useRef(null);
  const [maxScroll, setMaxScroll] = useState(0);

  useEffect(() => {
    const updateScroll = () => {
      if (contentRef.current) {
        const totalWidth = contentRef.current.scrollWidth;
        const viewportWidth = window.innerWidth;
        const offset = totalWidth - viewportWidth;
        setMaxScroll(offset > 0 ? offset : 0);
      }
    };

    updateScroll();
    window.addEventListener("resize", updateScroll);
    return () => window.removeEventListener("resize", updateScroll);
  }, [children]);

  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], [0, -maxScroll]);

  return (
    <section ref={targetRef} className="relative h-[400vh] bg-transparent w-full overflow-clip">
      {/* Sticky horizontal viewport */}
      <div className="sticky top-0 flex h-screen items-center overflow-hidden border-t-[8px] border-t-white border-b-[8px] border-b-white bg-transparent relative">
        <motion.div
          ref={contentRef}
          style={{ x }}
          className="flex gap-12 md:gap-24 px-8 md:px-16 relative z-10 items-center shrink-0"
        >
          {children}
        </motion.div>
      </div>
    </section>
  );
}
