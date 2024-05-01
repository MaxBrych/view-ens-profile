"use client";
import { Box } from "@chakra-ui/react";
import Link from "next/link";
import { FiSearch } from "react-icons/fi";
import SearchBar from "./SearchBar2";
import Image from "next/image";
import TotalDonated from "./Getter/TotalDonated";

export default function Hero() {
  return (
    <Box
      w={"full"}
      className="flex flex-col items-center justify-center min-h-[90vh]"
    >
      <Box
        mx="auto"
        className="flex flex-col items-center justify-center "
        w="full"
        maxW={"4xl"}
      >
        <h1 className="mb-2 text-3xl font-black tracking-tight text-center text-black md:mb-4 md:text-6xl ">
          EASIEST WAY TO <br />
          DONATE CRYPTO
        </h1>

        <Image
<<<<<<< HEAD
          src="https://cdn.discordapp.com/attachments/911669935363752026/1235129953746550885/Frame_171.png?ex=66333fe8&is=6631ee68&hm=71aa6225c80c4214cf55935574c4103aa3d6e5587f3d25e015b4b22d442e3a0b&"
=======
          src="https://cdn.discordapp.com/attachments/911669935363752026/1210595356283510834/herooo.png?ex=65eb21c8&is=65d8acc8&hm=0190ee6cbb079a96bbd8232f5c27db95c3c9ad996ee2bcf7a94620105df7f211&"
>>>>>>> 41fbb65f18b4a9c4806df33535736afd4e71f3f2
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
