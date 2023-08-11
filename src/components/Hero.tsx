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

const ethersDynamic: Promise<any> = import("ethers");

const Hero = () => {
  return (
    <Box
      w={"full"}
      className="flex flex-col items-center justify-center min-h-screen"
    >
      <Box p={1} className="credit-card" mx="auto" w="full" maxW={"lg"}>
        <Heading
          textAlign={"center"}
          mb={{ base: "2", md: "3" }}
          textColor={"black"}
          className="tracking-tight md:tracking-tighter"
          fontSize={{ base: "4xl", md: "7xl" }}
          lineHeight={"1.1"}
          fontWeight={"bold"}
        >
          Easiest way to donate crypto
        </Heading>
        <Text
          mb={4}
          textAlign={"center"}
          fontSize={{ base: "sm", md: "xl" }}
          fontWeight={"semibold"}
          textColor={"gray.500"}
          className="cursor-default"
          colorScheme="transparent"
          w={{ base: "auto", md: "auto" }}
        >
          Send crypto and chat with people{" "}
        </Text>

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
