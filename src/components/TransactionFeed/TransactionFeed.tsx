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
import Received from "./Received";
import Donated from "./Donated";

const CONTRACT_ADDRESS = "0x3AaD0C509de23bE3A7831201138289AB9461F01C";

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
    useContractRead(contract, "getTransactionsForSender", [receiverAddress]);

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
          <Tab w={"full"} fontSize={"md"} fontWeight={500}>
            Received
          </Tab>
          <Tab w={"full"} fontSize={"md"} fontWeight={500}>
            Donated
          </Tab>
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
