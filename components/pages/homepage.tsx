"use client";
import { useEffect } from "react";
import { Wallet, Coins, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  TonConnectButton,
  useTonConnectUI,
  useTonWallet,
} from "@tonconnect/ui-react";
import { Address, toNano } from "ton-core";
import { supabase } from "@/config/supabase";
import { useRouter } from "next/navigation";
import Onboarding from "../onboarding";
import { initData, useSignal } from "@telegram-apps/sdk-react";
import { toast } from "sonner";

export function AuthPage() {
  const router = useRouter();
  const [isDepositing, setIsDepositing] = useState(false);
  const [tonConnectUI] = useTonConnectUI();
  const wallet = useTonWallet();

  const initDataState = useSignal(initData.state);
  const user = initDataState?.user;

  const userWallet = wallet?.account?.address;
  const ownAddress = "UQBzFGVscxHZU3bHqWALFY5q3rvT64dmv0dn53mmB1AyFU2M";

  const url = typeof window !== "undefined" ? window.location.origin : "";
  const refUrl = `${url}?ref=${user?.username || ""}`;

  const searchParams = new URLSearchParams(
    typeof window !== "undefined" ? window.location.search : "",
  );
  const referredBy = searchParams.get("ref");

  const handleDeposit = async () => {
    if (!user) {
      toast.error("User not authenticated");
      return;
    }

    if (!tonConnectUI || !wallet || !wallet.account) {
      toast.error("Please connect your wallet first");
      return;
    }

   
    if (wallet.account.chain !== '-239') {
      toast.error("Please switch to TON mainnet");
      return;
    }

    try {
      setIsDepositing(true);

      const existingUser = await checkExistingUser(user.id.toString());
      if (existingUser) {
        // toast.error("User already registered");
        localStorage.setItem(
          "tg_auth",
          JSON.stringify({
            userId: user.id,
            authenticated: true,
            timestamp: Date.now(),
          }),
        );

        window.location.reload();

        //return;
      }

      const receiverAddress = Address.parse(ownAddress);

      await tonConnectUI.sendTransaction({
        validUntil: Math.floor(Date.now() / 1000) + 300,
        messages: [
          {
            address: receiverAddress.toString(),
            amount: toNano("1").toString(),
            stateInit: null,
            payload: "",
            bounce: false  ,
            
          },
        ],
      });

      const { error: userError } = await supabase.from("users").insert([
        {
          id: crypto.randomUUID(),
          telegram_id: user.id.toString(),
          telegram_username: user.username || "anonymous",
          telegram_photo: user.photoUrl || "",
          wallet_address: userWallet || "",
          joined_at: new Date().toISOString(),
          has_paid: true,
          referal_url: refUrl,
          referred_by: referredBy,
          created_at: new Date().toISOString(),
          publicKey: wallet.account.publicKey || "",
          referal_count: 0,
        },
      ]);

      if (userError) {
        toast.error("Failed to create user");
        throw userError;
      }

      if (referredBy) {
        const { error: updateError } = await supabase.rpc(
          "increment_referral_count",
          {
            username: referredBy,
          },
        );

        if (updateError) {
          console.error("Failed to update referrer count:", updateError);
        }
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
      //window.location.href = '/profile';

      // if (window.Telegram?.WebApp) {
      //   window.Telegram.WebApp.MainButton.hide();
      //   window.Telegram.WebApp.BackButton.hide();
      //   window.Telegram.WebApp.navigate('/profile');
      // } else {

      // }
    } catch (error) {
      console.error("❌ Transaction failed:", error);
      toast.error("Transaction failed");
    } finally {
      setIsDepositing(false);
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
          <p className="text-gray-400">Start your journey with just 1 TON</p>
        </div>
        <Card className="bg-gray-900/50 border-0 p-6">
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="text-center">
                <span className="text-2xl font-bold text-white">1 TON</span>
                <p className="text-sm text-gray-400 mt-2">One-time entry fee</p>
                <p className="text-sm text-gray-400 mt-2">
                  Refundable after launch.
                </p>
              </div>
              <div>
                <center>
                  <TonConnectButton />
                </center>
              </div>
              {wallet && (
                <Button
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white h-14"
                  onClick={handleDeposit}
                  disabled={isDepositing}
                >
                  {isDepositing ? "Processing Payment..." : "Pay Entry Fee"}
                </Button>
              )}
            </div>
          </div>
        </Card>

        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-2 text-gray-400">
            <Coins className="h-4 w-4" />
            <span className="text-sm">Secure Payment Gateway</span>
          </div>
        </div>
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
