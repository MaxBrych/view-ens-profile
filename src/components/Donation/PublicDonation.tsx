import React, { ChangeEvent, useEffect, useState } from "react";
import {
  Button,
  Flex,
  useDisclosure,
  Icon,
  useToast,
  Text,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import TipTap from "../Editor/TipTap";
import { AiFillCheckCircle } from "react-icons/ai"; // for checkmark icon
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
const CONTRACT_ADDRESS = "0x87939E801071102693678395EB3A311a7F39A4A0";
const DONATION_AMOUNTS = [5, 10, 25];

// Prepare USDC contract instance
const contractABI = [
  "function approve(address spender, uint256 amount) public returns (bool)",
  "function transfer(address recipient, uint256 amount) public returns (bool)",
];

interface DonateButtonProps {
  receiverAddress: any;
}

export default function PublicDonation({ receiverAddress }: DonateButtonProps) {
  const [editorContent, setEditorContent] = useState("");

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
  const [isLoadingTransaction, setIsLoadingTransaction] =
    useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<string>("");
  const [loadingMessage, setLoadingMessage] = useState("");
  const [isDonationSuccessful, setIsDonationSuccessful] = useState(false);
  const [transactionHash, setTransactionHash] = useState("");
  const [amount, setAmount] = useState(0);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<any>();

  const [ethersDynamic, setEthersDynamic] = useState<any>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };
  const uploadBoth = async (message: any) => {
    if (!file || !message) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("message", message);
    try {
      const response = await fetch("/api/uploadBoth", {
        method: "POST",
        body: formData,
      });
      const json = await response.json();
      console.log("json:", json);
      return json.txId;
    } catch (err) {
      console.log({ err });
      return null;
    }
  };
  const uploadTextOnly = async (message: string) => {
    try {
      const response = await fetch("/api/uploadText", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: Buffer.from(message) }), // Convert message to Buffer
      });
      const json = await response.json();
      console.log("json:", json);
      return json.txId;
    } catch (err) {
      console.log({ err });
      return null;
    }
  };

  const uploadFileOnly = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await fetch("/api/uploadFile", {
        method: "POST",
        body: formData,
      });
      const json = await response.json();
      console.log("json:", json);
      return json.txId;
    } catch (err) {
      console.log({ err });
      return null;
    }
  };

  useEffect(() => {
    const loadProviderAndSigner = async () => {
      if (!wallet) {
        console.log("No wallet available");
        return;
      }

      const ethersDynamic = await import("ethers");
      setEthersDynamic(ethersDynamic); // Set it here

      const signer = await wallet.getSigner();
      console.log("Got signer:", signer);

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

  const CREATOR_FEE = 1001; //  0.01% fee

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
    "transferAndRecord"
  );

  async function handleApproveAndDonate(amount: number) {
    let arweaveTxId;
    if (message && file) {
      arweaveTxId = await uploadBoth(message);
    } else if (message) {
      arweaveTxId = await uploadTextOnly(message);
    } else if (file) {
      arweaveTxId = await uploadFileOnly();
    }

    if (!arweaveTxId) {
      console.error("Failed to upload to Arweave.");
      return;
    }
    if (!usdcContract || !account) {
      console.log("No USDC contract or account.");
      return;
    }
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

    try {
      setIsLoadingTransaction(true);

      // Convert the donation amount to the correct number of decimal places
      const valueWithoutFee = ethersDynamic.utils.parseUnits(
        amount.toString(),
        DECIMALS
      );
      const fee = valueWithoutFee.mul(CREATOR_FEE).div(10 ** 6);
      const totalValue = valueWithoutFee.add(fee);

      // Call the approve function on the USDC contract with the total value
      setLoadingMessage("Sign to approve USDC");
      const approveTx = await usdcContract.approve(
        CONTRACT_ADDRESS,
        totalValue
      );
      console.log("Approval sent:", approveTx);

      // Wait for the approval transaction to be confirmed
      const provider = new ethersDynamic.providers.Web3Provider(
        window.ethereum
      );
      await provider.waitForTransaction(approveTx.hash);
      console.log("Approval confirmed:", approveTx.hash);

      // Once the approval transaction is confirmed, make the donation
      setLoadingMessage("Sign to transfer USDC");
      const tx: any = await transferAndRecord({
        args: [receiverAddress, totalValue, arweaveTxId],
      });

      console.log("Transaction sent:", tx);
      await provider.waitForTransaction(tx.hash);
      console.log("Transaction confirmed:", tx.hash);
      setTransactionHash(tx.hash); // save the transaction hash
      setIsDonationSuccessful(true); // indicate the donation was successful
    } catch (err) {
      console.error("Error in transaction:", err);
    } finally {
      setIsLoadingTransaction(false);
      setLoadingMessage("");
    }
  }

  return (
    <>
      {!isDonationSuccessful ? (
        // the previous modal content goes here
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
          {/*<TipTap
            onContentChange={(content: any) => setEditorContent(content)}
          />*/}
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Message"
            className="w-full h-12 p-3 border-2 border-gray-200 rounded-lg focus:outline-none"
          />

          <FormControl marginTop="4">
            <FormLabel className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer dark:hover:bg-bray-800 hover:bg-gray-200 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
              <div className="flex flex-col items-center justify-center pt-5 pb-5">
                <svg
                  className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  SVG, PNG, JPG or GIF (MAX. 800x400px)
                </p>
              </div>
              <Input
                type="file"
                className="hidden"
                placeholder="Upload a file"
                onChange={handleFileChange}
              />
            </FormLabel>
          </FormControl>
          {isLoadingTransaction && <p>{loadingMessage}</p>}
          <Button
            rounded={"full"}
            bg={"primary.500"}
            h={12}
            textColor={"black"}
            _hover={{ bg: "primary.600" }}
            className="w-full h-20 font-bold rounded-full bg-primary-500"
            onClick={() => {
              handleApproveAndDonate(amount);
              onClose();
            }}
            isLoading={isLoadingTransaction}
            fontStyle={"bold"}
          >
            Donate
          </Button>
        </Flex>
      ) : (
        // the success message and buttons
        <Flex direction="column" alignItems={"center"} gap={4}>
          <Icon as={AiFillCheckCircle} w={24} h={24} />
          <Text fontSize="xl" fontWeight="bold" mt={5}>
            Donation Successful
          </Text>
          <Button
            mt={5}
            onClick={() => {
              setIsDonationSuccessful(false); // reset the modal for the next use
              onClose(); // close the modal
            }}
          >
            Back to profile page
          </Button>
          <Button
            mt={5}
            as="a"
            href={`https://polygonscan.com/tx/${transactionHash}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View transaction
          </Button>
        </Flex>
      )}
    </>
  );
}
