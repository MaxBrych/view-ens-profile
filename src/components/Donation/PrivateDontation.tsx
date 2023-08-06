import React, { useEffect, useState } from "react";
import { Button, Flex, useDisclosure, useToast, Text } from "@chakra-ui/react";
import {
  WalletInstance,
  useAddress,
  useChainId,
  useWallet,
} from "@thirdweb-dev/react";
import { ethers } from "ethers";

const USDC_CONTRACT_ADDRESS = "0x2791bca1f2de4661ed88a30c99a7a9449aa84174"; // Polygon USDC contract address
const DECIMALS = 6; // USDC has 6 decimals
const DONATION_AMOUNTS = [5, 10, 25];

// Prepare USDC contract instance
const contractABI = [
  // transfer function
  "function transfer(address recipient, uint256 amount) public returns (bool)",
];

interface DonateButtonProps {
  receiverAddress: any;
}

export default function PrivateDonation({
  receiverAddress,
}: DonateButtonProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const wallet: WalletInstance | undefined = useWallet();
  const [usdcContract, setUsdcContract] = useState<ethers.Contract | null>(
    null
  );
  const chainId = useChainId();
  const account = useAddress();
  const toast = useToast();
  const [amount, setAmount] = useState(0);

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
    };
    loadProviderAndSigner();
  }, [wallet]);

  async function handleDonate() {
    if (!wallet || !account || !usdcContract || amount <= 0) {
      return;
    }

    if (chainId !== 137) {
      // 137 is the chainId for Polygon mainnet
      toast({
        title: "Network error.",
        description: "Please connect to the Polygon mainnet.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const ethersDynamic: any = await import("ethers");
    const value = ethersDynamic.utils.parseUnits(amount.toString(), DECIMALS);
    const tx = await usdcContract.transfer(receiverAddress, value);

    const provider = new ethersDynamic.providers.Web3Provider(window.ethereum);
    await provider.waitForTransaction(tx.hash);
  }

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
              rounded={"full"}
              fontSize={"sm"}
              fontStyle={"semibold"}
              h={8}
              px={6}
              className={`text-sm ${amt === amount ? "bg-primary-500" : ""}`}
              key={amt}
              onClick={() => setAmount(amt)}
            >
              {`${amt}$`}
            </Button>
          ))}
        </Flex>
        <hr />

        <Button
          rounded={"full"}
          h={12}
          bg={"primary.500"}
          _hover={{ bg: "primary.600" }}
          className="w-full h-16 rounded-full bg-primary-500 "
          onClick={handleDonate}
        >
          Donate
        </Button>
      </Flex>
    </>
  );
}
