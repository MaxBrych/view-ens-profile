import { useAddress } from "@thirdweb-dev/react";
import { Auth } from "@supabase/auth-ui-react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import Account from "./Account";

export default function RegisterPage() {
  const session = useSession();
  const supabase = useSupabaseClient();
  const walletAddress = useAddress(); // Fetch the wallet address

  return (
    <div className="min-h-screen p-4 bg-[#F3f3f3] flex flex-col justify-center items-center">
      <div className="w-full max-w-3xl bg-[#FFF] border p-4 border-gray-300 rounded-2xl ">
        <h1 className="text-2xl font-bold text-black">Flippr Account</h1>
        {!session ? (
          <Auth supabaseClient={supabase} providers={[]} />
        ) : (
          <Account session={session} walletAddress={walletAddress} /> // Pass the wallet address
        )}
      </div>
    </div>
  );
}
