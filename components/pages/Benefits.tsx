"use client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coins, Users, LineChart, Briefcase, DollarSign } from "lucide-react";
import { useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";
import { useState } from "react";
import { toast } from "sonner";
import { RECEIPIANTADDRESS } from "@/constant";
import { sendPayment } from "@/lib/payment";
import { TonConnectButton } from "@tonconnect/ui-react";
import { supabase } from "@/config/supabase";
const Benefits = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [tonConnectUI] = useTonConnectUI();
  const wallet = useTonWallet();

  const handlePayment = async () => {
    if (!tonConnectUI || !wallet || !wallet.account) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (
      process.env.NODE_ENV === "production" &&
      wallet.account.chain !== "-239"
    ) {
      toast.error("Please switch to TON mainnet");
      return;
    }

    try {
      setIsProcessing(true);
      await sendPayment(tonConnectUI, RECEIPIANTADDRESS);

      const { error: updateError } = await supabase
        .from("users")
        .update({ has_paid: true })
        .eq("wallet_address", wallet.account.address);

      if (updateError) {
        console.error("Failed to update payment status:", updateError);
        toast.error("Payment recorded but failed to update status");
        return;
      }

      toast.success("Payment successful!");
    } catch (error) {
      console.error("❌ Payment failed:", error);
      toast.error("Payment failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const benefits = [
    {
      icon: <Coins className="w-6 h-6 text-purple-400" />,
      title: "Free $10,000 Trading Account",
      description: "Access to trading accounts with 70/30 profit sharing",
    },
    {
      icon: <Users className="w-6 h-6 text-purple-400" />,
      title: "Global Trading Community",
      description: "Connect with traders worldwide",
    },
    {
      icon: <LineChart className="w-6 h-6 text-purple-400" />,
      title: "Premium Signal Marketplace",
      description: "3 months access + Pay-Per-Profit signals afterwards",
    },
    {
      icon: <Briefcase className="w-6 h-6 text-purple-400" />,
      title: "Web3 Job Access",
      description: "Get paired with jobs (15% commission for 6 months)",
    },
    {
      icon: <DollarSign className="w-6 h-6 text-purple-400" />,
      title: "Signal Selling Platform",
      description: "Sell signals from $0.1 to $10 per profitable signal",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent mb-4">
            Early Access Benefits
          </h1>
          <p className="text-gray-400">Join with just 1 TON</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
          {benefits.map((benefit, index) => (
            <Card key={index} className="bg-gray-900/50 border-0 p-6">
              <div className="flex items-center gap-4 mb-4">
                {benefit.icon}
                <h3 className="font-semibold text-white">{benefit.title}</h3>
              </div>
              <p className="text-gray-400 text-sm">{benefit.description}</p>
            </Card>
          ))}
        </div>

        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <TonConnectButton />
          </div>
          {wallet && (
            <Button
              className="w-full max-w-md bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white h-14"
              onClick={handlePayment}
              disabled={isProcessing}
            >
              {isProcessing
                ? "Processing Payment..."
                : "Join the Waiting Room (1 TON)"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Benefits;
