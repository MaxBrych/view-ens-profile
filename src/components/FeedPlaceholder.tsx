import { Button } from "@chakra-ui/react";
import React from "react";
import {
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useDisclosure,
  ModalBody,
  ModalContent,
  Modal,
  ModalCloseButton,
  ModalHeader,
  ModalOverlay,
  VStack,
  IconButton,
} from "@chakra-ui/react";
import PublicDonation from "./Donation/PublicDonation";
import PrivateDonation from "./Donation/PrivateDontation";

interface DonateButtonProps {
  address: any;
}

export default function FeedPlaceholder({ address }: DonateButtonProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <div className="flex flex-col items-center justify-center w-full gap-2 p-3 border border-gray-300 rounded-xl">
        <img
          className="w-16 h-16"
<<<<<<< HEAD
          src="https://cdn.discordapp.com/attachments/911669935363752026/1235130712668110848/Frame_155.png?ex=6633409d&is=6631ef1d&hm=2e02450c11657d39b9738516a475573c6eea6258ef8830f2b8f863db1ae96705&"
=======
          src="https://cdn.discordapp.com/attachments/911669935363752026/1210597182823071806/placeholder.png?ex=65eb237c&is=65d8ae7c&hm=37796b372f6ca206ed4fedcd33f6381737146757bfa07f63052445a3730393ff&"
>>>>>>> 41fbb65f18b4a9c4806df33535736afd4e71f3f2
          alt="placeholder"
        />
        <h1 className="text-xl font-bold tracking-tight md:text-xl ">
          Be the first donator
        </h1>
        <p className="mb-2 text-xs font-medium text-center text-gray-500 md:text-sm">
          The user has not received any donation yet.
        </p>
        <Button
          onClick={onOpen}
          textColor={"black"}
          fontSize={16}
          fontStyle={"bold"}
          px={16}
          rounded={"full"}
          colorScheme="grey"
          className="h-12 text-black rounded-full bg-[#05C756]"
        >
          Donate
        </Button>
      </div>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontStyle={"bold"}>Support</ModalHeader>
          <ModalCloseButton />
          <ModalBody
            mx={4}
            mb={4}
            className="border border-gray-300 rounded-xl"
          >
            <Tabs
              variant="soft-rounded"
              bg={"white"}
              textColor={"black"}
              colorScheme="whiteAlpha"
              className="py-4"
            >
              <TabList
                w={"full"}
                flex={1}
                flexDirection={"row"}
                justifyContent={"center"}
                className="flex flex-row items-center justify-center flex-initial flex-shrink-0 p-1 bg-gray-100 rounded-full"
              >
                <Tab
                  fontSize={{ base: 12, md: 14 }}
                  height={8}
                  className="shadow-sm "
                >
                  Public
                </Tab>
                <Tab
                  fontSize={{ base: 12, md: 14 }}
                  height={8}
                  className="shadow-sm"
                >
                  Private
                </Tab>
              </TabList>
              <TabPanels w={"full"}>
                <TabPanel>
                  <PublicDonation receiverAddress={address} />
                </TabPanel>
                <TabPanel>
                  <PrivateDonation receiverAddress={address} />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
