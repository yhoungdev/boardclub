//@ts-nocheck
"use client";
import { ReactNode, useEffect } from "react";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { ISPRODUCTION } from "@/constant";
import dynamic from "next/dynamic";

const AuthCheck = dynamic(() => import("./AuthCheck"), { ssr: false });

const IndexApplicationProvider = ({ children }: { children: ReactNode }) => {
  const manifestUrl = ISPRODUCTION
    ? "https://boardclub.vercel.app/manifest.json"
    : "http://127.0.0.1:3000/manifest.json";

  return (
    <TonConnectUIProvider 
      manifestUrl={manifestUrl}
      networkName="mainnet"
    >
      <AuthCheck>{children}</AuthCheck>
    </TonConnectUIProvider>
  );
};

export default IndexApplicationProvider;
