import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import FeedPlaceholder from "../FeedPlaceholder";
import Image from "next/image";

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
  const [arweaveData, setArweaveData] = useState<any[]>([]);

  async function fetchArweaveData(url: string) {
    if (!url.startsWith("https://arweave.net/")) return null;

    const transactionId = url.split("/").pop();
    const query = `
      query getByIds {
        transactions(ids:["${transactionId}"]) {
          edges {
            node {
              id
              tags {
                name
                value
              }
            }
          }
        }
      }`;

    const response = await fetch("https://arweave.net/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });

    const result = await response.json();
    return result.data.transactions.edges[0]?.node.tags;
  }

  useEffect(() => {
    const fetchAllArweaveData = async () => {
      const allData = await Promise.all(
        transactions.map((transaction: any) =>
          fetchArweaveData(transaction.message)
        )
      );
      setArweaveData(allData);
    };

    fetchAllArweaveData();
  }, [transactions]);

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
      {transactions.map((transaction: any, index: any) => {
        const arweaveContent = arweaveData[index];

        const isArweaveURL = transaction.message.startsWith(
          "https://arweave.net/"
        );
        const messageTag = arweaveContent
          ? arweaveContent.find((tag: any) => tag.name === "Message")?.value
          : null;
        const imageUrlTag = isArweaveURL ? transaction.message : null;

        return (
          <div key={index} className="w-full py-3 text-black ">
            <div className="flex items-center justify-between text-sm font-normal">
              <div>{formatAddress(transaction.sender)} donated</div>
              <div className="px-2 py-1 text-xs font-bold text-[#00280E] bg-[#D0FFE0] rounded-full">
                ${ethers.utils.formatUnits(transaction.amount, DECIMALS)}
              </div>
            </div>
            <div className="py-1 text-lg font-bold text-left md:text-xl">
              {messageTag || transaction.message}
            </div>
            {imageUrlTag && (
              <Image
                className="object-cover object-center rounded-xl max-h-80"
                src={imageUrlTag}
                alt="Uploaded content"
                width={320}
                height={320}
              />
            )}
            <div className="mt-1 text-xs leading-3 text-left">
              {new Date(transaction.timestamp * 1000).toLocaleString()}
            </div>
          </div>
        );
      })}
    </>
  );
}
