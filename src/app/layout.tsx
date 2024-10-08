import type { Metadata } from 'next'
import '@material/web/button/filled-button.js';
import '@material/web/button/outlined-button.js';
import '@material/web/checkbox/checkbox.js';
import { Poppins } from "next/font/google";
import "./globals.css";

const roboto = Poppins({ subsets: ["latin"], weight: ['400'] });


export const metadata: Metadata = {
  title: "TuneCraft",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={roboto.className}>{children}</body>
    </html>
  )
}