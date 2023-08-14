import { HiMenuAlt4 } from "react-icons/hi";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import Account from "./Auth/Account";
import {
  ConnectWallet,
  useAddress,
  useDisconnect,
  useNetworkMismatch,
  useSwitchChain,
} from "@thirdweb-dev/react";
import { Polygon } from "@thirdweb-dev/chains";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import {
  Avatar,
  Container,
  Flex,
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
  Button,
} from "@chakra-ui/react";
import { useUserAvatarAndENS } from "@/hooks/useUserAvatarAndENS";

export default function Navbar() {
  const walletAddress = useAddress();
  const { ensName, avatarUrl, isLoading } = useUserAvatarAndENS(
    walletAddress || ""
  ); // Provide a fallback value
  const { isOpen, onOpen, onClose } = useDisclosure();
  const disconnect = useDisconnect();
  const isMismatched = useNetworkMismatch();
  const switchChain = useSwitchChain();

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
            <Box>
              <Flex
                onClick={onOpen}
                className="flex h-12 gap-2 pl-3 justify-center items-center bg-[#FFF] px-2 rounded-full py-1"
              >
                <HiMenuAlt4 className="w-5 h-5" />
                <Image
                  src={
                    avatarUrl || // Use avatarUrl instead of ensRecords
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
                    <Button
                      colorScheme="grey"
                      className="block h-10 px-6 mt-2 text-center bg-gray-300 rounded-md cursor-pointer"
                      onClick={disconnect}
                    >
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
