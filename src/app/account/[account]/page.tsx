"use client";
import React from "react";
import Account from "@/components/Auth/Account";
import { useAddress } from "@thirdweb-dev/react";
import { Box, Grid } from "@chakra-ui/react";
import UserReceived from "@/components/Getter/UserReceived";
import UserDonated from "@/components/Getter/UserDonated";
import GiftLink from "@/components/PeanutLink/GiftLink";
const bg = "gray.50";
const color = "gray.700";

export default function AccountPage() {
  const address = useAddress();
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen p-4">
      <div className="flex flex-col items-center justify-center w-full min-h-screen grid-cols-4 gap-2 p-4 md:grid max-w-7xl bg-gray-50">
        <div className="flex flex-col items-start justify-start w-full h-full col-span-1 p-2 bg-white border border-gray-200 md:p-4 rounded-xl">
          {address && <Account walletAddress={address} />}
        </div>
        {/* <GiftLink />*/}
        <div className="flex flex-col items-start w-full h-full grid-cols-3 col-span-3 p-2 bg-white border border-gray-200 md:grid md:p-4 rounded-xl">
          <UserReceived address={address} />
          <UserDonated />
        </div>
      </div>
    </div>
  );
}
