import { useContract, useContractRead } from "@thirdweb-dev/react";
import React from "react";
const CONTRACT_ADDRESS = "0x87939E801071102693678395EB3A311a7F39A4A0";

export default function TotalDonated() {
  const { contract } = useContract(CONTRACT_ADDRESS);
  const { data: donatedTransactions, isLoading: isLoadingDonatedTransactions } =
    useContractRead(contract, "getTotalDonated", []);
  return (
    <div className="flex flex-col items-center justify-center gap-2 text-xs mt-4">
      Total USDC donated
      <h1 className="text-2xl font-bold">
        {donatedTransactions
          ? (parseInt(donatedTransactions.toString()) / 1_000_000).toFixed(2)
          : isLoadingDonatedTransactions}{" "}
        $
      </h1>
    </div>
  );
}
