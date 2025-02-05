"use client";

import { PrivyProvider } from "@privy-io/react-auth";

export default function PrivyAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PrivyProvider
      appId="cm5yglqav02gs11gihxlp3i60"
      config={{
        appearance: {
          theme: "light",
          accentColor: "#676FFF",
          logo: "",
        },
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
