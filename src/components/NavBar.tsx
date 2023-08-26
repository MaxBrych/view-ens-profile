import {
  Avatar,
  Container,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
  Box,
  Button,
} from "@chakra-ui/react";

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
import React, { useEffect, useState } from "react";
import { HiMenuAlt4 } from "react-icons/hi";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { ethers } from "ethers";
import Account from "./Auth/Account";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";

export default function Navbar() {
  const supabase = useSupabaseClient();

  const { isOpen, onOpen, onClose } = useDisclosure(); // for controlling the modal
  const walletAddress = useAddress();
  const disconnect = useDisconnect();
  const isMismatched = useNetworkMismatch();
  const switchChain = useSwitchChain();
  const chainId = useChainId();
  const [ensName, setEnsName] = useState<string | null>(null);
  const [ensRecords, setEnsRecords] = useState<Record<string, string>>({});
  const [isLoading, setLoading] = useState(true);
  const session = useSession();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const provider = new ethers.providers.JsonRpcProvider(
      process.env.NEXT_PUBLIC_PROVIDER_URL
    );
    const fetchAvatarFromDatabase = async () => {
      const { data, error } = await supabase
        .from("wallet_profiles")
        .select("avatar_url")
        .eq("wallet_address", walletAddress)
        .single();

      if (data && data.avatar_url) {
        setAvatarUrl(data.avatar_url);
      }
    };

    const fetchEnsDetails = async () => {
      setLoading(true);
      if (walletAddress) {
        const ensNameLookup = await provider.lookupAddress(walletAddress);
        if (ensNameLookup) {
          setEnsName(ensNameLookup);

          const client = new ApolloClient({
            uri: "https://api.thegraph.com/subgraphs/name/ensdomains/ens",
            cache: new InMemoryCache(),
          });

          const query = gql`
            {
              domains(where:{name:"${ensNameLookup}"}) {
                id
                name
                resolver {
                  texts
                }
              }
            }
          `;

          const result = await client.query({ query });
          if (!ensName || !ensRecords.avatar) {
            const { data, error } = await supabase
              .from("wallet_profiles")
              .select("*")
              .eq("wallet_address", walletAddress)
              .single();

            if (!data) {
              await supabase.from("wallet_profiles").insert({
                wallet_address: walletAddress,
              });
            }
          }
          if (
            result.data &&
            result.data.domains.length > 0 &&
            result.data.domains[0].resolver
          ) {
            const resolver = await provider.getResolver(ensNameLookup);
            if (resolver) {
              const texts = result.data.domains[0].resolver.texts || [];

              const textRecords = await Promise.all(
                texts.map((key: string) => resolver.getText(key))
              );
              const newRecords: Record<string, string> = {};
              texts.forEach((text: string, index: number) => {
                newRecords[text] = textRecords[index];
              });

              setEnsRecords(newRecords);
            }
            setLoading(false);
          }

          // Outside the if block
          if (!ensName || !ensRecords.avatar) {
            fetchAvatarFromDatabase(); // Call the function to fetch avatar from the database
          }
        }
      }
    };

    fetchEnsDetails();
  }, [walletAddress]);

  return (
    <Container maxW={"100%"} className="sticky w-full rounded-xl top-4" py={2}>
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
            <Box>
              <Flex
                onClick={onOpen}
                className="flex h-12 gap-2 pl-3 cursor-pointer justify-center items-center bg-[#FFF] px-2 rounded-full py-1"
              >
                <HiMenuAlt4 className="w-5 h-5" />
                <Image
                  src={
                    ensRecords.avatar ||
                    avatarUrl ||
                    "https://cdn.discordapp.com/attachments/911669935363752026/1139256377118830662/ETH_Pand.png"
                  }
                  alt="Avatar"
                  height={36}
                  width={36}
                  className="border border-gray-300 rounded-full"
                />
              </Flex>

              <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>Account</ModalHeader>
                  <ModalBody>
                    <Account walletAddress={walletAddress} />
                    <Button colorScheme="grey" onClick={disconnect}>
                      Sign Out
                    </Button>
                  </ModalBody>
                </ModalContent>
              </Modal>
            </Box>
          )}
        </Flex>
      </Flex>
    </Container>
  );
}
