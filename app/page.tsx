"use client";
import HomePage from "@/components/pages/homepage";
import HomeIndex from "@/components/pages/tabPage";
import { usePrivy } from "@privy-io/react-auth";

export default function Home() {
  const { authenticated, ready } = usePrivy();

  if (!ready) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return ! authenticated ? <HomeIndex /> : <HomePage />;
}
