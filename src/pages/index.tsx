import { Box } from "@chakra-ui/react";
import SearchAddress from "@/components/Hero";
import localFont from "next/font/local";
import NavBar from "@/components/NavBar";

export default function Home() {
  const color = "gray.700";

  return (
    <>
      <Box
        color={color}
        className={`flex min-h-screen flex-col items-center justify-center pb-[33vh] p-4 `}
      >
        <NavBar />
        <SearchAddress />
      </Box>
    </>
  );
}
