"use client";
import React from "react";
import "../styles/globals.css";
import NavBar from "@/components/NavBar";

{
  /**
export const metadata = {
  title: "Flippr",
  description:
  "Flippr is a dApp that makes sending money as easy as flipping a coin. ",
};
 */
}

import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import {
  ThirdwebProvider,
  coinbaseWallet,
  metamaskWallet,
  localWallet,
  smartWallet,
  paperWallet,
} from "@thirdweb-dev/react";

import localFont from "next/font/local";

const client = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID;

import type { AppProps } from "next/app";
import { useState } from "react";

import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider, Session } from "@supabase/auth-helpers-react";
import { useParams } from "next/navigation";
const activeChain = "polygon";
const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: "gray.100",
        color: "gray.700",
      },
    },
  },
});
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
  let params = useParams();
  console.log(params);

  // Create a new supabase browser client on every first render.
  const [supabaseClient] = useState(() => createPagesBrowserClient());

  return (
    <html lang="en">
      <SessionContextProvider
        supabaseClient={supabaseClient}
        //initialSession={pageProps.initialSession}
      >
        <ThirdwebProvider
          clientId={client}
          activeChain={activeChain}
          supportedWallets={[
            coinbaseWallet(),
            metamaskWallet(),
            localWallet(),
            smartWallet({
              factoryAddress: "0x0E21cF855226787060D6aE1b3C066398EFf48cA5",
              gasless: true,
              personalWallets: [
                paperWallet({
                  paperClientId: "affcd036-8c4e-463c-baa3-fa47debb7fc3",
                }),
              ],
            }),
          ]}
        >
          <ChakraProvider theme={theme}>
            <body>
              <main className={`${Mona.className} font-mona bg-[#f7fafc]`}>
                <NavBar />

                {children}
              </main>
            </body>
          </ChakraProvider>
        </ThirdwebProvider>
      </SessionContextProvider>
    </html>
  );
}
