"use client";

import HorizontalScroll from "./HorizontalScroll";
import { getPhaseDisplayStatus } from "@/lib/phase-control";
import { useEffect, useState } from "react";

const DEFAULT_FEATURES = [
  {
    title: "PHASE 1: BUILD",
    tag: "CHAOS INITIATION",
    desc: "Intentionally build a broken, chaotic system. Pitch it to the judges as a revolutionary startup.",
    offset: "translate-y-0 sm:translate-y-[4vh] md:translate-y-[6vh] skew-x-0 sm:skew-x-1 md:skew-x-3",
    color: "#ff0000",
    badgeBg: "bg-[#ff0000] text-black",
    borderColor: "border-[#ff0000]",
    numColor: "text-[#ff0000]",
    accentBorder: "border-l-[#ff0000]",
    status: "NOT STARTED",
    phaseName: "phase_1",
  },
  {
    title: "THE BLIND SWAP",
    tag: "HANDOVER PROTOCOL",
    desc: "At lunch, your disaster is taken away. You inherit another team's cursed codebase from your track.",
    offset: "-translate-y-0 sm:-translate-y-[4vh] md:-translate-y-[5vh] -skew-x-0 sm:-skew-x-1 md:-skew-x-3",
    color: "#00f0ff",
    badgeBg: "bg-[#00f0ff] text-black",
    borderColor: "border-[#00f0ff]",
    numColor: "text-[#00f0ff]",
    accentBorder: "border-l-[#00f0ff]",
    status: "UPCOMING",
  },
  {
    title: "PHASE 2: REDEMPTION",
    tag: "SYSTEM REBUILD",
    desc: "Diagnose their mess, debug their traps, and rebuild the system from the ground up cleanly.",
    offset: "translate-y-0 sm:translate-y-[4vh] md:translate-y-[6vh] skew-x-0 sm:skew-x-1 md:skew-x-3",
    color: "#ff0000",
    badgeBg: "bg-[#ff0000] text-black",
    borderColor: "border-[#ff0000]",
    numColor: "text-[#ff0000]",
    accentBorder: "border-l-[#ff0000]",
    status: "UPCOMING",
    phaseName: "phase_2",
  },
  {
    title: "THE JUDGEMENT",
    tag: "FINAL VERDICT",
    desc: "Present your full arc. Phase 1 and Phase 2 are independent competitions—everyone has a shot.",
    offset: "-translate-y-0 sm:-translate-y-[4vh] md:-translate-y-[6vh] -skew-x-0 sm:-skew-x-1 md:-skew-x-3",
    color: "#00f0ff",
    badgeBg: "bg-[#00f0ff] text-black",
    borderColor: "border-[#00f0ff]",
    numColor: "text-[#00f0ff]",
    accentBorder: "border-l-[#00f0ff]",
    status: "UPCOMING",
  },
];

