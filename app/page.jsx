"use client";
import Link from "next/link";
import { MoveRight } from "lucide-react";
import HeroMask from "@/components/landing/HeroMask";
import VelocityMarquee from "@/components/landing/VelocityMarquee";
import Pipeline from "@/components/landing/Pipeline";
import TesseractSvg from "@/components/landing/TesseractSvg";
import InfiniteZoom from "@/components/landing/InfiniteZoom";
import MagneticButton from "@/components/landing/MagneticButton";
import GravitasEvents from "@/components/landing/GravitasEvents";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white relative overflow-x-clip selection:bg-white selection:text-black">
      {/* Global animated SVG hypercube tied to scroll */}
      <TesseractSvg />

      {/* Global CSS overlays */}
      <div className="absolute inset-0 fl-dot-grid pointer-events-none opacity-20"></div>

      {/* SECTION 1: HERO MASK */}
      <section className="relative z-10 mx-auto max-w-5xl px-3 sm:px-6 md:px-8 pt-8 sm:pt-14 overflow-hidden">
        <HeroMask />
      </section>

      {/* SECTION 2: TOP VELOCITY MARQUEE */}
      <section
        id="hide-navbar-trigger"
        className="relative z-10 w-[110vw] ml-[-5vw] py-4 bg-transparent transform -skew-y-3 mt-12 sm:mt-24 md:mt-40 overflow-hidden"
      >
        <VelocityMarquee
          text="ERROR • REBUILD • EXPLOIT • "
          baseVelocity={3}
        />
      </section>

  {/* SECTION 3 */}
  <Pipeline />

  {/* SECTION 4 */}
  <section className="relative z-10 w-[110vw] ml-[-5vw] py-4 bg-transparent transform -skew-y-3 overflow-hidden">
    <VelocityMarquee
      text="CRITICAL FAILURE • SYSTEM BREACH • "
      baseVelocity={-5}
    />
  </section>

      {/* SECTION 5: GRAVITAS */}
      {/* <section className="relative z-10 w-full">
        <InfiniteZoom />
      </section> */}

      {/* The Directive & Tracks*/}
      <section className="relative z-10 w-full bg-transparent py-32 border-t-[16px] border-white">
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
                    <span className="fl-display text-5xl md:text-7xl w-32 md:w-48 shrink-0 group-hover:text-black group-hover:scale-110 transition-transform origin-left">08:00</span>
                    <span className="font-mono text-xl md:text-3xl font-black uppercase tracking-tighter">PHASE 1 BEGINS</span>
                  </div>
                  <div className="flex items-center py-8 border-t-4 border-white/20 hover:bg-white hover:text-black transition-colors px-4 -mx-4 group cursor-crosshair">
                    <span className="fl-display text-5xl md:text-7xl w-32 md:w-48 shrink-0 text-white/30 group-hover:text-black group-hover:scale-110 transition-transform origin-left">13:00</span>
                    <span className="font-mono text-xl md:text-3xl font-black uppercase tracking-tighter">THE SWAP (LUNCH)</span>
                  </div>
                  <div className="flex items-center py-8 border-t-4 border-white/20 hover:bg-white hover:text-black transition-colors px-4 -mx-4 group cursor-crosshair">
                    <span className="fl-display text-5xl md:text-7xl w-32 md:w-48 shrink-0 group-hover:text-black group-hover:scale-110 transition-transform origin-left">14:00</span>
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
                  <span className="border-4 border-white text-white px-6 py-3 hover:bg-white hover:text-black transition-colors cursor-crosshair">BANKING</span>
                  <span className="border-4 border-white text-white px-6 py-3 hover:bg-white hover:text-black transition-colors cursor-crosshair">FIN-TECH</span>
                  <span className="border-4 border-white text-white px-6 py-3 hover:bg-white hover:text-black transition-colors cursor-crosshair">E-COMMERCE</span>
                  <span className="border-4 border-white text-white px-6 py-3 hover:bg-white hover:text-black transition-colors cursor-crosshair">FOOD DELIVERY</span>
                  <span className="border-4 border-white text-white px-6 py-3 hover:bg-white hover:text-black transition-colors cursor-crosshair">DATING APP</span>
                  <span className="border-4 border-white text-white px-6 py-3 hover:bg-white hover:text-black transition-colors cursor-crosshair">JOB PORTAL</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* SECTION: GRAVITAS EVENTS */}
      <GravitasEvents />

      {/* SECTION 6: CTA / MAGNETIC BUTTON */}
      <section className="h-[80vh] w-[110vw] ml-[-5vw] flex items-center justify-center relative z-10 bg-transparent border-t-[32px] border-white transform skew-y-3 mt-32 overflow-hidden">

        <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none mix-blend-difference" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0,100 L100,0" stroke="white" strokeWidth="4" strokeDasharray="5,20" className="animate-jitter" />
          <path d="M0,0 L100,100" stroke="white" strokeWidth="2" strokeDasharray="1,10" className="animate-pulse" />
        </svg>

        <div className="flex flex-col items-center transform -skew-y-3 relative z-20 mt-10 sm:mt-0">
          <h2 className="fl-display text-[14vw] sm:text-[10vw] mb-16 tracking-tighter text-center text-white">
            SYSTEM <span className="text-[#ff0000]">READY</span>
          </h2>
          <Link href="/login">
            <MagneticButton className="border-[6px] sm:border-[12px] border-white px-10 sm:px-24 py-5 sm:py-12 fl-display text-3xl sm:text-6xl tracking-tighter bg-transparent flex items-center gap-3 sm:gap-8 shadow-[10px_10px_0_0_#ffffff] sm:shadow-[20px_20px_0_0_#ffffff] hover:shadow-none transition-shadow">
              LOGIN <MoveRight size={80} className="animate-pulse text-[#00f0ff] drop-shadow-[0_0_15px_rgba(0,240,255,0.8)] group-hover:text-gray-600 group-hover:drop-shadow-none transition-colors duration-300" />
            </MagneticButton>
          </Link>
        </div>
      </section>

    </main>
  );
}
