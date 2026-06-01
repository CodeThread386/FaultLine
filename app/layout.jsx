import "./globals.css";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Providers from "@/components/Providers";

import { Space_Mono, DM_Sans } from "next/font/google";

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata = {
  title: "FaultLine — Build Broken. Fix Brilliant.",
  description:
    "FaultLine is the reverse hackathon where teams intentionally build the worst software possible, then swap and fix each other's disasters. Two phases. Zero mercy.",
  keywords: [
    "hackathon",
    "engineering",
    "reverse hackathon",
    "faultline",
    "coding competition",
  ],
};

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions);

  return (
    <html
      lang="en"
      className={`${spaceMono.variable} ${dmSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        className="min-h-full flex flex-col"
        suppressHydrationWarning
      >
        <Providers session={session}>
          {children}
        </Providers>
      </body>
    </html>
  );
}