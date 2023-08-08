import React from "react";
import { ethers } from "ethers";
import FeedPlaceholder from "../FeedPlaceholder";

interface ReceivedProps {
  transactions: any[];
  isLoading: boolean;
  address: string;
}

const DECIMALS = 6; // USDC has 6 decimals

export default function Received({
  transactions,
  isLoading,
  address,
}: ReceivedProps) {
  function formatAddress(address: string): string {
    return address.slice(0, 6) + "..." + address.slice(-4);
  }

  if (isLoading) {
    return <div>Loading received transactions...</div>;
  }

  if (transactions && transactions.length === 0) {
    return <FeedPlaceholder address={address} />;
  }

  return (
    <>
      {transactions.map((transaction: any, index: any) => (
        <div key={index} className="px-1 py-3 text-black">
          <div className="flex items-center justify-between text-sm">
            <div>
              <b>{formatAddress(transaction.sender)}</b> donated
            </div>
            <div className="px-2 py-1 text-xs font-bold text-[#00280E] bg-[#D0FFE0] rounded-full">
              ${ethers.utils.formatUnits(transaction.amount, DECIMALS)}
            </div>
          </div>
          <div className="py-1 text-lg font-semibold text-left md:text-xl">
            {transaction.message}
          </div>
          <div className="text-xs leading-3 text-left">
            {new Date(transaction.timestamp * 1000).toLocaleString()}
          </div>
          <hr />
        </div>
      ))}
    </>
  );
}
