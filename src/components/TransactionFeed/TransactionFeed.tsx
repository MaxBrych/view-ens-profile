import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import {
  WalletInstance,
  useAddress,
  useChainId,
  useWallet,
  useContract,
  useContractWrite,
  useContractRead,
} from "@thirdweb-dev/react";
import FeedPlaceholder from "../FeedPlaceholder";
import Received from "./Received";
import Donated from "./Donated";

const USDC_CONTRACT_ADDRESS = "0x2791bca1f2de4661ed88a30c99a7a9449aa84174"; // Polygon USDC contract address
const DECIMALS = 6; // USDC has 6 decimals
const CONTRACT_ADDRESS = "0x2C381d51bf5A6B8229Fe9C443c6D9257db4d5F43";

interface ProfileProps {
  receiverAddress: any;
}

export default function TransactionFeed({ receiverAddress }: ProfileProps) {
  const [senderEnsName, setSenderEnsName] = useState<string | null>(null);
  const [receiverEnsName, setReceiverEnsName] = useState<string | null>(null);
  const [ensProvider, setEnsProvider] =
    useState<ethers.providers.Provider | null>(null);
  const [activeTab, setActiveTab] = useState<"received" | "donated">(
    "received"
  );
  const account = useAddress();
  const chainId = useChainId();

  const { contract } = useContract(CONTRACT_ADDRESS);

  const {
    data: receivedTransactions,
    isLoading: isLoadingReceivedTransactions,
  } = useContractRead(contract, "getTransactionsForRecipient", [
    receiverAddress,
  ]);
  const { data: donatedTransactions, isLoading: isLoadingDonatedTransactions } =
    useContractRead(contract, "getTransactionsForSender", [account]);

  function formatAddress(address: string): string {
    return address.slice(0, 6) + "..." + address.slice(-4);
  }

  const wallet: WalletInstance | undefined = useWallet();
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

  return (
    <>
      <Tabs colorScheme="green" align="center">
        <TabList>
          <Tab w={"full"}>Received</Tab>
          <Tab w={"full"}>Donated</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Received
              transactions={receivedTransactions}
              isLoading={isLoadingReceivedTransactions}
              address={receiverAddress}
            />
          </TabPanel>
          <TabPanel>
            <Donated
              transactions={donatedTransactions}
              isLoading={isLoadingDonatedTransactions}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
}
