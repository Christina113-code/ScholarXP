// Supabase OAuth + magic-link callback handler (client-side).

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";

function getHashParams(): URLSearchParams {
  // Supabase often returns tokens in the URL hash (e.g. #access_token=...).
  const rawHash = window.location.hash;
  if (!rawHash.startsWith("#")) return new URLSearchParams(rawHash);
  return new URLSearchParams(rawHash.slice(1));
}

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const run = async () => {
      try {
        const url = new URL(window.location.href);
        const oauthCode = url.searchParams.get("code");
        const error = url.searchParams.get("error");

        if (error) {
          router.replace("/login");
          return;
        }

        const hashParams = getHashParams();
        const accessToken =
          url.searchParams.get("access_token") ?? hashParams.get("access_token");
        const refreshToken =
          url.searchParams.get("refresh_token") ?? hashParams.get("refresh_token");

        // OAuth (PKCE) callback.
        if (oauthCode) {
          await supabase.auth.exchangeCodeForSession(oauthCode);
        }

        // Magic link callback.
        if (accessToken && refreshToken) {
          await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
        }

        // Now verify we have a user and continue.
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.replace("/login");
          return;
        }

        router.replace("/dashboard");
      } catch {
        router.replace("/login");
      }
    };

    run();
  }, [router]);

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center p-4">
      <div className="text-[#6B7280] text-[14px]">Signing you in…</div>
    </div>
  );
}

