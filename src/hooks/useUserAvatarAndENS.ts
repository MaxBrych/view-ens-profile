import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

export function useUserAvatarAndENS(walletAddress: string | null) {
  const supabase = useSupabaseClient();
  const [ensName, setEnsName] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const provider = new ethers.providers.JsonRpcProvider(
      process.env.NEXT_PUBLIC_PROVIDER_URL
    );

    const fetchAvatarAndName = async () => {
      setLoading(true);
      if (walletAddress) {
        let ensNameLookup = await provider.lookupAddress(walletAddress);
        let resolver = ensNameLookup
          ? await provider.getResolver(ensNameLookup)
          : null;
        let avatar = null;

        if (resolver) {
          setEnsName(ensNameLookup);
          // Fetch ENS avatar
          avatar = await resolver.getText("avatar");
        }

        if (!avatar) {
          // If no ENS avatar, fetch from the database
          const { data } = await supabase
            .from("wallet_profiles")
            .select("avatar_url")
            .eq("wallet_address", walletAddress)
            .single();

          avatar = data?.avatar_url;
          setAvatarUrl(avatar);
        }

        setLoading(false);
      }
    };

    fetchAvatarAndName();
  }, [walletAddress, supabase]);

  return { ensName, avatarUrl, isLoading };
}
