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
  function formatAddress(address: string): string {
    return address.slice(0, 6) + "..." + address.slice(-4);
  }

  const useArweaveContent = (url: string) => {
    const [content, setContent] = useState<any>(null);

    useEffect(() => {
      const fetchArweaveData = async () => {
        if (url.startsWith("https://arweave.net/")) {
          const transactionId = url.split("/").pop();

          // GraphQL query
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

          // POST request to the GraphQL endpoint
          const response = await fetch("https://arweave.net/graphql", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              query: query,
            }),
          });

          const result = await response.json();
          if (result.data.transactions.edges[0]) {
            setContent(result.data.transactions.edges[0].node.tags);
          }
          console.log(
            "Fetched tags:",
            result.data.transactions.edges[0].node.tags
          );
        }
      };

      fetchArweaveData();
    }, [url]);

    return content;
  };

  if (isLoading) {
    return <div>Loading received transactions...</div>;
  }

  if (transactions && transactions.length === 0) {
    return <FeedPlaceholder address={address} />;
  }

  return (
    <>
      {transactions.map((transaction: any, index: any) => {
        const arweaveContent = useArweaveContent(transaction.message);

        const isArweaveURL = transaction.message.startsWith(
          "https://arweave.net/"
        );
        const messageTag = arweaveContent
          ? arweaveContent.find((tag: any) => tag.name === "Message")?.value
          : null;
        const imageUrlTag = isArweaveURL ? transaction.message : null;

        return (
          <div key={index} className="py-3 text-black ">
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
                src={imageUrlTag}
                alt="Uploaded content"
                width={320}
                height={320}
              />
            )}
            <div className="text-xs leading-3 text-left">
              {new Date(transaction.timestamp * 1000).toLocaleString()}
            </div>
          </div>
        );
      })}
    </>
  );
}
