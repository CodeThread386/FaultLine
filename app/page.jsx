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
    title: "ROOT ACCESS",
    desc: "Complete autonomy. Break the rules, manipulate the system, win the game.",
    offset: "translate-y-[-10vh]"
  },
  {
    title: "PHASE 1: DESTROY",
    desc: "Build a chaotic system. Embed exploits. Trap the next team.",
    offset: "translate-y-[15vh]"
  },
  {
    title: "PHASE 2: REBUILD",
    desc: "Inherit a broken mess. Debug their traps. Refactor into perfection.",
    offset: "translate-y-[-20vh]"
  },
  {
    title: "MONITOR",
    desc: "Global leaderboards track chaos and resolution in real time.",
    offset: "translate-y-[10vh]"
  }
];

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden selection:bg-white selection:text-black">
      {/* Global animated SVG hypercube tied to scroll */}
      <TesseractSvg />

      {/* Global CSS overlays */}
      <div className="fl-scanline"></div>
      <div className="absolute inset-0 fl-dot-grid pointer-events-none opacity-20"></div>

      {/* SECTION 1: HERO MASK */}
      <section className="relative z-10 border-b-[32px] border-white">
        <HeroMask />
      </section>

      {/* SECTION 2: PARALLAX CRASH */}
      <section className="relative z-10">
        <ParallaxCrash />
      </section>

      {/* SECTION 3: VELOCITY MARQUEE */}
      <section className="relative z-10 py-32 bg-black transform -skew-y-3 my-16 overflow-hidden">
        <VelocityMarquee text="ERROR • REBUILD • EXPLOIT • " baseVelocity={3} />
        <div className="mt-16 transform scale-150 rotate-3">
          <VelocityMarquee text="CRITICAL FAILURE • SYSTEM BREACH • " baseVelocity={-5} />
        </div>
      </section>

      {/* SECTION 4: INFINITE ZOOM */}
      <section className="relative z-10">
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
          <div key={i} className={`w-[80vw] md:w-[60vw] h-[60vh] shrink-0 flex items-center justify-center relative group transform ${feature.offset} skew-x-${i % 2 === 0 ? '6' : '-6'}`}>
            <div className="absolute inset-0 bg-white transform translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] z-0"></div>
            <div className="border-[16px] border-white p-12 w-full h-full flex flex-col justify-between relative z-10 bg-black group-hover:bg-transparent transition-colors duration-500 hover:rotate-3">
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

      {/* SECTION 6: CTA / MAGNETIC BUTTON */}
      <section className="h-[80vh] w-full flex items-center justify-center relative z-10 bg-black border-t-[32px] border-white transform skew-y-3 mt-32 overflow-hidden">
        
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
