"use client";
import React from "react";
import "../styles/globals.css";
import NavBar from "@/components/NavBar";

import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import {
  ThirdwebProvider,
  coinbaseWallet,
  metamaskWallet,
  localWallet,
  smartWallet,
  paperWallet,
  ConnectWallet,
  walletConnect,
  zerionWallet,
  rainbowWallet,
} from "@thirdweb-dev/react";

import localFont from "next/font/local";

const client = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID;

import type { AppProps } from "next/app";
import { useState } from "react";

import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider, Session } from "@supabase/auth-helpers-react";
import { useParams } from "next/navigation";
import Head from "next/head";
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

const smartWalletOptions = {
  factoryAddress: "0x0E21cF855226787060D6aE1b3C066398EFf48cA5",
  gasless: true,
};

export default function Providers({ children }: { children: React.ReactNode }) {
  let params = useParams();
  console.log(params);

  // Create a new supabase browser client on every first render.
  const [supabaseClient] = useState(() => createPagesBrowserClient());
  return (
    <>
      <SessionContextProvider
        supabaseClient={supabaseClient}
        //initialSession={pageProps.initialSession}
      >
        <ThirdwebProvider
          clientId={client}
          activeChain={activeChain}
          supportedWallets={[
            metamaskWallet(),

            coinbaseWallet(),
            walletConnect(),
            localWallet(),
            zerionWallet(),
            rainbowWallet(),

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
          <ChakraProvider theme={theme}>{children}</ChakraProvider>
        </ThirdwebProvider>
      </SessionContextProvider>
    </>
  );
}
