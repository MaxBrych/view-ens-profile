"use client";
import React, { ChangeEvent, useEffect, useState } from "react";
import {
  Box,
  Input,
  Button,
  FormControl,
  FormLabel,
  Textarea,
} from "@chakra-ui/react";
import { useAddress, useContract } from "@thirdweb-dev/react";
import { ethers } from "ethers";

interface MySmartContract extends ethers.Contract {
  getAll: () => Promise<any>;
  setMessage: (transactionId: string) => Promise<void>;
}

const USDC_CONTRACT_ADDRESS = "0x2791bca1f2de4661ed88a30c99a7a9449aa84174"; // Polygon USDC contract address
const DECIMALS = 6; // USDC has 6 decimals
const CONTRACT_ADDRESS = "0x87939E801071102693678395EB3A311a7F39A4A0";
const DONATION_AMOUNTS = [5, 10, 25];

// Prepare USDC contract instance
const contractABI = [
  "function approve(address spender, uint256 amount) public returns (bool)",
  "function transfer(address recipient, uint256 amount) public returns (bool)",
];

interface ContractAddress {
  contractAddress: any;
}

export default function CreateProposalArticle() {
  const address = useAddress();
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<any>();
  const [transaction, setTransaction] = useState("");

  const { contract: donate, isLoading: isMessageLoading } =
    useContract<any>(CONTRACT_ADDRESS);

  const msg = donate as unknown as MySmartContract;

  const uploadBoth = async () => {
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
      setTransaction(json.txId);
      if (msg) {
        await msg.setMessage(json.txId);
        window.location.reload();
      }
    } catch (err) {
      console.log({ err });
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  return (
    <Box borderWidth="1px" borderRadius="lg" padding="6" marginTop="4">
      {address && (
        <>
          <FormControl marginTop="4">
            <FormLabel>Message</FormLabel>
            <Input
              placeholder="Enter message"
              onChange={(e) => setMessage(e.target.value)}
              bg="gray.700"
              textColor="white"
              borderRadius="xl"
            />
          </FormControl>
          <FormControl marginTop="4">
            <FormLabel>Arweave File</FormLabel>
            <Input
              type="file"
              placeholder="Upload a file"
              onChange={handleFileChange}
              cursor="pointer"
              border="2px dashed"
              height={24}
              borderColor="gray.700"
              borderRadius="xl"
            />
          </FormControl>
          <Button
            colorScheme="blue"
            marginTop="4"
            disabled={isMessageLoading}
            isLoading={isMessageLoading}
            onClick={uploadBoth}
          >
            Upload
          </Button>
        </>
      )}
    </Box>
  );
}
