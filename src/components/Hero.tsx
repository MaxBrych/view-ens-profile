import { Box } from "@chakra-ui/react";
import Link from "next/link";
import { FiSearch } from "react-icons/fi";
import SearchBar from "./SearchBar";
import Image from "next/image";
import TotalDonated from "./Getter/TotalDonated";

export default function Hero() {
  return (
    <Box
      w={"full"}
      className="flex flex-col items-center justify-center min-h-[75vh]"
    >
      <Box
        mx="auto"
        className="flex flex-col items-center justify-center "
        w="full"
        maxW={"4xl"}
      >
        <h1 className="mb-2 text-3xl font-black tracking-tight text-center text-black md:mb-4 md:text-6xl ">
          EASIEST WAY TO DONATE CRYPTO
        </h1>

        <Image
          src="https://cdn.discordapp.com/attachments/911669935363752026/1142198867291553915/Frame_172ad.png"
          alt="Hero"
          width={500}
          height={500}
          className="mb-0"
        />
        <SearchBar />

        <TotalDonated />
      </Box>
    </Box>
  );
}
