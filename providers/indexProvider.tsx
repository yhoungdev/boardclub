//@ts-nocheck
"use client";
import { ReactNode, useEffect } from "react";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { ISPRODUCTION } from "@/constant";
import dynamic from "next/dynamic";

const AuthCheck = dynamic(() => import("./AuthCheck"), { ssr: false });

const IndexApplicationProvider = ({ children }: { children: ReactNode }) => {
  const manfiestUrl = ISPRODUCTION
    ? "https://boardclub.vercel.app"
    : "http://172.20.10.3:3000";

  return (
    <TonConnectUIProvider manifestUrl={`${manfiestUrl}/manifest.json`}>
      <AuthCheck>{children}</AuthCheck>
    </TonConnectUIProvider>
  );
};

export default IndexApplicationProvider;
