import { Box } from "@chakra-ui/react";
import Hero from "@/components/Hero";
import localFont from "next/font/local";
import Navbar from "@/components/NavBar";

export default function Home() {
  const color = "gray.700";

  return (
    <div className="flex flex-col items-start justify-start w-full min-h-screen p-4">
      <Navbar />
      <Hero />
    </div>
  );
}
