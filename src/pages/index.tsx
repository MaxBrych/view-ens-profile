import Image from "next/image";
import { Inter, Manrope } from "next/font/google";
import { Box, useColorModeValue } from "@chakra-ui/react";
import SearchAddress from "@/components/SearchAddress";
import Navbar from "@/components/NavBar";
import { ConnectKitButton } from "connectkit";
import { ConnectKit } from "@/components/ConnectKit";
import NavBarNew from "@/components/NavBarNew";
import NavBar from "@/components/NavBar";

const inter = Inter({ subsets: ["latin"] });
const manrope = Manrope({ subsets: ["latin"] });

export default function Home() {
  const bg = "gray.50";
  const color = "gray.700";

  return (
    <>
      <Box
        color={color}
        className={`flex min-h-screen flex-col items-center justify-center pb-[33vh] p-4 ${inter.className}`}
      >
        <NavBar />
        <SearchAddress />
      </Box>
    </>
  );
}
