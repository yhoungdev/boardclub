"use client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {

  useTonConnectUI,
  useTonWallet,
} from "@tonconnect/ui-react";

import { supabase } from "@/config/supabase";
import { useRouter } from "next/navigation";
import Onboarding from "../onboarding";
import { initData, useSignal } from "@telegram-apps/sdk-react";
import { toast } from "sonner";
import { RECEIPIANTADDRESS } from "@/constant";
import { sendPayment } from "@/lib/payment";
import { createUser } from "@/services/user";

export function AuthPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [tonConnectUI] = useTonConnectUI();
  const wallet = useTonWallet();

  const initDataState = useSignal(initData.state);
  const user = initDataState?.user;

  const userWallet = wallet?.account?.address;
  const ownAddress = RECEIPIANTADDRESS;

  const startParam =
    typeof window !== "undefined"
      ? new URLSearchParams(window.Telegram?.WebApp?.initData || "").get(
          "start",
        )
      : null;

  const url = typeof window !== "undefined" ? window.location.origin : "";
  const refUrl = `${url}?ref=${user?.username || ""}`;

  const searchParams = new URLSearchParams(
    typeof window !== "undefined" ? window.location.search : "",
  );

  const referredBy = startParam || searchParams.get("ref");

  const [referralCode, setReferralCode] = useState("");

  const handleDeposit = async () => {
    if (!user) {
      toast.error("User not authenticated");
      return;
    }

    try {
      setIsLoading(true);

      const existingUser = await checkExistingUser(user.id.toString());
      if (existingUser) {
        localStorage.setItem(
          "tg_auth",
          JSON.stringify({
            userId: user.id,
            authenticated: true,
            timestamp: Date.now(),
          }),
        );
        toast.success(`Welcome back, ${existingUser.username || 'User'}!`);
        window.location.reload();
        return;
      }

      try {
        await createUser({
          telegramId: user.id.toString(),
          username: user.username || "anonymous",
          photoUrl: user.photoUrl || "",
          walletAddress: userWallet || "",
          publicKey: wallet?.account?.publicKey || "",
          referredBy: referralCode || referredBy,
        });
      } catch (createError: any) {
        console.error("User creation error details:", createError);
        toast.error(createError.message || "Failed to create user");
        throw createError;
      }

      localStorage.setItem(
        "tg_auth",
        JSON.stringify({
          userId: user.id,
          authenticated: true,
          timestamp: Date.now(),
        }),
      );

      toast.success("Registration successful!");
      window.location.reload();
    } catch (error) {
      console.error("❌ Registration failed:", error);
      toast.error("Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const checkExistingUser = async (telegramId: string) => {
    const { data } = await supabase
      .from("users")
      .select("*")
      .eq("telegram_id", telegramId)
      .single();
    return data;
  };

  if (!initDataState) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <span className="loader"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-md mx-auto p-4 pt-20">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            Welcome to Kryptronite
          </h1>
          <p className="text-gray-400">Join our community</p>
        </div>
        <Card className="bg-gray-900/50 border-0 p-6">
          <div className="space-y-6">
            <div className="space-y-4">
             
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Have a referral code?</p>
                <input
                  type="text"
                  placeholder="Enter referral code"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <Button
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white h-14"
                onClick={handleDeposit}
                disabled={isLoading}
              >
                {isLoading ? "Please wait..." : "Continue"}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

const HomePage = () => {
  const [showAuth, setShowAuth] = useState(false);

  return (
    <div className="min-h-screen bg-black">
      {!showAuth ? (
        <div className="mt-[5em]">
          <Onboarding />
          <center>
            <Button
              className="w-[80%] bg-gradient-to-r from-purple-400 to-pink-600 hover:from-purple-500 hover:to-pink-700 text-white h-14 transition-all duration-200 transform hover:scale-[1.02]"
              onClick={() => setShowAuth(true)}
            >
              Get Started
            </Button>
          </center>
        </div>
      ) : (
        <AuthPage />
      )}
    </div>
  );
};

export default HomePage;
