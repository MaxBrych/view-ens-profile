import React, { useEffect, useState } from "react";
import {
  Button,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
  Icon,
  useToast,
  VStack,
  Text,
  IconButton,
} from "@chakra-ui/react";
import { BiCoffeeTogo } from "react-icons/bi"; // for coffee icon
import {
  WalletInstance,
  useAddress,
  useChainId,
  useWallet,
  useContract,
  useContractWrite,
  useContractRead,
} from "@thirdweb-dev/react";
import { ethers } from "ethers";

const USDC_CONTRACT_ADDRESS = "0x2791bca1f2de4661ed88a30c99a7a9449aa84174"; // Polygon USDC contract address
const DECIMALS = 6; // USDC has 6 decimals
const CONTRACT_ADDRESS = "0x36415EDb32fC5F90aebFaA258B2e11962b38aaB5"; // Your contract address
const DONATION_AMOUNTS = [5, 10, 25];

// Prepare USDC contract instance
const contractABI = [
  // transfer function
  "function transfer(address recipient, uint256 amount) public returns (bool)",
];

interface DonateButtonProps {
  receiverAddress: any;
}

export default function PublicDonation({ receiverAddress }: DonateButtonProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const wallet: WalletInstance | undefined = useWallet();
  const [usdcContract, setUsdcContract] = useState<ethers.Contract | null>(
    null
  );
  const chainId = useChainId();
  const account = useAddress();
  const [senderEnsName, setSenderEnsName] = useState<string | null>(null);
  const [receiverEnsName, setReceiverEnsName] = useState<string | null>(null);
  const [ensProvider, setEnsProvider] =
    useState<ethers.providers.Provider | null>(null);

  useEffect(() => {
    const loadProviderAndSigner = async () => {
      if (!wallet) {
        console.log("No wallet available");
        return;
      }

      const signer = await wallet.getSigner();
      console.log("Got signer:", signer);

      const ethersDynamic: any = await import("ethers");
      const usdcContract = new ethersDynamic.Contract(
        USDC_CONTRACT_ADDRESS,
        contractABI,
        signer
      );
      setUsdcContract(usdcContract);

      const provider = new ethersDynamic.providers.JsonRpcProvider(
        process.env.NEXT_PUBLIC_PROVIDER_URL
      );
      setEnsProvider(provider);
    };
    loadProviderAndSigner();
  }, [wallet]);

  useEffect(() => {
    const resolveNames = async () => {
      if (!ensProvider || !account || !receiverAddress) return;
      const senderName = await ensProvider.lookupAddress(account);
      const receiverName = await ensProvider.lookupAddress(receiverAddress);
      setSenderEnsName(senderName);
      setReceiverEnsName(receiverName);
    };

    resolveNames();
  }, [ensProvider, account, receiverAddress]);

  const toast = useToast();

  const { contract } = useContract(CONTRACT_ADDRESS);
  const { mutateAsync: transferAndRecord, isLoading } = useContractWrite(
    contract,
    "addToBlockchain"
  );

  async function handleDonate(amount: number, message: string) {
    console.log(
      "handleDonate called with amount:",
      amount,
      "message:",
      message
    ); // Added log

    if (!wallet || !account) {
      console.log("No wallet or account."); // Added log
      return;
    }

    if (chainId !== 137) {
      toast({
        title: "Network error.",
        description: "Please connect to the Polygon mainnet.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      console.log("Not connected to Polygon mainnet."); // Added log
      return;
    }

    if (amount <= 0) {
      toast({
        title: "Invalid amount.",
        description: "Please enter a positive donation amount.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      console.log("Invalid amount:", amount); // Added log
      return;
    }

    if (message.length > 200) {
      toast({
        title: "Message too long.",
        description: "Please keep your message under 200 characters.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      console.log("Message too long:", message); // Added log
      return;
    }

    try {
      const ethersDynamic: any = await import("ethers");
      const value = ethersDynamic.utils.parseUnits(amount.toString(), DECIMALS);

      // Record the transaction details in the contract and perform the transfer
      const tx: any = await transferAndRecord({
        args: [receiverAddress, value, message],
      });

      console.log("Transaction sent:", tx); // Added log

      const provider = new ethersDynamic.providers.Web3Provider(
        window.ethereum
      );
      await provider.waitForTransaction(tx.hash);
      console.log("Transaction confirmed:", tx.hash); // Added log
    } catch (err) {
      console.error("Error in transaction:", err); // Added log
    }
  }

  const [amount, setAmount] = useState(0);
  const [message, setMessage] = useState("");

  return (
    <>
      <Flex direction="column" alignItems={"center"} gap={4}>
        <div className="relative w-full">
          <span className="absolute text-lg left-28 md:left-36 top-3">$</span>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value))}
            placeholder="0"
            className="w-full pl-8 text-5xl text-center focus:outline-none"
          />
        </div>

        <Flex direction="row" gap={4}>
          {DONATION_AMOUNTS.map((amt) => (
            <Button
              className={` ${amt === amount ? "bg-primary-500" : ""}`}
              key={amt}
              rounded={"full"}
              fontSize={"sm"}
              fontStyle={"semibold"}
              h={8}
              px={6}
              onClick={() => setAmount(amt)}
            >
              {`$${amt}`}
            </Button>
          ))}
        </Flex>
        <hr />

        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Message"
          className="w-full h-12 p-3 border-2 border-gray-200 rounded-lg focus:outline-none"
        />

        <Button
          rounded={"full"}
          bg={"primary.500"}
          h={12}
          _hover={{ bg: "primary.600" }}
          className="w-full h-20 rounded-full bg-primary-500 "
          onClick={() => {
            handleDonate(amount, message);
            onClose();
          }}
        >
          Donate
        </Button>
      </Flex>
    </>
  );
}
