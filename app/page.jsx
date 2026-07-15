import Link from "next/link";

const FEATURES = [
  {
    label: "Phase 1 / ERR",
    title: "BUILD THE WORST SYSTEM",
    desc: "Ship deliberately broken repos. Judges walk through live — no slides. Make it hurt."
  },
  {
    label: "Swap / FLT",
    title: "INHERIT THE MESS",
    desc: "Organizers assign cross-team codebases. You inherit their chaotic structure."
  },
  {
    label: "Phase 2 / FIX",
    title: "REDEMPTION PROTOCOL",
    desc: "Rebuild inherited code cleanly. Marks combine for final standings. Don't fail twice."
  },
  {
    label: "Live / SYNC",
    title: "REAL-TIME EXECUTION",
    desc: "Phase controls, strict deadlines, and activity feed — all in one volatile place."
  }
];

const MARQUEE_ITEMS = [
  "SYSTEM_FAILURE",
  "CORE_DUMP",
  "FAULTLINE",
  "SEGMENTATION_FAULT",
  "KERNEL_PANIC",
  "NULL_POINTER",
  "REBOOT_REQUIRED",
  "CRITICAL_ERROR"
];

export default function LandingPage() {
  const marquee = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <div className="animate-fade-in overflow-x-hidden bg-black text-white selection:bg-white selection:text-black fl-tech-grid relative">
      <div className="fl-scanline"></div>
      {/* Background SVG Watermark */}
      <svg className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-5 z-0" viewBox="0 0 100 100" preserveAspectRatio="none">
        <text x="50" y="50" dominantBaseline="middle" textAnchor="middle" fontSize="30" fontWeight="900" transform="rotate(-45 50 50)" fill="white">SYSTEM_FAILURE</text>
      </svg>
      
      {/* Hero */}
      <section className="relative w-full pb-32 pt-24 md:pt-40 min-h-screen flex items-center border-b-8 border-white overflow-visible">
        
        <div className="absolute top-10 left-10 w-24 h-24 border-t-4 border-l-4 border-white animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 border-b-4 border-r-4 border-white animate-pulse"></div>
        
        <div className="relative z-10 w-full px-4 md:px-12 flex flex-col justify-center">
          <div className="relative group perspective-1000">
            <h1 className="fl-display text-[clamp(6rem,18vw,16rem)] leading-[0.75] mix-blend-difference relative z-20 transition-transform duration-700 group-hover:rotate-3 group-hover:scale-105" style={{ letterSpacing: "-0.1em" }}>
              <span className="block transform -translate-x-12 animate-jitter opacity-80">FAULT</span>
              <span className="block transform translate-x-24 text-transparent -translate-y-8" style={{ WebkitTextStroke: "4px white" }}>
                LINE
              </span>
            </h1>
            <div className="absolute top-1/2 left-1/4 w-[50vw] h-[20vh] bg-white mix-blend-difference -rotate-12 animate-shake z-10 pointer-events-none"></div>
          </div>
          
          <div className="mt-24 grid md:grid-cols-2 gap-12 relative z-30">
            <p className="text-2xl md:text-4xl font-display uppercase font-black leading-tight border-l-8 border-white pl-8 transform -skew-x-12 mix-blend-difference">
              Deliberate structural failure. <br/>
              A one-day technical event. <br/>
              <span className="bg-white text-black px-2 mt-2 inline-block animate-jitter">BREAK IT.</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-6 items-start md:items-end justify-end transform translate-y-12">
              <Link href="/login" className="fl-btn-primary w-full sm:w-auto -rotate-3 text-center">
                ENTER
              </Link>
              <Link href="/live" className="fl-btn-ghost w-full sm:w-auto rotate-2 text-center bg-black">
                LOGS
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="border-y-8 border-white bg-black py-6 overflow-hidden -skew-y-6 my-32 relative z-20 mix-blend-difference w-[110vw] -ml-[5vw]">
        <div className="fl-chaos-marquee text-white whitespace-nowrap">
          {[...Array(12)].map((_, i) => (
            <span key={i} className="mx-8 font-display text-[8rem] md:text-[12rem] font-black uppercase tracking-tighter mix-blend-difference" style={{ WebkitTextStroke: i % 2 === 0 ? "2px white" : "0", color: i % 2 === 0 ? "transparent" : "white" }}>
              DESTROY • REBUILD • DESTROY • 
            </span>
          ))}
        </div>
      </div>

      {/* About */}
      <section className="py-32 w-full relative z-10 overflow-visible">
        <svg className="absolute right-0 top-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[800px] animate-spin-slow opacity-20 mix-blend-difference pointer-events-none" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="white" strokeWidth="2" strokeDasharray="5,10" />
          <circle cx="50" cy="50" r="30" fill="none" stroke="white" strokeWidth="1" />
          <line x1="50" y1="0" x2="50" y2="100" stroke="white" strokeWidth="1" />
          <line x1="0" y1="50" x2="100" y2="50" stroke="white" strokeWidth="1" />
        </svg>

        <div className="w-full px-4 md:px-12">
          <div className="grid gap-16 lg:grid-cols-[1.5fr_1fr] lg:gap-24 items-center">
            <div className="relative group">
              <div className="absolute top-0 left-12 w-full h-full bg-white rotate-6 group-hover:rotate-12 transition-transform duration-500 -z-10 mix-blend-difference"></div>
              <h2 className="fl-display text-[clamp(4rem,9vw,8rem)] tracking-tighter leading-[0.8] relative z-10 mix-blend-difference transform -rotate-3 text-white">
                THE<br />
                <span className="text-transparent" style={{ WebkitTextStroke: "2px white" }}>BROKEN</span><br />
                CODE.
              </h2>
            </div>
            <div className="fl-card p-12 lg:p-16 relative z-10 transform rotate-2 animate-jitter">
              <p className="text-2xl font-display font-black leading-tight text-white mb-8 border-l-4 border-white pl-6 uppercase">
                Teams deliberately ship broken systems in Phase 1. 
              </p>
              <p className="text-xl font-display font-bold leading-tight text-white/60 uppercase">
                After a mid-event swap, they inherit another team&apos;s repo and rebuild it in Phase 2. Organizers strictly monitor the chaos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Anti-Design Bento grid */}
      <section className="py-40 w-full relative overflow-visible border-t-[16px] border-white bg-black">
        <svg className="absolute left-0 top-0 w-full h-[300px] pointer-events-none mix-blend-difference" preserveAspectRatio="none">
           <path d="M0,0 L100,300 L200,0 L300,300 L400,0 L500,300 L600,0 L700,300 L800,0 L900,300 L1000,0" stroke="white" strokeWidth="2" fill="none" className="animate-jitter opacity-30 w-full"/>
        </svg>

        <div className="w-full px-4 md:px-12">
          <h2 className="fl-display text-[15vw] tracking-tighter text-transparent opacity-20 absolute -top-24 left-0 mix-blend-difference pointer-events-none" style={{ WebkitTextStroke: "4px white" }}>ARCHITECTURE</h2>
          <div className="grid gap-16 md:grid-cols-4 relative z-10 mt-32">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className={`fl-card p-12 lg:p-16 ${
                  i === 0 ? "md:col-span-2 md:row-span-2 transform -rotate-3 z-20 hover:scale-105" : i === 1 ? "md:col-span-2 transform rotate-2 translate-y-16 z-10 hover:rotate-6" : "md:col-span-4 transform -skew-x-12 hover:-translate-y-8"
                }`}
              >
                <p className="mb-6 font-display text-xl uppercase tracking-widest text-white/50 bg-white/10 inline-block px-2">{f.label}</p>
                <h3 className="fl-display text-5xl md:text-7xl mb-8 tracking-tighter text-white mix-blend-difference leading-[0.8]">{f.title}</h3>
                <p className="text-2xl font-display font-bold leading-tight text-white/80 max-w-2xl">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative px-4 py-48 text-center md:px-8 bg-fl-bg overflow-hidden border-b-[16px] border-fl-invert">
        <div className="absolute inset-0 bg-fl-mesh opacity-80 pointer-events-none mix-blend-color-dodge" />
        <p className="fl-label mb-8 relative z-10 inline-block bg-fl-accent text-fl-bg px-4 py-1 animate-pulse font-bold">TERMINAL ACCESS REQUIRED</p>
        <h2 
          className="fl-display text-[clamp(3rem,10vw,8rem)] tracking-tighter leading-none relative z-10 glitch mb-16 text-fl-text"
          data-text="ENTER THE FAULT LINE."
        >
          ENTER THE<br />FAULT LINE.
        </h2>
        <Link href="/login" className="fl-btn-primary mx-auto inline-block w-auto px-16 py-6 text-2xl relative z-10 fl-neu -rotate-2">
          EXECUTE // LOGIN
        </Link>
      </section>
    </div>
  );
}
