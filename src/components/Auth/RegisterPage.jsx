import { Auth, ThemeSupa } from "@supabase/auth-ui-react";
import Account from "./Account";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";

export default function RegisterPage() {
  const session = useSession();
  const supabase = useSupabaseClient();
  return (
    <div className="min-h-screen md:flex">
      <div className="w-full px-12 ">
        <h1 className="text-4xl text-black">Flippr Account</h1>
        {!session ? (
          <Auth supabaseClient={supabase} />
        ) : (
          <Account session={session} />
        )}
      </div>
      <div className="flex-col items-center justify-center invisible w-full h-auto align-middle md:visible bg-slate-200">
        <h1 className="text-xl ">Let other users find you more easily</h1>
      </div>
    </div>
  );
}
