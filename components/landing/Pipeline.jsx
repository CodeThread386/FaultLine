"use client";

import HorizontalScroll from "./HorizontalScroll";
import { useEffect, useState } from "react";

const DEFAULT_FEATURES = [
  {
    title: "PHASE 1: BUILD",
    tag: "CHAOS INITIATION",
    desc: "Intentionally build a broken, chaotic system. Pitch it to the judges as a revolutionary startup.",
    offset: "translate-y-[6vh]",
    color: "#ff0000",
    badgeBg: "bg-[#ff0000] text-black",
    borderColor: "border-[#ff0000]",
    numColor: "text-[#ff0000]",
    accentBorder: "border-l-[#ff0000]",
    status: "ACTIVE",
  },
  {
    title: "THE BLIND SWAP",
    tag: "HANDOVER PROTOCOL",
    desc: "At lunch, your disaster is taken away. You inherit another team's cursed codebase from your track.",
    offset: "translate-y-[-5vh]",
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
    offset: "translate-y-[6vh]",
    color: "#ff0000",
    badgeBg: "bg-[#ff0000] text-black",
    borderColor: "border-[#ff0000]",
    numColor: "text-[#ff0000]",
    accentBorder: "border-l-[#ff0000]",
    status: "UPCOMING",
  },
  {
    title: "THE JUDGEMENT",
    tag: "FINAL VERDICT",
    desc: "Present your full arc. Phase 1 and Phase 2 are independent competitions—everyone has a shot.",
    offset: "translate-y-[-6vh]",
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
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/phases`);
        const data = await res.json();

        setFeatures(prev =>
          prev.map((item, index) => ({
            ...item,
            status: data[index]?.status ?? item.status,
          }))
        );
      } catch (err) {
        console.log(err);
      }
    }

    fetchStatus();
  }, []);

  return (
    <HorizontalScroll>

      <div className="w-[100vw] h-full flex flex-col justify-center px-12 md:px-32 shrink-0">
        <h2 className="fl-display text-[15vw] tracking-tighter z-10 animate-shake relative">
          <span className="text-[#ff0000]">THE </span>
          <br />
          PIPELINE
        </h2>

        <p className="text-base md:text-lg font-display font-black uppercase max-w-4xl mt-12 border-l-[16px] border-[#00f0ff] pl-8 text-white bg-transparent/60 backdrop-blur-md p-6 border-y border-r border-[#00f0ff]/30">
          Two phases.{" "}
          <span className="text-[#ff0000]">
            Complete architectural handover.
          </span>{" "}
          <span className="text-[#00f0ff]">
            No mercy.
          </span>
        </p>
      </div>


      {features.map((feature, i) => (
        <div
          key={i}
          className={`w-[95vw] md:w-[75vw] h-[65vh] shrink-0 flex items-center justify-center relative group transform ${feature.offset} ${i % 2 === 0 ? "skew-x-3" : "-skew-x-3"} transition-transform duration-300 hover:scale-[1.02]`}
        >

          <div className={`border-[12px] ${feature.borderColor} p-8 md:p-12 w-full h-full flex flex-col justify-between relative z-10 bg-transparent/90 backdrop-blur-md overflow-hidden`}>

            <div className="flex justify-between items-center z-10">
              <span className={`${feature.badgeBg} font-mono font-black text-xs md:text-sm px-4 py-1.5 uppercase tracking-widest border border-black shadow-[4px_4px_0_0_#ffffff]`}>
                {feature.tag}
              </span>

              <span className="font-mono text-xs text-white/60 tracking-widest">
                [ STEP 0{i + 1} / 04 ]
              </span>
            </div>


            <div className={`text-[12rem] md:text-[14rem] font-display font-black ${feature.numColor} opacity-50 absolute top-[-4rem] right-[-1rem] pointer-events-none select-none transform -rotate-12`}>
              0{i + 1}
            </div>


            <div className="mt-8 z-10">
              <h3 className="fl-display text-[4rem] md:text-[6.5rem] text-white leading-[0.85] mb-8 group-hover:translate-x-2 transition-transform">
                {feature.title}
              </h3>

              <p className={`text-sm md:text-base font-mono uppercase tracking-wider text-white/90 border-l-8 ${feature.accentBorder} pl-6 bg-white/5 py-4 pr-4 border-y border-r border-white/10`}>
                {feature.desc}
              </p>
            </div>


            <div className="flex justify-between items-center z-10 border-t border-white/20 pt-4 mt-4 font-mono text-xs uppercase tracking-widest text-white/50">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full animate-ping" style={{ backgroundColor: feature.color }} />
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