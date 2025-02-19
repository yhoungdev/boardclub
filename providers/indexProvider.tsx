"use client";
import { ReactNode, useEffect } from "react";
import PrivyAuthProvider from "@/providers/privyProvider";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { ISPRODUCTION } from "@/constant";
import { usePrivy } from "@privy-io/react-auth";
import { usePathname, useRouter } from "next/navigation";
import { TelegramAuthProvider } from "./TelegramAuthProvider";

const AuthCheck = ({ children }: { children: ReactNode }) => {
  const { ready: privyReady, authenticated: privyAuthenticated } = usePrivy();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (privyReady && !privyAuthenticated && pathname !== '/') {
      router.push('/');
    }
  }, [privyReady, privyAuthenticated, pathname, router]);

  return <>{children}</>;
};

const IndexApplicationProvider = ({ children }: { children: ReactNode }) => {
  const manfiestUrl = ISPRODUCTION
    ? "https://boardclub.vercel.app"
    : "https://localhost:3000";

  return (
    <PrivyAuthProvider>
      <TonConnectUIProvider manifestUrl={`${manfiestUrl}/manifest.json`}>
        <AuthCheck>
          <TelegramAuthProvider>
            {children}
          </TelegramAuthProvider>
        </AuthCheck>
      </TonConnectUIProvider>
    </PrivyAuthProvider>
  );
};

export default IndexApplicationProvider;
