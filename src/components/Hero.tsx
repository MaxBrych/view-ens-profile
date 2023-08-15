import { useState, useRef, FormEvent, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  Text,
  IconButton,
  Heading,
} from "@chakra-ui/react";
import Link from "next/link";
import { FiSearch } from "react-icons/fi";
import SearchBar from "./SearchBar";
import Image from "next/image";

const ethersDynamic: Promise<any> = import("ethers");

const Hero = () => {
  return (
    <Box
      w={"full"}
      className="flex flex-col items-center justify-center min-h-screen"
    >
      <Box
        mx="auto"
        className="flex flex-col items-center justify-center "
        w="full"
        maxW={"xl"}
      >
        <h1 className="mb-2 text-3xl font-black tracking-tight text-center text-black md:mb-4 md:text-7xl ">
          EASIEST WAY TO DONATE CRYPTO
        </h1>

        <Image
          src="https://cdn.discordapp.com/attachments/911669935363752026/1140751372120236093/FlipprIllus.png"
          alt="Hero"
          width={500}
          height={500}
          className="mb-0"
        />
        <SearchBar />
        <div className="flex flex-col justify-between w-full py-6">
          <Link
            className="w-full mt-4 text-xs font-semibold text-center text-gray-500 underline md:text-sm hover:text-gray-700 focus:text-gray-700"
            href="https://app.ens.domains/"
            target="_blank"
          >
            Get a ENS name here!
          </Link>
        </div>
      </Box>
    </Box>
  );
};

export default Hero;
