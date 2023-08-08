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
      <div className="flex flex-col items-center justify-center gap-2 p-3 border w-full border-[#DDD] rounded-xl">
        <img
          className="w-16 h-16"
          src="https://cdn.discordapp.com/attachments/911669935363752026/1137477405963997214/usdc.png"
          alt="placeholder"
        />
        <h1 className="text-xl font-bold tracking-tight md:text-2xl ">
          Be the first donator
        </h1>
        <p className="mb-2 text-xs text-center font-medium text-[#888] md:text-sm">
          The user has not received any donation yet.
        </p>
        <Button
          onClick={onOpen}
          textColor={"white"}
          px={16}
          rounded={"full"}
          colorScheme="grey"
          className="h-12 text-white rounded-full bg-[#05C756]"
        >
          Donate
        </Button>
      </div>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Support</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Tabs variant="soft-rounded" className="w-full">
              <TabList>
                <Tab>Public</Tab>
                <Tab>Private</Tab>
              </TabList>
              <TabPanels>
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
