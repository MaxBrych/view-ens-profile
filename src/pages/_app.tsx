import "@/styles/globals.css";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import {
  ThirdwebProvider,
  coinbaseWallet,
  metamaskWallet,
  localWallet,
} from "@thirdweb-dev/react";

import localFont from "next/font/local";

const client = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID;

import type { AppProps } from "next/app";
import { useState } from "react";

import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider, Session } from "@supabase/auth-helpers-react";

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

export default function App({
  Component,
  pageProps,
}: AppProps<{
  initialSession: Session;
}>) {
  // Create a new supabase browser client on every first render.
  const [supabaseClient] = useState(() => createPagesBrowserClient());

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <ThirdwebProvider
        activeChain={activeChain}
        supportedWallets={[coinbaseWallet(), metamaskWallet(), localWallet()]}
      >
        <ChakraProvider theme={theme}>
          <main className={`${Mona.className} font-mona`}>
            <Component {...pageProps} />
          </main>
        </ChakraProvider>
      </ThirdwebProvider>
    </SessionContextProvider>
  );
}
