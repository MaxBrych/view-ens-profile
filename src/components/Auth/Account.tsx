import { useState } from "react";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import Avatar from "./Avatar";
import Link from "next/link";
import { FiChevronLeft } from "react-icons/fi";
import { useAddress } from "@thirdweb-dev/react";
import { useUserAvatarAndENS } from "@/hooks/useUserAvatarAndENS";

export default function Account({ session, walletAddress }: any) {
  const supabase = useSupabaseClient();
  const user = useUser();
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<string | null>(null);
  const [website, setWebsite] = useState(null);

  const { ensName, avatarUrl, isLoading } = useUserAvatarAndENS(walletAddress); // Use the custom hook

  async function updateProfile({ username, avatar_url }: any) {
    try {
      setLoading(true);

      const updates = {
        username,
        avatar_url,
      };

      let { error } = await supabase
        .from("wallet_profiles")
        .upsert({ wallet_address: walletAddress, ...updates });
      if (error) throw error;
      alert("Profile updated!");
    } catch (error) {
      alert("Error updating the data!");
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  function formatAddress(address: string): string {
    return address.slice(0, 6) + "..." + address.slice(-4);
  }

  return (
    <div className="pt-4">
      <Link
        href="/"
        className="flex items-center justify-start gap-2 font-semibold text-md "
      >
        <FiChevronLeft className="w-8 h-8 p-1 bg-gray-300 rounded-full" />
        Back
      </Link>
      <Avatar
        walletAddress={formatAddress(walletAddress)} // Use walletAddress instead of uid
        url={avatarUrl}
        size={150}
        onUpload={(url: any) => {
          updateProfile({ username, website, avatar_url: url });
        }}
      />

      <div className="flex flex-col my-2">
        <h5 className="text-sm">{ensName || formatAddress(walletAddress)}</h5>
        <label htmlFor="username">Username</label>
        <input
          className="bg-[#f3f3f3] p-2 rounded-md border border-[#DDD]"
          id="username"
          type="text"
          value={username || ""}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <div className="flex w-full gap-4">
        <button
          className="block h-10 px-6 mt-2 font-semibold text-center rounded-md cursor-pointer bg-primary-500"
          onClick={() =>
            updateProfile({ username, website, avatar_url: avatarUrl })
          }
          disabled={isLoading || loading}
        >
          {isLoading || loading ? "Loading ..." : "Update"}
        </button>
      </div>
    </div>
  );
}
