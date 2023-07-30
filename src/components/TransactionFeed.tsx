import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Text } from "@chakra-ui/react";
import {
  WalletInstance,
  useAddress,
  useChainId,
  useWallet,
  useContract,
  useContractWrite,
  useContractRead,
} from "@thirdweb-dev/react";

const USDC_CONTRACT_ADDRESS = "0x2791bca1f2de4661ed88a30c99a7a9449aa84174"; // Polygon USDC contract address
const DECIMALS = 6; // USDC has 6 decimals
const CONTRACT_ADDRESS = "0x9c8b3ff4ec56363daED3caB2d449bdA279D14e37"; // Your contract address

// Prepare USDC contract instance
const contractABI = [
  // transfer function
  "function transfer(address recipient, uint256 amount) public returns (bool)",
];

export default function TransactionFeed() {
  const [senderEnsName, setSenderEnsName] = useState<string | null>(null);
  const [receiverEnsName, setReceiverEnsName] = useState<string | null>(null);
  const [ensProvider, setEnsProvider] =
    useState<ethers.providers.Provider | null>(null);
  const account = useAddress();
  const receiverAddress = useAddress();
  const chainId = useChainId();

  const { contract } = useContract(CONTRACT_ADDRESS);
  // Use useContractRead to get all transactions
  const { data: transactions, isLoading: isLoadingTransactions } =
    useContractRead(contract, "getAllTransactions");

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
      {isLoadingTransactions ? (
        <div>Loading transactions...</div>
      ) : (
        transactions?.map((transaction: any, index: any) => {
          return (
            <div key={index} className="text-black">
              <div>Sender: {senderEnsName}</div>
              <div>Receiver: {receiverEnsName}</div>
              <div>
                Amount: {ethers.utils.formatUnits(transaction.amount, DECIMALS)}
              </div>
              <div>Message: {transaction.message}</div>
              <div>
                Timestamp:{" "}
                {new Date(transaction.timestamp * 1000).toLocaleString()}
              </div>
              <hr />
            </div>
          );
        })
      )}
    </>
  );
}
