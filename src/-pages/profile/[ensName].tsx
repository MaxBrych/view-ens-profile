import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import {
  Box,
  Heading,
  Text,
  Image,
  Flex,
  Icon,
  Link,
  Skeleton,
  useColorModeValue,
  HStack,
} from "@chakra-ui/react";
import { FaGithub } from "react-icons/fa";
import DonateButton from "@/components/Donation/Donate";
import ChatButton from "@/components/ChatButton";
import ShareButton from "@/components/ShareButton";
import TransactionFeed from "@/components/TransactionFeed/TransactionFeed";
import NavBar from "@/components/NavBar";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useAddress } from "@thirdweb-dev/react";

const ethersDynamic: Promise<any> = import("ethers");

// This component represents a skeleton state of an ENS record.
function ENSRecordSkeleton({
  children,
  isLoaded,
}: {
  children: any;
  isLoaded: any;
}) {
  return (
    <Skeleton
      isLoaded={isLoaded}
      startColor="white"
      endColor="gray.300"
      borderRadius="full"
      mb="4"
    >
      {children}
    </Skeleton>
  );
}

const ProfilePage = () => {
  const [provider, setProvider] = useState<any>(null);
  const [address, setAddress] = useState(null);

  const router = useRouter();
  const { ensName } = router.query;

  const [ensRecords, setEnsRecords] = useState<Record<string, string>>({});
  const [isLoading, setLoading] = useState(true);

  const supabase = useSupabaseClient();
  const user = useUser();

  useEffect(() => {
    ethersDynamic.then((ethers) => {
      const provider = new ethers.providers.JsonRpcProvider(
        process.env.NEXT_PUBLIC_PROVIDER_URL
      );
      setProvider(provider);
    });
  }, []);

  useEffect(() => {
    const getAllRecords = async (ensName: string) => {
      setLoading(true);
      const client = new ApolloClient({
        uri: "https://api.thegraph.com/subgraphs/name/ensdomains/ens",
        cache: new InMemoryCache(),
      });

      const query = gql`
      {
        domains(where:{name:"${ensName}"}) {
          id
          name
          resolver {
            texts
            coinTypes
          }
        }
      }
      `;

      if (ensName && provider) {
        const address = await provider.resolveName(ensName);
        setAddress(address);

        const result = await client.query({ query });

        if (result.data && result.data.domains.length > 0) {
          const resolver = await provider.getResolver(ensName);

          // Check if texts are defined and not empty before mapping
          if (result.data.domains[0].resolver.texts) {
            const textRecords = await Promise.all(
              result.data.domains[0].resolver.texts.map((key: string) =>
                resolver.getText(key)
              )
            );

            // Store the results in the component's state.
            const newRecords: Record<string, string> = {};
            result.data.domains[0].resolver.texts.forEach(
              (text: string, index: number) => {
                newRecords[text] = textRecords[index];
              }
            );
            setEnsRecords(newRecords);
          }
          setLoading(false);
        }
      }
    };

    const fetchData = async (nameOrAddress: string) => {
      setLoading(true);

      if (nameOrAddress.endsWith(".eth")) {
        // Handle ENS name
        await getAllRecords(nameOrAddress as string);
      } else {
        // Handle username
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("username", nameOrAddress)
          .single();

        if (data) {
          // Set data from database
          setAddress(data.wallet_address);
          setEnsRecords({
            avatar:
              data.avatar_url ||
              "https://cdn.discordapp.com/attachments/911669935363752026/1139256377118830662/ETH_Pand.png",
            description: data.full_name,
            // Add other fields as needed
          });
        } else {
          // Handle error or use placeholders

          setEnsRecords({
            avatar: "https://example.com/placeholder-avatar.png",
            description: "User not found",
          });
        }
      }

      setLoading(false);
    };
    function formatAddress(address: string): string {
      return address.slice(0, 6) + "..." + address.slice(-4);
    }

    if (ensName && provider) {
      fetchData(ensName as string);
    }
    const formattedAddress = formatAddress(address || "");
  }, [ensName, provider]);
  const bg = "gray.50";

  return (
    <>
      <NavBar />
      <Box
        minHeight="100vh"
        w="full"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        backgroundColor={bg}
        className=" font-mona"
        p={4}
      >
        <Box
          className="w-full p-4 mt-8"
          bg={"white"}
          maxW={96}
          rounded={"2xl"}
          h="full"
          minH={"85vh"}
          border={"1px solid #E2E8F0"}
          p={4}
        >
          <Flex direction="column" p={4} w="full" align="center">
            <ENSRecordSkeleton isLoaded={!isLoading}>
              <Image
                src={
                  ensRecords.avatar ||
                  "https://cdn.discordapp.com/attachments/911669935363752026/1139256377118830662/ETH_Pand.png"
                }
                alt="Avatar"
                boxSize={["96px", "128px", "160px"]}
                rounded="full"
                border={"1px"}
                borderColor={"gray.300"}
              />
            </ENSRecordSkeleton>

            <h1 className="h-3 mb-4 text-xl font-bold text-center">
              {ensName || ""}
            </h1>

            {ensRecords.description && (
              <Text
                textAlign="center"
                fontSize={{ base: "xs", md: "sm" }}
                lineHeight={"normal"}
                mb={4}
                className=" font-mona"
              >
                {ensRecords.description}
              </Text>
            )}

            <HStack mt={2} spacing={8} mb={4} rowGap={8}>
              <ChatButton receiverAddress={address} />
              <ShareButton />
              <DonateButton address={address} name="Donate" />
            </HStack>

            {ensRecords["com.github"] && (
              <Flex
                fontStyle={"normal"}
                border={"1px"}
                borderColor={"gray.200"}
                align="center"
                mt={2}
                mb={0}
                p={4}
                backgroundColor={"white"}
                borderRadius={"lg"}
                className="transition-all duration-150 cursor-pointer hover:bg-gray-300"
              >
                <Link
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  gap={2}
                  href={ensRecords["com.github"]}
                  h={"full"}
                  w={"full"}
                  isExternal
                >
                  <Icon as={FaGithub} boxSize={6} mr={2} />
                  <Text
                    textDecorationLine={"none"}
                    fontSize={"sm"}
                    fontWeight={"semibold"}
                    className="underline-none"
                  >
                    {ensRecords["com.github"]}
                  </Text>
                </Link>
              </Flex>
            )}
          </Flex>

          <TransactionFeed receiverAddress={address} />
        </Box>
      </Box>
    </>
  );
};

export default ProfilePage;
