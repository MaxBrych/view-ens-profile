import React from "react";
import Account from "@/components/Auth/Account";
import { useAddress } from "@thirdweb-dev/react";
import Navbar from "@/components/NavBar";

export default function AccountPage() {
  const address = useAddress();
  return (
    <div>
      <Navbar />
      {address && <Account walletAddress={address} />}
    </div>
  );
}
