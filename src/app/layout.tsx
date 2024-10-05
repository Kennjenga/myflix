import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Myflix",
  description: "Stream movies and tv_shows",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} my-bg min-h-screen flex items-start justify-center text-white`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
