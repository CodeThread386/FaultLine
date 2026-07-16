import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { normalizeRoles } from "@/lib/roles";
import { redirect } from "next/navigation";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

export default async function OrganizerLayout({ children }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const roles = normalizeRoles(session.user);
  if (!roles.includes("organizer")) redirect("/post-login");

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-black text-white selection:bg-white selection:text-black relative fl-tech-grid">
      <div className="fl-scanline"></div>
      
      {/* Background SVG Watermark */}
      <svg className="fixed top-0 left-0 w-[150vw] h-[150vh] pointer-events-none opacity-5 z-0" viewBox="0 0 100 100" preserveAspectRatio="none">
        <text x="50" y="50" dominantBaseline="middle" textAnchor="middle" fontSize="40" fontWeight="900" transform="rotate(45 50 50)" fill="white">ORG_ROOT</text>
      </svg>
      
      <header className="flex h-32 shrink-0 items-center w-full justify-between border-b-[12px] border-white bg-black px-4 md:px-12 z-50 sticky top-0 transform -skew-y-1">
        <Link href="/organizer" className="fl-display text-5xl md:text-6xl tracking-tighter hover:rotate-2 transition-transform text-white mix-blend-difference flex items-baseline ml-8">
          <span className="animate-jitter inline-block">FAULT</span>
          <span className="text-transparent" style={{ WebkitTextStroke: "2px white" }}>LINE</span>
          <span className="ml-6 border-l-8 border-white pl-6 font-display text-2xl uppercase tracking-widest text-white font-black hidden sm:inline-block bg-white text-black px-2 py-1 transform rotate-3">
            ROOT // ORG
          </span>
        </Link>
        <div className="flex items-center gap-8 mr-16">
          <Link href="/live" className="font-display text-2xl uppercase tracking-widest text-white hover:text-black hover:bg-white transition-colors font-black border-4 border-white px-4 py-2 transform -rotate-2 hover:rotate-0">
            LIVE_FEED
          </Link>
          <span className="hidden font-display uppercase font-black text-xl text-white/50 bg-white/10 px-2 sm:inline transform rotate-1">{session.user.email}</span>
          <LogoutButton className="border-4 border-white bg-black px-6 py-4 text-xl font-display uppercase tracking-widest hover:bg-white hover:text-black transition-colors font-black text-white shadow-[6px_6px_0_0_#ffffff] transform hover:translate-x-1 hover:-translate-y-1" />
        </div>
      </header>
      
      <main className="min-h-0 flex-1 overflow-y-auto px-4 md:px-8 py-12 relative z-10">
        {children}
      </main>
    </div>
  );
}
