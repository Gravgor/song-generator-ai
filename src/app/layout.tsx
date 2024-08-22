import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import '@material/web/button/filled-button.js';
import '@material/web/button/outlined-button.js';
import '@material/web/checkbox/checkbox.js';
import Navbar from "@/components/Navbar";


const roboto = Poppins({ subsets: ["latin"], weight: ['400'] });

export const metadata: Metadata = {
  title: "TuneCraft",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <Navbar />
        {children}
        </body>
    </html>
  );
}
