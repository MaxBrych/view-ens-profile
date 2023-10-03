import React from "react";
import "../styles/globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Flippr",
  description:
    "Flippr is a dApp that makes sending money as easy as flipping a coin. ",
  manifest: "/manifest.json",
  icons: {
    apple: "/icon.png",
  },
  themeColor: "#1fd25a",
};
import Head from "next/head";
import Providers from "@/components/provider";
import localFont from "next/font/local";
import Navigation from "@/components/Navigation";

const Mona = localFont({
  src: [
    {
      path: "fonts/Mona-Sans-Medium.woff2",
      weight: "400",
      style: "body",
    },
    {
      path: "fonts/Mona-Sans-Bold.woff2",
      weight: "600",
      style: "bold",
    },

    {
      path: "fonts/Mona-Sans-BlackWide.woff2",
      weight: "800",
      style: "heading",
    },
  ],
});
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon.png" />
        <meta
          name="apple-mobile-web-app-statur-bar-style"
          content="black-translucent"
        />
      </Head>
      <Providers>
        <body>
          <main className={`${Mona.className} font-mona bg-[#f7fafc]`}>
            <Navigation />

            {children}
          </main>
        </body>
      </Providers>
    </html>
  );
}
