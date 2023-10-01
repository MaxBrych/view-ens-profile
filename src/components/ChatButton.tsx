// Importing necessary dependencies
import { init, useQuery } from "@airstack/airstack-react";
import { useRouter } from "next/router";
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
import { BsFillChatFill } from "react-icons/bs";
import Home from "./Chat/Home";
import { useEffect } from "react";

// Initialize Airstack SDK
if (process.env.NEXT_PUBLIC_AIRSTACK_KEY) {
  init(process.env.NEXT_PUBLIC_AIRSTACK_KEY);
}

// Define the component props
interface ChatButtonProps {
  receiverAddress: string | null;
}

// Define the ChatButton component
const ChatButton: React.FC<ChatButtonProps> = ({ receiverAddress }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Define the GraphQL query
  const xmtpQuery = `
    query MyQuery {
      XMTPs(input: {blockchain: ALL, filter: {owner: {_eq: "${receiverAddress}"}}}) {
        XMTP {
          isXMTPEnabled
        }
      }
    }
  `;

  // Use the useQuery hook to execute the GraphQL query
  const { data, loading, error } = useQuery(xmtpQuery);

  // Handle the data, loading, and error states
  if (loading) return null; // Optionally show a loading spinner
  if (error) return null; // Optionally show an error message
  if (data && data.XMTPs.XMTP && data.XMTPs.XMTP.isXMTPEnabled) {
    // XMTP Protocol is enabled, show the ChatButton
    return (
      <>
        <VStack>
          <IconButton
            colorScheme="green"
            color="black"
            bg="#05C756"
            aria-label="Send Message"
            icon={<BsFillChatFill />}
            onClick={onOpen}
            rounded={"full"}
            size={"lg"}
          />
          <Text
            fontSize="xs"
            className="font-semibold"
            textColor={"blackAlpha.600"}
          >
            Chat
          </Text>
        </VStack>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Chat</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Home receiverAddress={receiverAddress} />
            </ModalBody>
          </ModalContent>
        </Modal>
      </>
    );
  }

  // XMTP Protocol is not enabled, hide the ChatButton
  return null;
};

export default ChatButton;
