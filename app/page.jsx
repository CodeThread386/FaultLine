"use client";
import Link from "next/link";
import { MoveRight } from "lucide-react";
import HeroMask from "@/components/landing/HeroMask";
import VelocityMarquee from "@/components/landing/VelocityMarquee";
import HorizontalScroll from "@/components/landing/HorizontalScroll";
import TesseractSvg from "@/components/landing/TesseractSvg";
import ParallaxCrash from "@/components/landing/ParallaxCrash";
import InfiniteZoom from "@/components/landing/InfiniteZoom";
import MagneticButton from "@/components/landing/MagneticButton";

const FEATURES = [
  {
    title: "PHASE 1: BUILD",
    desc: "Intentionally build a broken, chaotic system. Pitch it to the judges as a revolutionary startup.",
    offset: "translate-y-[-10vh]"
  },
  {
    title: "THE BLIND SWAP",
    desc: "At lunch, your disaster is taken away. You inherit another team's cursed codebase from your track.",
    offset: "translate-y-[15vh]"
  },
  {
    title: "PHASE 2: REDEMPTION",
    desc: "Diagnose their mess, debug their traps, and rebuild the system from the ground up cleanly.",
    offset: "translate-y-[-5vh]"
  },
  {
    title: "THE JUDGEMENT",
    desc: "Present your full arc. Phase 1 and Phase 2 are independent competitions—everyone has a shot.",
    offset: "translate-y-[10vh]"
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

      {/* SECTION 3: PARALLAX CRASH */}
      <section className="relative z-10 mb-16 w-full overflow-hidden">
        <ParallaxCrash />
      </section>

      {/* SECTION 4: BOTTOM VELOCITY MARQUEE */}
      <section className="relative z-10 w-[110vw] ml-[-5vw] py-4 bg-black transform -skew-y-3 overflow-hidden">
        <VelocityMarquee text="CRITICAL FAILURE • SYSTEM BREACH • " baseVelocity={-5} />
      </section>

      {/* SECTION 4: INFINITE ZOOM */}
      <section className="relative z-10 w-full">
        <InfiniteZoom />
      </section>

      {/* SECTION 5: HORIZONTAL PIPELINE */}
      <HorizontalScroll>
        <div className="w-[100vw] h-full flex flex-col justify-center px-12 md:px-32 shrink-0">
          <h2 className="fl-display text-[15vw] tracking-tighter mix-blend-difference z-10 animate-shake" style={{ WebkitTextStroke: "4px white", color: "transparent" }}>
            THE <br /><span className="text-white transform translate-x-12 inline-block">PIPELINE</span>
          </h2>
          <p className="text-4xl font-display font-black uppercase max-w-4xl mt-12 border-l-[16px] border-white pl-8 mix-blend-difference">
            Two phases. Complete architectural handover. No mercy.
          </p>
        </div>

        {FEATURES.map((feature, i) => (
          <div key={i} className={`w-[80vw] md:w-[60vw] h-[60vh] shrink-0 flex items-center justify-center relative group transform ${feature.offset} ${i % 2 === 0 ? 'skew-x-6' : '-skew-x-6'}`}>
            <div className="absolute inset-0 bg-white transform translate-y-[100%] z-0"></div>
            <div className="border-[16px] border-white p-12 w-full h-full flex flex-col justify-between relative z-10 bg-black">
              <div className="text-[10rem] font-display font-black text-white mix-blend-difference opacity-50 absolute top-[-5rem] left-[-2rem] pointer-events-none transform -rotate-12">
                0{i + 1}
              </div>
              <div className="mt-16">
                <h3 className="fl-display text-[5rem] md:text-[8rem] text-white mix-blend-difference leading-[0.8] mb-12">
                  {feature.title}
                </h3>
                <p className="text-3xl font-mono uppercase tracking-widest text-white mix-blend-difference border-l-8 border-white pl-6">
                  {feature.desc}
                </p>
              </div>
            </div>
          </div>
        ))}
      </HorizontalScroll>

      {/* SECTION 5.5: THE DIRECTIVE & TRACKS */}
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
          <path d="M0,100 L100,0" stroke="white" strokeWidth="4" strokeDasharray="5,20" className="animate-jitter"/>
          <path d="M0,0 L100,100" stroke="white" strokeWidth="2" strokeDasharray="1,10" className="animate-pulse"/>
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
