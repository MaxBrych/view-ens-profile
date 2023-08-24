import { useContract, useContractRead } from "@thirdweb-dev/react";
import React from "react";
const CONTRACT_ADDRESS = "0x2eDb7B942926fB8AfBAfE513d3325E61E0536b90";

export default function TotalDonated() {
  const { contract } = useContract(CONTRACT_ADDRESS);
  const { data: donatedTransactions, isLoading: isLoadingDonatedTransactions } =
    useContractRead(contract, "getTotalDonated", []);
  return (
    <div>
      Total USDC donated
      <h1>
        {donatedTransactions
          ? (parseInt(donatedTransactions.toString()) / 1_000_000).toFixed(2)
          : isLoadingDonatedTransactions}
      </h1>
    </div>
  );
}
