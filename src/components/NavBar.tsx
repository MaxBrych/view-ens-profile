import {
  Avatar,
  Container,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import {
  useAddress,
  useDisconnect,
  useNetworkMismatch,
  useSwitchChain,
  useChainId,
  ConnectWallet,
} from "@thirdweb-dev/react";
import { Polygon } from "@thirdweb-dev/chains";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import { HiMenuAlt4 } from "react-icons/hi";
const ethersDynamic: Promise<any> = import("ethers");

export default function Navbar() {
  const walletAddress = useAddress();
  const disconnect = useDisconnect();
  const isMismatched = useNetworkMismatch();
  const switchChain = useSwitchChain();
  const chainId = useChainId();
  const [provider, setProvider] = useState<any>(null);
  const [address, setAddress] = useState(null);

  const router = useRouter();
  const { ensName } = router.query;

  const [ensRecords, setEnsRecords] = useState<Record<string, string>>({});
  const [isLoading, setLoading] = useState(true);

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

    if (ensName && provider) {
      getAllRecords(ensName as string);
    }
  }, [ensName, provider]);

  return (
    <Container maxW={"100%"} className="fixed w-full rounded-xl top-4" py={2}>
      <Flex justifyContent={"space-between"} alignItems={"center"}>
        <Link href="/">
          <Image
            alt="Logo"
            src="https://cdn.discordapp.com/attachments/911669935363752026/1134946436908322846/Flippr_Wordmark.png"
            height={48}
            width={200}
            className="w-auto h-8 cursor-pointer"
          />
        </Link>
        <Flex alignItems={"center"}>
          {!walletAddress ? (
            <ConnectWallet btnTitle="Sign In" theme="light" />
          ) : isMismatched ? (
            <button
              className="px-4 text-sm font-semibold bg-gray-300 rounded-full h-9"
              onClick={() => switchChain(Polygon.chainId)}
            >
              Switch Network
            </button>
          ) : (
            <Menu>
              <MenuButton>
                <Flex className="flex h-12 gap-2 pl-3 justify-center items-center bg-[#FFF] px-2 rounded-full py-1">
                  <HiMenuAlt4 className="w-5 h-5" />

                  <Image
                    src={
                      ensRecords.avatar ||
                      "https://cdn.discordapp.com/attachments/1070670506052821083/1139184181574893588/pandapfpf.png"
                    }
                    alt="Avatar"
                    height={36}
                    width={36}
                    className="border border-gray-300 rounded-full"
                  />
                </Flex>
              </MenuButton>

              <MenuList>
                <MenuItem>
                  <Link href={`/account`}> Profile </Link>
                </MenuItem>
                <MenuItem onClick={disconnect}>Sign Out</MenuItem>
              </MenuList>
            </Menu>
          )}
        </Flex>
      </Flex>
    </Container>
  );
}
