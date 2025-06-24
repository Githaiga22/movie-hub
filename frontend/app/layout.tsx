import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { WatchlistProvider } from "@/context/WatchlistContext";
import { Navbar } from "@/app/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Movie Hub",
  description: "Discover and track your favorite movies and TV shows.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WatchlistProvider>
          <Navbar />
          {children}
        </WatchlistProvider>
      </body>
    </html>
  );
}
