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
import { HiCurrencyDollar } from "react-icons/hi";

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
          color="black"
          bg="gray.200"
          aria-label="Send Message"
          icon={<HiCurrencyDollar />}
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
