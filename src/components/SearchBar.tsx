import { useRef, useState } from "react";
import { useRouter } from "next/router";
import {
  useToast,
  Input,
  IconButton,
  Box,
  FormControl,
} from "@chakra-ui/react";
import { FiSearch } from "react-icons/fi";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

const Searchbar = () => {
  const [searchInput, setSearchInput] = useState("");
  const router = useRouter();
  const supabase = useSupabaseClient();
  const toast = useToast();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submit behavior

    if (searchInput.endsWith(".eth")) {
      router.push(`/profile/${searchInput}`);
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
    <FormControl as="form" onSubmit={handleSearch}>
      <Box
        borderRadius={"full"}
        border={"1px solid"}
        borderColor={"gray.300"}
        h={{ base: "16", md: "20" }}
        fontWeight={"bold"}
        backgroundColor={"white"}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"space-between"}
        px={4}
        pl={6}
        textColor={"gray.500"}
        fontSize={{ base: "lg", md: "xl" }}
        maxWidth={{ base: "full", md: "2xl" }}
      >
        flippr.xyz/
        <Input
          ref={inputRef}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Your address"
          className="px-0 border-none outline-none focus:outline-none "
          backgroundColor={"white"}
          border={"none"}
          outline={"none"}
          textColor={"black"}
          p={0}
          focusBorderColor="transparent"
          variant="unstyled"
          fontSize={{ base: "lg", md: "xl" }}
        />
        <IconButton
          icon={<FiSearch />}
          colorScheme="grey"
          className="rounded-full px-2 bg-[#05C756] text-white"
          aria-label={""}
          rounded={"full"}
          size={{ base: "md", md: "lg" }}
          fontSize={{ base: "xl", md: "2xl" }}
          onClick={handleSearch}
        >
          Search
        </IconButton>
      </Box>
    </FormControl>
  );
};

export default Searchbar;
