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
import PublicDonation from "./PublicDonation";
import PrivateDonation from "./PrivateDontation";
import { BsCurrencyDollar } from "react-icons/bs";

interface DonateButtonProps {
  address: any;
  name?: string;
}

export default function Donate({ address, name }: DonateButtonProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <VStack>
        <IconButton
          colorScheme="green"
          color="black"
          bg="#05C756"
          aria-label="Send Message"
          icon={<BsCurrencyDollar />}
          onClick={onOpen}
          rounded={"full"}
          size={"lg"}
        />
        {name && (
          <Text
            fontSize="xs"
            className="font-semibold"
            textColor={"blackAlpha.600"}
          >
            {name}
          </Text>
        )}
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Support</ModalHeader>
          <ModalCloseButton />
          <ModalBody
            mx={4}
            mb={4}
            className="border border-gray-300 rounded-xl"
          >
            <Tabs variant="soft-rounded" colorScheme="white" className="w-full">
              <TabList
                w={"full"}
                flex={1}
                flexDirection={"row"}
                justifyContent={"center"}
                className="flex flex-row items-center justify-center w-full p-2 bg-gray-300 rounded-full"
              >
                <Tab
                  fontSize={{ base: 12, md: 14 }}
                  height={6}
                  className="shadow-sm"
                >
                  Public
                </Tab>
                <Tab
                  fontSize={{ base: 12, md: 14 }}
                  height={6}
                  className="shadow-sm"
                >
                  Private
                </Tab>
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
