import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "ReLoop – Borrow More. Waste Less. Build Trust.",
  description: "A campus community marketplace where students lend, borrow, exchange and give away everyday items like books, calculators, lab gear, and chargers.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col font-sans bg-[#fdfbf7] text-[#1b4332] antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
