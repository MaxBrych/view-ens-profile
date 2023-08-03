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
import { FaRegComment } from "react-icons/fa";
import { BsFillChatFill } from "react-icons/bs";
import Home from "./Chat/Home";

interface ChatButtonProps {
  receiverAddress: any;
}

const ChatButton: React.FC<ChatButtonProps> = ({ receiverAddress }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <VStack>
        <IconButton
          color="black"
          bg="gray.200"
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
};

export default ChatButton;