export default function Pipeline() {
  const [features, setFeatures] = useState(DEFAULT_FEATURES);

  useEffect(() => {
    async function fetchStatus() {
      try {
        const url = "/api/phase";

        const res = await fetch(url, {
          cache: "no-store",
        });

        const data = await res.json();
        const phases = data.phases ?? [];

        const phase1 = phases.find(
          (phase) => phase.name === "phase_1"
        );

        const phase2 = phases.find(
          (phase) => phase.name === "phase_2"
        );

        setFeatures((prev) =>
          prev.map((item) => {
            if (item.phaseName === "phase_1") {
              return {
                ...item,
                status: getPhaseDisplayStatus(phase1).label.toUpperCase(),
              };
            }

            if (item.phaseName === "phase_2") {
              return {
                ...item,
                status: getPhaseDisplayStatus(phase2).label.toUpperCase(),
              };
            }

            return item;
          })
        );
      } catch (err) {
        console.error("PHASE FETCH ERROR:", err);
      }
    }

    fetchStatus();

    const interval = setInterval(fetchStatus, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <HorizontalScroll>
      {/* Title Header Card */}
      <div className="w-[85vw] sm:w-[90vw] md:w-[100vw] h-full flex flex-col justify-center px-4 sm:px-8 md:px-32 shrink-0">
        <h2 className="fl-display text-4xl sm:text-7xl md:text-[15vw] tracking-tighter z-10 animate-shake relative leading-[0.9] md:leading-[0.85]">
          <span className="text-[#ff0000]">THE </span>
          <br />
          PIPELINE
        </h2>

        <p className="text-xs sm:text-base md:text-lg font-mono font-black uppercase max-w-4xl mt-4 sm:mt-8 md:mt-12 border-l-4 sm:border-l-[12px] md:border-l-[16px] border-[#00f0ff] pl-3 sm:pl-6 md:pl-8 text-white bg-transparent/60 backdrop-blur-md p-3 sm:p-6 border-y border-r border-[#00f0ff]/30 leading-relaxed">
          Two phases.{" "}
          <span className="text-[#ff0000]">
            Complete architectural handover.
          </span>{" "}
          <span className="text-[#00f0ff]">
            No mercy.
          </span>
        </p>
      </div>

      {/* Pipeline Feature Cards */}
      {features.map((feature, i) => (
        <div
          key={i}
          className={`w-[85vw] sm:w-[90vw] md:w-[75vw] h-[72vh] sm:h-[68vh] md:h-[65vh] shrink-0 flex items-center justify-center relative group transform ${feature.offset} transition-transform duration-300 hover:scale-[1.02]`}
        >
          <div
            className={`border-4 sm:border-8 md:border-[12px] ${feature.borderColor} p-4 sm:p-6 md:p-12 w-full h-full flex flex-col justify-between relative z-10 bg-transparent/90 backdrop-blur-md overflow-hidden`}
          >
            {/* Step Tag Header */}
            <div className="flex justify-between items-center z-10">
              <span
                className={`${feature.badgeBg} font-mono font-black text-[8px] sm:text-xs md:text-sm px-1.5 sm:px-3 md:px-4 py-0.5 sm:py-1.5 uppercase tracking-wide border border-black shadow-[2px_2px_0_0_#ffffff] sm:shadow-[4px_4px_0_0_#ffffff]`}
              >
                {feature.tag}
              </span>

              <span className="font-mono text-[10px] sm:text-xs text-white/60 tracking-widest">
                [ STEP 0{i + 1} / 04 ]
              </span>
            </div>

            {/* Background Number */}
            <div
              className={`text-[5rem] sm:text-[9rem] md:text-[14rem] font-display font-black ${feature.numColor} opacity-30 md:opacity-50 absolute top-[-1.5rem] sm:top-[-3rem] md:top-[-4rem] right-[-0.5rem] md:right-[-1rem] pointer-events-none select-none transform -rotate-12`}
            >
              0{i + 1}
            </div>

            {/* Main Content */}
            <div className="mt-3 sm:mt-6 md:mt-8 z-10">
              <h3 className="fl-display text-2xl sm:text-5xl md:text-[6.5rem] text-white leading-tight md:leading-[0.85] mb-2 sm:mb-6 md:mb-8 group-hover:translate-x-2 transition-transform uppercase">
                {feature.title}
              </h3>

              <p
                className={`text-[11px] sm:text-sm md:text-base font-mono uppercase tracking-wider text-white/90 border-l-4 sm:border-l-6 md:border-l-8 ${feature.accentBorder} pl-3 sm:pl-4 md:pl-6 bg-white/5 py-2 sm:py-3 md:py-4 pr-2 sm:pr-4 border-y border-r border-white/10 leading-relaxed`}
              >
                {feature.desc}
              </p>
            </div>

            {/* Status Footer */}
            <div className="flex justify-between items-center z-10 border-t border-white/20 pt-3 sm:pt-4 mt-2 sm:mt-4 font-mono text-[10px] sm:text-xs uppercase tracking-widest text-white/50">
              <span className="flex items-center gap-1.5 sm:gap-2">
                <span
                  className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full animate-ping"
                  style={{ backgroundColor: feature.color }}
                />
                STATUS: {feature.status}
              </span>

              <span style={{ color: feature.color }}>
                FAULTLINE // SECTOR 0{i + 1}
              </span>
            </div>
          </div>
        </div>
      ))}
    </HorizontalScroll>
  );
}