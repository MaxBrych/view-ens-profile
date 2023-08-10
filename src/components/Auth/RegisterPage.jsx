import { Auth } from "@supabase/auth-ui-react";
import Account from "./Account";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";

export default function RegisterPage() {
  const session = useSession();
  const supabase = useSupabaseClient();
  return (
    <div className="min-h-screen p-4 bg-[#F3f3f3]">
      <div className="w-full bg-[#FFF] border p-4 border-[#DDD] rounded-xl ">
        <h1 className="text-2xl font-bold text-black">Flippr Account</h1>
        {!session ? (
          <Auth supabaseClient={supabase} providers={[]} />
        ) : (
          <Account session={session} />
        )}
      </div>
    </div>
  );
}
