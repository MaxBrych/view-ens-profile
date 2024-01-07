"use client";
import { useRef, useState } from "react";
import {
  useToast,
  Input,
  IconButton,
  Box,
  FormControl,
  Text,
} from "@chakra-ui/react";
import { FiSearch } from "react-icons/fi";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useParams, useRouter } from "next/navigation";

const Searchbar = () => {
  let params = useParams();
  const [searchInput, setSearchInput] = useState("");
  const supabase = useSupabaseClient();
  const toast = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submit behavior

    if (searchInput.endsWith(".eth")) {
      router.push(`/${searchInput}`);
    } else {
      const { data, error } = await supabase
        .from("wallet_profiles")
        .select("wallet_address")
        .or(`username.eq.${searchInput},wallet_address.eq.${searchInput}`)
        .single();

      if (data) {
        const walletAddress = data.wallet_address;
        router.push(`/address/${walletAddress}`);
      } else {
        // Handle case where search input doesn't match any records
        // Check if userInput is empty

        toast({
          title: "Input is missing.",
          description: "Please input an ENS name or Ethereum address.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
    }
  };

  return (
    <FormControl
      as="form"
      className="flex flex-col items-center justify-center"
      onSubmit={handleSearch}
    >
      <Box
        borderRadius={"full"}
        border={"1px solid"}
        borderColor={"gray.300"}
        h={{ base: "16", md: "20" }}
        fontWeight={"semibold"}
        backgroundColor={"white"}
        display={"flex"}
        alignItems={"center"}
        pl={{ base: "6", md: "6" }}
        pr={{ base: 2, md: 3 }}
        justifyContent={"space-between"}
        textColor={"gray.500"}
        fontSize={{ base: "md", md: "lg" }}
        width={{ base: "full", md: "lg" }}
      >
        <Text>flippr.xyz/</Text>
        <Input
          ref={inputRef}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Your Username or ENS"
          className="px-0 border-none outline-none focus:outline-none "
          backgroundColor={"white"}
          border={"none"}
          outline={"none"}
          textColor={"black"}
          p={0}
          focusBorderColor="transparent"
          variant="unstyled"
          fontSize={{ base: "md", md: "lg" }}
        />
        <IconButton
          icon={<FiSearch />}
          colorScheme="grey"
          className="px-2 text-black rounded-full bg-primary-500"
          aria-label={""}
          rounded={"full"}
          color={"black"}
          size={{ base: "lg", md: "lg" }}
          h={{ base: "16", md: "16" }}
          inset={0}
          fontSize={{ base: "3xl", md: "3xl" }}
          onClick={handleSearch}
        >
          Search
        </IconButton>
      </Box>
    </FormControl>
  );
};

export default Searchbar;
