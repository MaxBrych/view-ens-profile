import React from "react";
import Account from "@/components/Auth/Account";
import { useAddress } from "@thirdweb-dev/react";

export default function AccountPage() {
  const address = useAddress();
  return (
    <div>
      <Account walletAddress={address} />
    </div>
  );
}
