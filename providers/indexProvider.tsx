//@ts-nocheck
"use client";
import { ReactNode, useEffect } from "react";
import { TonConnectUIProvider, useTonWallet } from "@tonconnect/ui-react";
import { ISPRODUCTION } from "@/constant";
import dynamic from "next/dynamic";

const AuthCheck = dynamic(() => import("./AuthCheck"), { ssr: false });

const NetworkChecker = () => {
  const wallet = useTonWallet();

  useEffect(() => {
    console.log("Configured Network:", "Mainnet ✅");

    if (wallet) {
      const isMainnet = wallet.account.chain === "-239";
      console.log("Wallet Network:", isMainnet ? "Mainnet ✅" : "Testnet ❌");
      console.log("Wallet Address:", wallet.account.address);
      console.log("Balance:", wallet.account.balance);
    }
  }, [wallet]);

  return null;
};

const IndexApplicationProvider = ({ children }: { children: ReactNode }) => {
  const manifestUrl = ISPRODUCTION
    ? "https://boardclub.vercel.app/manifest.json"
    : "http://127.0.0.1:3000/manifest.json";

  return (
    <TonConnectUIProvider manifestUrl={manifestUrl} 
    // networkName="mainnet"
    
    >
      <NetworkChecker />
      <AuthCheck>{children}</AuthCheck>
    </TonConnectUIProvider>
  );
};

export default IndexApplicationProvider;
