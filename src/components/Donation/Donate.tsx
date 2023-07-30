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
import { FaCoffee } from "react-icons/fa";

interface DonateButtonProps {
  address: any;
}

export default function Donate({ address }: DonateButtonProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <VStack>
        <IconButton
          color="black"
          bg="gray.200"
          aria-label="Send Message"
          icon={<FaCoffee />}
          onClick={onOpen}
          rounded={"full"}
          size={"lg"}
        />
        <Text
          fontSize="xs"
          className="font-semibold"
          textColor={"blackAlpha.600"}
        >
          Support
        </Text>
      </VStack>

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
