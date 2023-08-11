import { Inter, Manrope } from "next/font/google";
import { Box } from "@chakra-ui/react";
import SearchAddress from "@/components/Hero";

import NavBar from "@/components/NavBar";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
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
