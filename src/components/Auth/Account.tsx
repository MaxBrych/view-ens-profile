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
  const [username, setUsername] = useState(null);
  const [website, setWebsite] = useState(null);
  const [avatar_url, setAvatarUrl] = useState(null);
  const address = useAddress();

  useEffect(() => {
    getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);

      let { data, error, status } = await supabase
        .from("profiles")
        .select(`username, website, avatar_url`)
        .eq("wallet_address", walletAddress) // Changed from user.id to walletAddress
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setWebsite(data.website);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      alert("Error loading user data!");
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile({ username, website, avatar_url }: any) {
    try {
      setLoading(true);

      const updates = {
        username,
        website,
        avatar_url,
        updated_at: new Date().toISOString(),
        // Removed the id field here, and no need to update wallet_address since it's the primary key
      };

      let { error } = await supabase
        .from("profiles")
        .upsert({ wallet_address: walletAddress, ...updates }); // Use wallet_address in upsert
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
        uid={formatAddress(walletAddress)} // Use walletAddress instead of user.id
        url={avatar_url}
        size={150}
        onUpload={(url: any) => {
          setAvatarUrl(url);
          updateProfile({ username, website, avatar_url: url });
        }}
      />

      <div className="flex flex-col my-2">
        <h5 className="text-sm">{address}</h5>
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
          onClick={() => updateProfile({ username, website, avatar_url })}
          disabled={loading}
        >
          {loading ? "Loading ..." : "Update"}
        </button>
      </div>

      <div>
        <button
          className="block h-10 px-6 mt-2 text-center bg-gray-300 rounded-md cursor-pointer"
          onClick={() => supabase.auth.signOut()}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
