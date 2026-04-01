import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script"
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Apex Merchant Ledger | Real-Time Business Settlements",
  description: "A high-fidelity dashboard for SMEs to track settlements, manage transaction lifecycles, and monitor business cashflow with integrated Paystack payments.",
  icons: {
    icon: "/favicon.ico", 
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster position="top-right" richColors />
        <Script 
          src="https://js.paystack.co/v1/inline.js" 
          strategy="beforeInteractive" 
        />
      </body>
    </html>
  );
}