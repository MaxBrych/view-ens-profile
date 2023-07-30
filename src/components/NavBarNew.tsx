import React from "react";
import { ConnectKit } from "./ConnectKit";
import { Container, Flex, Heading } from "@chakra-ui/react";
import { ConnectKitButton } from "connectkit";
import Image from "next/image";
import Link from "next/link";
import { ConnectWallet } from "@thirdweb-dev/react";

export default function NavBarNew() {
  return (
    <Container className="w-full rounded-xl" py={2}>
      <Flex
        justifyContent={"space-between"}
        className="w-full md:w-[50vw] "
        alignItems={"center"}
      >
        <Link href="/">
          <Image
            alt="Logo"
            src="https://cdn.discordapp.com/attachments/911669935363752026/1134946436908322846/Flippr_Wordmark.png"
            height={48}
            width={200}
            className="w-auto h-8 cursor-pointer"
          />
        </Link>
        <ConnectWallet />
      </Flex>
    </Container>
  );
}
