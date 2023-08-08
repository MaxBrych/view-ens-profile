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
} from "@chakra-ui/react";
import Link from "next/link";
import { FiSearch } from "react-icons/fi";

const ethersDynamic: Promise<any> = import("ethers");

const SearchAddress = () => {
  const [provider, setProvider] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const addrRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    ethersDynamic.then((ethers) => {
      const provider = new ethers.providers.JsonRpcProvider(
        "https://spring-red-dinghy.discover.quiknode.pro/54a9c39cdfc6a8085cfb75f545ce67a66249d4ac/"
      );
      setProvider(provider);
    });
  }, []);

  const getName = async (input: string) => {
    setIsLoading(true);
    setIsError(false);

    if (provider) {
      if (input.includes(".eth")) {
        const resolvedAddress = await provider.resolveName(input);
        setIsLoading(false);

        if (resolvedAddress) {
          return resolvedAddress;
        } else {
          setIsError(true);
          return input;
        }
      } else {
        const resolvedName = await provider.lookupAddress(input);
        setIsLoading(false);

        if (resolvedName) {
          return resolvedName;
        } else {
          setIsError(true);
          return input;
        }
      }
    }

    setIsLoading(false);
    setIsError(true);
    return input;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (addrRef.current) {
      const userInput = addrRef.current.value.trim(); // trim to remove any leading or trailing spaces

      // Check if userInput is empty
      if (!userInput) {
        toast({
          title: "Input is missing.",
          description: "Please input an ENS name or Ethereum address.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      // Check if userInput ends with ".eth"
      if (!userInput.endsWith(".eth")) {
        toast({
          title: "Invalid ENS Name",
          description: "ENS name must end with .eth",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      // If all checks pass, proceed to route to profile
      router.push(`/profile/${userInput}`);
    }
  };

  return (
    <Box w={"full"}>
      <Box p={1} className="credit-card" mx="auto" w="full" maxW={"lg"}>
        <FormControl
          as="form"
          onSubmit={handleSubmit}
          id="addr"
          mt={1}
          justifyContent={"center"}
          alignItems={"center"}
          display={"flex"}
          flexDirection={"column"}
        >
          <FormLabel
            textAlign={"center"}
            mb={{ base: "2", md: "3" }}
            textColor={"black"}
            className="tracking-tight md:tracking-tighter"
            fontSize={{ base: "4xl", md: "7xl" }}
            lineHeight={"1.1"}
            fontWeight={"bold"}
          >
            Easiest way to donate crypto
          </FormLabel>
          <Button
            mb={4}
            textAlign={"center"}
            fontSize={{ base: "sm", md: "lg" }}
            fontWeight={"semibold"}
            textColor={"gray.500"}
            type="submit"
            className="cursor-default"
            isLoading={isLoading}
            loadingText="Resolving..."
            colorScheme="transparent"
            w={{ base: "auto", md: "auto" }}
          >
            Send crypto and chat with people{" "}
          </Button>
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
          >
            flippr.xyz/
            <Input
              ref={addrRef}
              placeholder="Your address"
              isInvalid={isError}
              className="px-0 border-none outline-none focus:outline-none "
              backgroundColor={"white"}
              border={"none"}
              outline={"none"}
              textColor={"black"}
              p={0}
              focusBorderColor="transparent"
              variant="unstyled"
              fontSize={{ base: "lg", md: "xl" }}
            ></Input>
            <IconButton
              icon={<FiSearch />}
              colorScheme="grey"
              className="rounded-full px-2 bg-[#05C756] text-white"
              aria-label={""}
              rounded={"full"}
              size={{ base: "md", md: "lg" }}
              fontSize={{ base: "xl", md: "2xl" }}
              onClick={handleSubmit}
            >
              Search
            </IconButton>
          </Box>
          {isError && (
            <Text color="red.500" mt={2}>
              Please input a valid ENS name (ending with .eth)
            </Text>
          )}
        </FormControl>
        <Link
          className="w-full mt-4 text-xs font-semibold text-center text-gray-500 underline md:text-sm underline-offset-1"
          href="https://app.ens.domains/"
          target="_blank"
        >
          Get a ENS name here!
        </Link>
      </Box>
    </Box>
  );
};

export default SearchAddress;
