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

export function AuthPage() {
  const router = useRouter();
  const [isConnected, setIsConnected] = useState(false);
  const [isDepositing, setIsDepositing] = useState(false);
  const [hasPaid, setHasPaid] = useState(false);
  const [tonConnectUI] = useTonConnectUI();
  const wallet = useTonWallet();

  const initDataState = useSignal(initData.state);
  const user = initDataState?.user;

  const userWallet = wallet?.account?.address;
  const ownAddress = "0QBUagAZij47vy7i-p271eqVLaunwFpMn2tuGAU_XMoWMB-7";

  useEffect(() => {
    const checkPaymentStatus = async () => {
      if (user?.id) {
        try {
          const { data: userData, error } = await supabase
            .from("users")
            .select("has_paid")
            .eq("telegram_id", user.id)
            .single();

          if (error) throw error;

          if (userData?.has_paid) {
            setHasPaid(true);
            // Set auth token in localStorage
            localStorage.setItem(
              "tg_auth",
              JSON.stringify({
                userId: user.id,
                authenticated: true,
                timestamp: Date.now(),
              }),
            );
            router.push("/profile");
          }
        } catch (error) {
          console.error("Error checking payment status:", error);
        }
      }
    };

    checkPaymentStatus();
  }, [user?.id, router]);

  const url = typeof window !== "undefined" ? window.location.origin : "";
  const refUrl = `${url}/${user?.username}`;

  const searchParams = new URLSearchParams(
    typeof window !== "undefined" ? window.location.search : "",
  );
  const referredBy = searchParams.get("ref");

  const saveUserToSupabase = async () => {
    if (!user) return;

    try {
      const { data: existingUser, error: fetchError } = await supabase
        .from("users")
        .select()
        .eq("telegram_id", user.id)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        throw fetchError;
      }

      if (existingUser) {
        localStorage.setItem(
          "tg_auth",
          JSON.stringify({
            userId: user.id,
            authenticated: true,
            timestamp: Date.now(),
          }),
        );
        router.push("/profile");
        return;
      }

      const { error } = await supabase.from("users").insert([
        {
          telegram_id: user.id,
          telegram_username: user.username,
          telegram_photo: user.photoUrl,
          first_name: user.firstName,
          last_name: user.lastName,
          wallet_address: userWallet,
          joined_at: new Date().toISOString(),
          has_paid: false,
          referred_by: referredBy,
          referal_url: refUrl,
        },
      ]);

      if (error) throw error;
      setIsConnected(true);
    } catch (error) {
      console.error("Error saving user:", error);
    }
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

      await supabase
        .from("users")
        .update({ has_paid: true })
        .eq("telegram_id", user.id);

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

  if (hasPaid) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Redirecting...</p>
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
            {!isConnected ? (
              <div className="space-y-4">
                <Button
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white h-14"
                  onClick={saveUserToSupabase}
                >
                  Continue
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-center">
                  <span className="text-2xl font-bold text-white">$1</span>
                  <p className="text-sm text-gray-400 mt-2">
                    One-time entry fee
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
            )}
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
