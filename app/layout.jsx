import "./globals.css";
import { Instrument_Serif, Syne, Space_Mono } from "next/font/google";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import SiteChrome from "@/components/SiteChrome";
import Providers from "@/components/Providers";

const display = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap"
});

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-syne",
  display: "swap"
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
  display: "swap"
});

export const metadata = {
  title: "FaultLine",
  description: "FaultLine technical challenge platform"
};

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions);

  return (
    <html
      lang="en"
      className={`${display.variable} ${syne.variable} ${spaceMono.variable}`}
      suppressHydrationWarning
    >
      <body
        className={`${syne.className} m-0 min-h-full w-full overflow-x-hidden bg-fl-bg text-fl-text antialiased`}
        suppressHydrationWarning
      >
        <Providers session={session}>
          <SiteChrome user={session?.user}>{children}</SiteChrome>
        </Providers>
      </body>
    </html>
  );
}
