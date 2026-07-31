"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Cpu, Code, ShieldAlert, ArrowUpRight } from "lucide-react";

const EVENTS = [
  {
    id: "micromouse",
    name: "MICROMOUSE",
    tag: "ROBOTICS & ALGORITHMS",
    logo: "/micromouse.png",
    fallbackIcon: Cpu,
    color: "#ff0000",
    description:
      "Autonomous maze-solving robotics competition. Test your hardware algorithms, speed, mapping capabilities, and precision control under intense time constraints.",
  },
  {
    id: "sourcesprint",
    name: "SOURCESPRINT",
    tag: "OPEN SOURCE HACKATHON",
    logo: "/sourcesprint.png",
    fallbackIcon: Code,
    color: "#00f0ff",
    description:
      "Kick off with a hands-on workshop on open-source, Git, and effective version control. Explore unfamiliar repositories, tackle real-world issues, submit production-ready PRs, collaborate, and climb the leaderboard.",
  },
  {
    id: "faultline",
    name: "FAULTLINE",
    tag: "CHAOS HACKATHON",
    logo: "/faultline.png",
    fallbackIcon: ShieldAlert,
    color: "#ff0000",
    description:
      "The ultimate chaos engineering and codebase redemption hackathon. Build intentional architectural disasters in Phase 1, then rebuild inherited cursed systems in Phase 2.",
  },
];

const headerVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.4, ease: "easeOut" },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 80 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 1.0,
      delay: index * 0.25,
      ease: [0.215, 0.61, 0.355, 1],
    },
  }),
};

export default function GravitasEvents() {
  const [imgErrors, setImgErrors] = useState({});

  const handleImgError = (id) => {
    setImgErrors((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <section className="relative z-10 w-full py-24 bg-transparent border-t-8 border-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ amount: 0.15, once: false }}
          variants={headerVariants}
          className="mb-16 border-b-4 border-white/20 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <div className="flex items-center gap-3 text-[#ff0000] font-mono text-sm font-bold uppercase tracking-widest mb-3">
              <span className="w-3 h-3 bg-[#ff0000] inline-block animate-pulse"></span>
              <span>GRAVITAS '26 PROTOCOL</span>
            </div>
            <h2 className="fl-display text-5xl md:text-7xl lg:text-8xl tracking-tighter uppercase text-white">
              OUR GRAVITAS EVENTS
            </h2>
          </div>
          <p className="font-mono text-sm md:text-base text-white/60 uppercase tracking-wider max-w-md">
            Once a year typa thing, not something you miss
          </p>
        </motion.div>

        {/* 3 Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {EVENTS.map((event, index) => {
            const FallbackIcon = event.fallbackIcon;
            const isImgError = imgErrors[event.id];

            return (
              <motion.div
                key={event.id}
                custom={index}
                initial="hidden"
                whileInView="visible"
                whileHover={{ x: 12, y: 12 }}
                viewport={{ amount: 0.15, once: false }}
                variants={cardVariants}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="group relative h-96 w-full cursor-pointer border-4 border-white bg-black p-8 shadow-[12px_12px_0_0_#ffffff] hover:shadow-none transition-shadow duration-[350ms] flex flex-col justify-between overflow-hidden"
              >
                {/* Accent top border highlight */}
                <div
                  className="absolute top-0 left-0 right-0 h-2 z-10"
                  style={{ backgroundColor: event.color }}
                />

                {/* --- DEFAULT UNHOVERED CONTENT --- */}
                <div className="relative z-10 flex flex-col items-center justify-center text-center h-full transition-all duration-[600ms] group-hover:translate-y-4 group-hover:opacity-0">
                  {/* Event Logo Container */}
                  <div className="w-36 h-36 mb-6 flex items-center justify-center relative">
                    {!isImgError ? (
                      <img
                        src={event.logo}
                        alt={`${event.name} Logo`}
                        onError={() => handleImgError(event.id)}
                        className="max-w-full max-h-full object-contain filter drop-shadow-[0_0_12px_rgba(255,255,255,0.9)] transition-transform duration-[600ms] group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full border-2 border-white/30 flex items-center justify-center bg-white/5">
                        <FallbackIcon className="w-12 h-12 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Event Tag */}
                  <span className="font-mono text-xs font-bold tracking-widest text-white/50 uppercase mb-2">
                    {event.tag}
                  </span>

                  {/* Event Name */}
                  <h3 className="fl-display text-4xl lg:text-5xl uppercase text-white tracking-tight">
                    {event.name}
                  </h3>

                  {/* Hover Prompt indicator */}
                  <div className="mt-6 flex items-center gap-1 font-mono text-xs text-white/40 group-hover:text-white uppercase tracking-wider">
                    <span>HOVER FOR INFO</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </div>
                </div>

                {/* --- HOVERED CONTENT (SWIPE TOP-TO-BOTTOM DESCRIPTION PANEL) --- */}
                <div
                  className="absolute inset-0 z-20 p-8 bg-black/95 backdrop-blur-md transform -translate-y-full group-hover:translate-y-0 transition-transform duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col justify-between border-b-4"
                  style={{ borderBottomColor: event.color }}
                >
                  <div>
                    {/* Header in Hover state */}
                    <div className="flex items-center justify-between border-b border-white/20 pb-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3"
                          style={{ backgroundColor: event.color }}
                        ></div>
                        <h4 className="fl-display text-2xl uppercase tracking-wider text-white">
                          {event.name}
                        </h4>
                      </div>
                      <span className="font-mono text-[10px] uppercase text-white/50 border border-white/30 px-2 py-0.5">
                        SPEC
                      </span>
                    </div>

                    {/* Event Description */}
                    <p className="font-mono text-sm leading-relaxed text-white/90 uppercase tracking-wide">
                      {event.description}
                    </p>
                  </div>

                  {/* Bottom info banner */}
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-white/60">
                    <span className="uppercase text-[11px] tracking-widest" style={{ color: event.color }}>
                      {event.tag}
                    </span>
                    <span className="text-white/40">GRAVITAS '26</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
