import React from "react";
import { ConnectKit } from "./ConnectKit";
import { Container, Flex, Heading } from "@chakra-ui/react";
import { ConnectKitButton } from "connectkit";
import Image from "next/image";
import Link from "next/link";

export default function NavBarNew() {
  return (
    <Container
      maxW={"1000px"}
      className="fixed w-[90vw]  rounded-xl top-4"
      py={2}
    >
      <Flex justifyContent={"space-between"} alignItems={"center"}>
        <Link href="/">
          <Image
            alt="Logo"
            src="https://cdn.discordapp.com/attachments/911669935363752026/1134946436908322846/Flippr_Wordmark.png"
            height={48}
            width={200}
            className="h-48 cursor-pointer w-160"
          />
        </Link>
        <ConnectKitButton mode="light" theme="soft" />
      </Flex>
    </Container>
  );
}
