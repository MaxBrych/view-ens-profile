import NavBar from "@/components/NavBar";
import Navbar from "@/components/NavBar";
import { ColorModeScript } from "@chakra-ui/react";
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <body>
        <ColorModeScript initialColorMode="light" />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
