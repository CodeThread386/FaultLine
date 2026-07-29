import Image from "next/image";
import Link from "next/link";
import HeaderAuth from "./HeaderAuth";

export default function NavigationButtons({ user, showHeader }) {
  const redButtonClass =
    "group flex items-center justify-center border-[5px] border-white bg-black px-8 py-4 shadow-[8px_8px_0_0_white] transition-all duration-200 hover:bg-[#FF2318] hover:border-[#FF2318] hover:text-black hover:shadow-none hover:translate-x-2 hover:translate-y-2";

  const cyanButtonClass =
    "group flex items-center justify-center border-[5px] border-white bg-black px-8 py-4 shadow-[8px_8px_0_0_white] transition-all duration-200 hover:bg-[#00E0FF] hover:border-[#00E0FF] hover:text-black hover:shadow-none hover:translate-x-2 hover:translate-y-2";

  return (
    <div
      className={`flex items-center justify-between transition-all duration-300 ease-in-out ${
        showHeader
          ? "translate-y-0 opacity-100 pointer-events-auto"
          : "-translate-y-full opacity-0 pointer-events-none"
      }`}
    >
      {/* IEEE VIT Logo */}
      <Link
        href="/"
        className={`${redButtonClass} px-5 py-3 -rotate-1`}
      >
        <Image
          src="/ieeevit.png"
          alt="IEEE VIT"
          width={90}
          height={32}
          className="h-7 md:h-8 w-auto object-contain"
          priority
        />
      </Link>

      <nav className="flex items-center gap-6">
        {/* FaultLine */}
        <Link
          href="/"
          className={`${redButtonClass} -rotate-1`}
        >
          <div className="fl-wordmark text-lg font-bold tracking-widest transition-colors duration-200">
            <span className="text-white group-hover:text-black">Fault</span>
            <span className="text-white group-hover:text-black">Line</span>
          </div>
        </Link>

        {/* Live Schedule */}
        <Link
          href="/live"
          className={`${cyanButtonClass} rotate-1 font-mono text-sm font-bold uppercase tracking-widest text-white hover:text-black`}
        >
          LIVE SCHEDULE
        </Link>

        {/* Login */}
        <div
          className={`${cyanButtonClass} -rotate-1`}
        >
          <HeaderAuth user={user} />
        </div>
      </nav>
    </div>
  );
}