import { useContract, useContractRead } from "@thirdweb-dev/react";
import React from "react";
const CONTRACT_ADDRESS = "0x87939E801071102693678395EB3A311a7F39A4A0";

export default function UserReceived(address: any) {
  const { contract } = useContract(CONTRACT_ADDRESS);
  const { data: userReceived, isLoading: isLoadingDonatedTransactions } =
    useContractRead(contract, "getTotalReceivedByAddress", [address]);
  return (
    <div className="flex flex-col items-start justify-center gap-2 mt-8 text-xs">
      Received
      <h1 className="text-2xl font-bold">
        {userReceived
          ? parseInt(userReceived.toString()).toFixed(2)
          : isLoadingDonatedTransactions}
        {" 0"}$
      </h1>
    </div>
  );
}
