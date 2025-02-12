"use client";
import { ReactNode } from "react";
import PrivyAuthProvider from "@/providers/privyProvider";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { ISPRODUCTION } from "@/constant";
const IndexApplicationProvider = ({ children }: { children: ReactNode }) => {
  const manfiestUrl = ISPRODUCTION
    ? "https://boardclub.vercel.app"
    : "https://localhost:3000";
  return (
    <PrivyAuthProvider>
      <TonConnectUIProvider manifestUrl={`${manfiestUrl}/manifest.json`}>
        {children}
      </TonConnectUIProvider>
    </PrivyAuthProvider>
  );
};

export default IndexApplicationProvider;
