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
  const ownAddress = "0QBUagAZij47vy7i-p271eqVLaunwFpMn2tuGAU_XMoWMB-7";

  const url = typeof window !== "undefined" ? window.location.origin : "";
  
  const refUrl = `${url}?ref=${user?.username}`;

  const checkExistingUser = async (telegramId: string) => {
    const { data } = await supabase
      .from("users")
      .select("*")
      .eq("telegram_id", telegramId)
      .single();
    return data;
  };

  const handleDeposit = async () => {
    if (!user) {
      console.error("❌ User not authenticated");
      return;
    }

    if (!tonConnectUI || !wallet || !wallet.account) {
      console.error("❌ Wallet not connected or invalid");
      return;
    }

    try {
      setIsDepositing(true);

      const existingUser = await checkExistingUser(user.id.toString());
      if (existingUser) {
        toast.error("User already registered");
        return;
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
          },
        ],
      });

 
      const { error: userError } = await supabase.from("users").insert([
        {
          id: crypto.randomUUID(),
          telegram_id: user.id.toString(),
          telegram_username: user.username || "",
          telegram_photo: user.photoUrl || "",
          wallet_address: userWallet || "",
          joined_at: new Date().toISOString(),
          has_paid: true,
          referal_url: refUrl,
          referred_by: referredBy || null,
          created_at: new Date().toISOString(),
          publicKey: wallet?.account?.publicKey || null,
          referal_count: 0, // Initialize referral count
        },
      ]);

      if (userError) throw userError;

     
      if (referredBy) {
        const { error: updateError } = await supabase.rpc('increment_referral_count', {
          username: referredBy
        });
        
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

      router.push("/profile");
    } catch (error) {
      console.error("❌ Transaction failed:", error);
      toast.error("Transaction failed");
    } finally {
      setIsDepositing(false);
    }
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
            Welcome to Krytronite
          </h1>
          <p className="text-gray-400">Start your journey with just $1</p>
        </div>
        <Card className="bg-gray-900/50 border-0 p-6">
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="text-center">
                <span className="text-2xl font-bold text-white">$1</span>
                <p className="text-sm text-gray-400 mt-2">One-time entry fee</p>
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
