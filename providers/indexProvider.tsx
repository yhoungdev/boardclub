"use client";
import { ReactNode, useEffect } from "react";
import PrivyAuthProvider from "@/providers/privyProvider";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { ISPRODUCTION } from "@/constant";
import { usePrivy } from "@privy-io/react-auth";
import { usePathname, useRouter } from "next/navigation";
import { init, initData, type User, useSignal } from "@telegram-apps/sdk-react";

const AuthCheck = ({ children }: { children: ReactNode }) => {
  const { ready: privyReady, authenticated: privyAuthenticated } = usePrivy();
  const router = useRouter();
  const pathname = usePathname();
  const user = useSignal(initData.user);

  useEffect(() => {
    if (user) {
      const userData = {
        username: user.username,
        firstName: user.first_name,
        lastName: user.last_name,
        id: user.id,
        photoUrl: user.photo_url,
      };
      console.log("Telegram User Details:", userData);
    }
  }, [user]);

  return <>{children}</>;
};

const IndexApplicationProvider = ({ children }: { children: ReactNode }) => {
  const manfiestUrl = ISPRODUCTION
    ? "https://boardclub.vercel.app"
    : "https://localhost:3000";

  useEffect(() => {
    init({
      debug: true,
      cssVars: true,
      async: true,
    });

    const user = initData.user;
    if (user) {
      console.log("Current User:", {
        username: user.username,
        firstName: user.first_name,
        lastName: user.last_name,
        id: user.id,
        photoUrl: user.photo_url,
      });
    }
  }, []);

  return (
    <PrivyAuthProvider>
      <TonConnectUIProvider manifestUrl={`${manfiestUrl}/manifest.json`}>
        <AuthCheck>{children}</AuthCheck>
      </TonConnectUIProvider>
    </PrivyAuthProvider>
  );
};

export default IndexApplicationProvider;
