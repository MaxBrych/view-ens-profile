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
const CONTRACT_ADDRESS = "0xdca71af42DdC60ddb3f19081A2CA09FD3DB9e512"; // Your contract address

// Prepare USDC contract instance
const contractABI = [
  // transfer function
  "function transfer(address recipient, uint256 amount) public returns (bool)",
];

interface ProfileProps {
  receiverAddress: any;
}

export default function TransactionFeed({ receiverAddress }: ProfileProps) {
  const [senderEnsName, setSenderEnsName] = useState<string | null>(null);
  const [receiverEnsName, setReceiverEnsName] = useState<string | null>(null);
  const [ensProvider, setEnsProvider] =
    useState<ethers.providers.Provider | null>(null);
  const account = useAddress();
  const chainId = useChainId();

  const { contract } = useContract(CONTRACT_ADDRESS);
  const { data: transactions, isLoading: isLoadingTransactions } =
    useContractRead(contract, "getTransactionsForRecipient", [receiverAddress]);

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
      {isLoadingTransactions ? (
        <div>Loading transactions...</div>
      ) : (
        transactions?.map((transaction: any, index: any) => {
          return (
            <div key={index} className="px-1 py-3 text-black">
              <div className="flex justify-between text-sm ">
                <div>
                  <b>{formatAddress(transaction.sender)}</b> {""} donated{" "}
                </div>
                <div className="px-2 py-1 text-sm font-semibold text-[#00280E] bg-[#D0FFE0] rounded-full">
                  ${ethers.utils.formatUnits(transaction.amount, DECIMALS)}
                </div>
              </div>
              <div className="text-xs leading-3">
                {new Date(transaction.timestamp * 1000).toLocaleString()}
              </div>
              <div className="py-1 text-lg font-semibold">
                {transaction.message}
              </div>

              <hr />
            </div>
          );
        })
      )}
    </>
  );
}
