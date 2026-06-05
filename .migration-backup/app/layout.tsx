import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import Navbar from "@/components/Navbar";
import SmoothScroll from "@/components/SmoothScroll";
import TubesCursor from "@/components/TubesCursor";

import "../styles/main.css";
import "../styles/components/services-carousel.css";
import "../styles/components/our-work.css";
import "../styles/components/process.css";
import "../styles/components/testimonials.css";

const inter = localFont({
  src: [
    {
      path: "../public/fonts/Inter/InterVariable.woff2",
      weight: "100 900",
      style: "normal",
    },
    {
      path: "../public/fonts/Inter/InterVariable-Italic.woff2",
      weight: "100 900",
      style: "italic",
    },
  ],
  variable: "--inter",
  display: "swap",
});

const appleGaramond = localFont({
  src: [
    {
      path: "../public/fonts/AppleGaramond/AppleGaramond.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/AppleGaramond/AppleGaramond-Italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../public/fonts/AppleGaramond/AppleGaramond-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/AppleGaramond/AppleGaramond-LightItalic.woff2",
      weight: "300",
      style: "italic",
    },
    {
      path: "../public/fonts/AppleGaramond/AppleGaramond-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/AppleGaramond/AppleGaramond-BoldItalic.woff2",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--apple-garamond",
});

export const metadata: Metadata = {
  title: "Digi Mirai - Premium 3D Agency",
  description: "Advanced 3D Web Solutions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${appleGaramond.variable}`}>
        <SmoothScroll>
          <TubesCursor />
          <Navbar />
          {children}
        </SmoothScroll>
        <Script src="https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
