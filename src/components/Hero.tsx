import { Box } from "@chakra-ui/react";
import Link from "next/link";
import { FiSearch } from "react-icons/fi";
import SearchBar from "./SearchBar";
import Image from "next/image";
import { useContract, useContractRead } from "@thirdweb-dev/react";

const CONTRACT_ADDRESS = "0x3AaD0C509de23bE3A7831201138289AB9461F01C";

export default function Hero() {
  const { contract } = useContract(CONTRACT_ADDRESS);

  // No arguments are required for the getTransactionCount function, so you can leave the args array empty
  const { data: transactionCount, isLoading } = useContractRead(
    contract,
    "getTransactionCount",
    []
  );

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
        <h1 className="mb-2 text-3xl font-black tracking-tighter text-center text-black md:mb-4 md:text-7xl ">
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
        <div className="flex flex-col justify-between w-full py-6">
          <Link
            className="w-full mt-4 text-xs font-semibold text-center text-gray-500 underline md:text-sm hover:text-gray-700 focus:text-gray-700"
            href="https://app.ens.domains/"
            target="_blank"
          >
            Get a ENS name here!
          </Link>
        </div>
        {/* Displaying the transactionCount */}
        <h1>{!isLoading && transactionCount}</h1>
      </Box>
    </Box>
  );
}
