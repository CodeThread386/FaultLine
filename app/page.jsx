"use client";
import Link from "next/link";
import { MoveRight } from "lucide-react";
import HeroMask from "@/components/landing/HeroMask";
import VelocityMarquee from "@/components/landing/VelocityMarquee";
import HorizontalScroll from "@/components/landing/HorizontalScroll";
import TesseractSvg from "@/components/landing/TesseractSvg";
import InfiniteZoom from "@/components/landing/InfiniteZoom";
import MagneticButton from "@/components/landing/MagneticButton";

const FEATURES = [
  {
    title: "PHASE 1: BUILD",
    tag: "CHAOS INITIATION",
    desc: "Intentionally build a broken, chaotic system. Pitch it to the judges as a revolutionary startup.",
    offset: "translate-y-[6vh]",
    color: "#ff0000",
    shadow: "shadow-[16px_16px_0_0_#ff0000]",
    badgeBg: "bg-[#ff0000] text-black",
    borderColor: "border-[#ff0000]",
    numColor: "text-[#ff0000]",
    accentBorder: "border-l-[#ff0000]"
  },
  {
    title: "THE BLIND SWAP",
    tag: "HANDOVER PROTOCOL",
    desc: "At lunch, your disaster is taken away. You inherit another team's cursed codebase from your track.",
    offset: "translate-y-[-5vh]",
    color: "#00f0ff",
    shadow: "shadow-[16px_16px_0_0_#00f0ff]",
    badgeBg: "bg-[#00f0ff] text-black",
    borderColor: "border-[#00f0ff]",
    numColor: "text-[#00f0ff]",
    accentBorder: "border-l-[#00f0ff]"
  },
  {
    title: "PHASE 2: REDEMPTION",
    tag: "SYSTEM REBUILD",
    desc: "Diagnose their mess, debug their traps, and rebuild the system from the ground up cleanly.",
    offset: "translate-y-[-5vh]",
    color: "#ff0000",
    shadow: "shadow-[16px_16px_0_0_#ff0000]",
    badgeBg: "bg-[#ff0000] text-black",
    borderColor: "border-[#ff0000]",
    numColor: "text-[#ff0000]",
    accentBorder: "border-l-[#ff0000]"
  },
  {
    title: "THE JUDGEMENT",
    tag: "FINAL VERDICT",
    desc: "Present your full arc. Phase 1 and Phase 2 are independent competitions—everyone has a shot.",
    offset: "translate-y-[-6vh]",
    color: "#00f0ff",
    shadow: "shadow-[16px_16px_0_0_#00f0ff]",
    badgeBg: "bg-[#00f0ff] text-black",
    borderColor: "border-[#00f0ff]",
    numColor: "text-[#00f0ff]",
    accentBorder: "border-l-[#00f0ff]"
  }
];

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white relative overflow-x-clip selection:bg-white selection:text-black">
      {/* Global animated SVG hypercube tied to scroll */}
      <TesseractSvg />

      {/* Global CSS overlays */}
      <div className="fl-scanline"></div>
      <div className="absolute inset-0 fl-dot-grid pointer-events-none opacity-20"></div>

      {/* SECTION 1: HERO MASK */}
      <section className="relative z-10 mx-auto max-w-5xl px-4 md:px-8 pt-14">
        <HeroMask />
      </section>

      {/* SECTION 2: TOP VELOCITY MARQUEE */}
      <section className="relative z-10 w-[110vw] ml-[-5vw] py-4 bg-black transform -skew-y-3 mt-40 overflow-hidden">
        <VelocityMarquee text="ERROR • REBUILD • EXPLOIT • " baseVelocity={3} />
      </section>

      {/* SECTION 3: HORIZONTAL PIPELINE */}
      <HorizontalScroll>
        <div className="w-[100vw] h-full flex flex-col justify-center px-12 md:px-32 shrink-0">
          <h2 className="fl-display text-[15vw] tracking-tighter z-10 animate-shake relative">
            <span className="text-[#ff0000]">THE </span>
            <br />
              PIPELINE
          </h2>

          <p className="text-base md:text-lg font-display font-black uppercase max-w-4xl mt-12 border-l-[16px] border-[#00f0ff] pl-8 text-white bg-black/60 backdrop-blur-md p-6 border-y border-r border-[#00f0ff]/30">
            Two phases. <span className="text-[#ff0000]">Complete architectural handover.</span> <span className="text-[#00f0ff]">No mercy.</span>
          </p>
        </div>

        {FEATURES.map((feature, i) => (
          <div key={i} className={`w-[80vw] md:w-[60vw] h-[65vh] shrink-0 flex items-center justify-center relative group transform ${feature.offset} ${i % 2 === 0 ? 'skew-x-3' : '-skew-x-3'} transition-transform duration-300 hover:scale-[1.02]`}>
            <div className={`border-[12px] ${feature.borderColor} p-8 md:p-12 w-full h-full flex flex-col justify-between relative z-10 bg-black/90 backdrop-blur-md overflow-hidden`}>
              {/* Tag / Badge Header */}
              <div className="flex justify-between items-center z-10">
                <span className={`${feature.badgeBg} font-mono font-black text-xs md:text-sm px-4 py-1.5 uppercase tracking-widest border border-black shadow-[4px_4px_0_0_#ffffff]`}>
                  {feature.tag}
                </span>
                <span className="font-mono text-xs text-white/60 tracking-widest">
                  [ STEP 0{i + 1} / 04 ]
                </span>
              </div>

              {/* Giant Watermark Number */}
              <div
                className={`text-[12rem] md:text-[14rem] font-display font-black ${feature.numColor} opacity-25 absolute top-[-4rem] right-[-1rem] pointer-events-none select-none transform -rotate-12`}
              >
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

              {/* Bottom Cyber Bar */}
              <div className="flex justify-between items-center z-10 border-t border-white/20 pt-4 mt-4 font-mono text-xs uppercase tracking-widest text-white/50">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full animate-ping" style={{ backgroundColor: feature.color }} />
                  STATUS: ACTIVE
                </span>
                <span style={{ color: feature.color }}>FAULTLINE // SECTOR 0{i + 1}</span>
              </div>

            </div>
          </div>
        ))}
      </HorizontalScroll>
      {/* SECTION 3: PARALLAX CRASH */}
      {/* <section className="relative z-10 mb-16 w-full overflow-hidden">
        <ParallaxCrash />
      </section> */}

      {/* SECTION 4: BOTTOM VELOCITY MARQUEE */}
      <section className="relative z-10 w-[110vw] ml-[-5vw] py-4 bg-black transform -skew-y-3 overflow-hidden">
        <VelocityMarquee text="CRITICAL FAILURE • SYSTEM BREACH • " baseVelocity={-5} />
      </section>

      {/* SECTION 5: GRAVITAS */}
      {/* <section className="relative z-10 w-full">
        <InfiniteZoom />
      </section> */}

      {/* The Directive & Tracks block is not part of the requested landing sequence. */}
      <section className="relative z-10 w-full bg-black py-32 border-t-[16px] border-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">

          <div className="flex flex-col xl:flex-row gap-16 xl:gap-32">

            {/* LEFT COLUMN: THE DIRECTIVE */}
            <div className="flex-1">
              <h2 className="fl-display text-[15vw] md:text-[10vw] xl:text-[8vw] leading-[0.8] mb-16 uppercase tracking-tighter mix-blend-difference text-white">
                THE<br />DIRECTIVE
              </h2>

              <div className="space-y-16">
                <div className="relative">
                  <div className="absolute -left-6 md:-left-12 top-0 bottom-0 w-2 md:w-4 bg-[#ff0000]"></div>
                  <h3 className="fl-display text-5xl md:text-7xl mb-6 uppercase">PHASE 1: CHAOS</h3>
                  <p className="font-mono text-xl md:text-2xl text-white/80 leading-relaxed uppercase">
                    Build a disaster. Bad architecture, spaghetti logic. Pitch it to the judges as a revolutionary startup.
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute -left-6 md:-left-12 top-0 bottom-0 w-2 md:w-4 bg-white"></div>
                  <h3 className="fl-display text-5xl md:text-7xl mb-6 uppercase">PHASE 2: REDEMPTION</h3>
                  <p className="font-mono text-xl md:text-2xl text-white/80 leading-relaxed uppercase">
                    Inherit a cursed codebase. Diagnose. Survive. Rebuild it cleanly from the ground up.
                  </p>
                </div>

                <div className="bg-[#ff0000] text-black p-8 transform -rotate-1 border-4 border-white mt-16 shadow-[16px_16px_0_0_#ffffff]">
                  <p className="font-mono text-2xl font-black uppercase">
                    Phase 1 & Phase 2 are independent competitions. No one is eliminated early. Everyone has a shot.
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: TIMELINE & TRACKS */}
            <div className="flex-1 flex flex-col justify-between mt-16 xl:mt-0">
              <div>
                <h3 className="fl-display text-[10vw] md:text-[6vw] xl:text-[5vw] leading-none mb-12 border-b-[16px] border-white pb-4">
                  TIMELINE
                </h3>

                <div className="flex flex-col border-b-4 border-white/20">
                  <div className="flex items-center py-8 border-t-4 border-white/20 hover:bg-white hover:text-black transition-colors px-4 -mx-4 group cursor-crosshair">
                    <span className="fl-display text-5xl md:text-7xl w-32 md:w-48 shrink-0 group-hover:scale-110 transition-transform origin-left">08:00</span>
                    <span className="font-mono text-xl md:text-3xl font-black uppercase tracking-tighter">PHASE 1 BEGINS</span>
                  </div>
                  <div className="flex items-center py-8 border-t-4 border-white/20 hover:bg-white hover:text-black transition-colors px-4 -mx-4 group cursor-crosshair">
                    <span className="fl-display text-5xl md:text-7xl w-32 md:w-48 shrink-0 text-white/30 group-hover:text-black group-hover:scale-110 transition-transform origin-left">13:00</span>
                    <span className="font-mono text-xl md:text-3xl font-black uppercase tracking-tighter">THE SWAP (LUNCH)</span>
                  </div>
                  <div className="flex items-center py-8 border-t-4 border-white/20 hover:bg-white hover:text-black transition-colors px-4 -mx-4 group cursor-crosshair">
                    <span className="fl-display text-5xl md:text-7xl w-32 md:w-48 shrink-0 group-hover:scale-110 transition-transform origin-left">14:00</span>
                    <span className="font-mono text-xl md:text-3xl font-black uppercase tracking-tighter">PHASE 2 BEGINS</span>
                  </div>
                  <div className="flex items-center py-8 border-t-4 border-white/20 hover:bg-white hover:text-black transition-colors px-4 -mx-4 group cursor-crosshair">
                    <span className="fl-display text-5xl md:text-7xl w-32 md:w-48 shrink-0 text-white/30 group-hover:text-black group-hover:scale-110 transition-transform origin-left">20:00</span>
                    <span className="font-mono text-xl md:text-3xl font-black uppercase tracking-tighter">JUDGEMENT</span>
                  </div>
                </div>
              </div>

              <div className="mt-24">
                <h3 className="fl-display text-4xl mb-8 text-white/50 uppercase tracking-widest border-l-4 border-white/50 pl-6">TARGET SECTORS</h3>
                <div className="flex flex-wrap gap-4 font-mono text-xl font-bold uppercase">
                  <span className="border-4 border-[#ff0000] text-[#ff0000] px-6 py-3 hover:bg-[#ff0000] hover:text-black transition-colors cursor-crosshair">BANKING</span>
                  <span className="border-4 border-white px-6 py-3 hover:bg-white hover:text-black transition-colors cursor-crosshair">E-COMMERCE</span>
                  <span className="border-4 border-white px-6 py-3 hover:bg-white hover:text-black transition-colors cursor-crosshair">FOOD DELIVERY</span>
                  <span className="border-4 border-white px-6 py-3 hover:bg-white hover:text-black transition-colors cursor-crosshair">DATING APP</span>
                  <span className="border-4 border-[#ff0000] text-[#ff0000] px-6 py-3 hover:bg-[#ff0000] hover:text-black transition-colors cursor-crosshair">JOB PORTAL</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: CTA / MAGNETIC BUTTON */}
      <section className="h-[80vh] w-[110vw] ml-[-5vw] flex items-center justify-center relative z-10 bg-black border-t-[32px] border-white transform skew-y-3 mt-32 overflow-hidden">

        <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none mix-blend-difference" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0,100 L100,0" stroke="white" strokeWidth="4" strokeDasharray="5,20" className="animate-jitter" />
          <path d="M0,0 L100,100" stroke="white" strokeWidth="2" strokeDasharray="1,10" className="animate-pulse" />
        </svg>

        <div className="flex flex-col items-center transform -skew-y-3 relative z-20">
          <h2 className="fl-display text-[10vw] mb-16 tracking-tighter text-center mix-blend-difference text-white">
            SYSTEM READY
          </h2>
          <Link href="/login">
            <MagneticButton className="border-[12px] border-white px-24 py-12 fl-display text-6xl tracking-tighter bg-black flex items-center gap-8 shadow-[20px_20px_0_0_#ffffff] hover:shadow-none transition-shadow">
              INITIALIZE <MoveRight size={80} className="animate-pulse" />
            </MagneticButton>
          </Link>
        </div>
      </section>

    </main>
  );
}
