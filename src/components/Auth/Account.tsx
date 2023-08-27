import { useState, useEffect } from "react";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import Avatar from "./Avatar";
import Link from "next/link";
import { FiChevronLeft } from "react-icons/fi";
import { useAddress } from "@thirdweb-dev/react";

export default function Account({ session, walletAddress }: any) {
  const supabase = useSupabaseClient();
  const user = useUser();
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);

  const [avatar_url, setAvatarUrl] = useState(null);
  const address = useAddress();

  useEffect(() => {
    getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);

      let { data, error, status } = await supabase
        .from("wallet_profiles")
        .select(`username, description, avatar_url`)
        .eq("wallet_address", walletAddress)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username || "");
        setAvatarUrl(data.avatar_url || "");
        setDescription(data.description || "");
      }
    } catch (error) {
      alert("Error loading user data!");
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile({ username, description, avatar_url }: any) {
    try {
      setLoading(true);

      const updates = {
        username,
        description,
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
  function formatAddress(address?: string): string {
    if (!address) return "N/A";
    return address.slice(0, 6) + "..." + address.slice(-4);
  }

  return (
    <div className="w-full pt-4 font-medium font-mona-sans">
      <Link
        href="/"
        className="flex items-center justify-start gap-2 font-semibold text-md "
      >
        <FiChevronLeft className="w-8 h-8 p-1 bg-gray-300 rounded-full" />
        Back
      </Link>
      <Avatar
        walletAddress={walletAddress}
        url={avatar_url}
        size={150}
        onUpload={(url: any) => {
          setAvatarUrl(url);
          updateProfile({ username, description, avatar_url: url });
        }}
      />

      <div className="flex flex-col gap-2 my-2">
        <h5 className="text-sm">{formatAddress(address)}</h5>
        <label htmlFor="username" className="mt-2 text-sm">
          Username
        </label>
        <input
          className="p-2 bg-gray-100 border border-gray-300 rounded-md"
          id="username"
          type="text"
          value={username || ""}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label htmlFor="description" className="mt-2 text-sm">
          Description
        </label>
        <input
          className="p-2 bg-gray-100 border border-gray-300 rounded-md"
          id="description"
          type="text"
          value={description || ""}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="flex w-full gap-4">
        <button
          className="block w-full h-10 px-6 mt-2 font-bold text-center rounded-full cursor-pointer text-bold bg-primary-500"
          onClick={() => updateProfile({ username, description, avatar_url })}
          disabled={loading}
        >
          {loading ? "Loading ..." : "Update"}
        </button>
      </div>
      <button
        className="block w-full h-10 px-6 mt-2 font-bold text-center bg-gray-300 rounded-full cursor-pointer"
        onClick={() => supabase.auth.signOut()}
      >
        Sign Out
      </button>
    </div>
  );
}
