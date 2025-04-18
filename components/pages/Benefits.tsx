"use client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coins, Users, LineChart, Briefcase, DollarSign } from "lucide-react";
import { useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { RECEIPIANTADDRESS } from "@/constant";
import { sendPayment } from "@/lib/payment";
import { TonConnectButton } from "@tonconnect/ui-react";
import { supabase } from "@/config/supabase";
import { usePaymentStatus } from "@/hooks/usePaymentStatus";
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const Benefits = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [tonConnectUI] = useTonConnectUI();
  const wallet = useTonWallet();
  const hasPaid = usePaymentStatus();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 20);

    const timer = setInterval(() => {
      const now = new Date();
      const difference = endDate.getTime() - now.getTime();

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

      setTimeLeft(`${days}d ${hours}h`);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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

      window.location.reload();
      toast.success("Payment successful!");
    } catch (error) {
      console.error("❌ Payment failed:", error);
      toast.error("Payment failed");
    } finally {
      setIsProcessing(false);
    }
  };

  if (hasPaid) {
    return (
      <div className="min-h-screen mt-[4em] bg-black text-white p-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent mb-4">
            Welcome to Kryptronite
          </h1>
          <p className="text-gray-400 mb-2">
            You have successfully joined our community!
          </p>
          <p className="text-purple-400 font-semibold mb-6">
            {timeLeft} remaining
          </p>
          <div className="flex flex-col items-center gap-2">
            <a 
              href="https://t.me/Kryptronite_chat" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20 text-purple-400 hover:text-purple-300 transition-all duration-300 border border-purple-500/20 hover:border-purple-500/30"
            >
              Join our Telegram 
            </a>
            <span className="text-gray-400 text-sm">chat for more enquiries</span>
          </div>
        </div>
      </div>
    );
  }

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

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(timer);
  }, [currentSlide]);

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev === benefits.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsAnimating(false), 500);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev === 0 ? benefits.length - 1 : prev - 1));
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent mb-4">
            Early Access Benefits
          </h1>
          <p className="text-gray-400">Join with just 1 TON</p>
        </div>

        <Card className="bg-gray-900/50 border-gray-800/50 p-6 relative overflow-hidden mb-12">
          <div className="relative min-h-[250px]">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className={cn(
                  "absolute top-0 left-0 w-full transition-all duration-500 ease-in-out",
                  {
                    "translate-x-0 opacity-100": index === currentSlide,
                    "translate-x-full opacity-0": index > currentSlide,
                    "-translate-x-full opacity-0": index < currentSlide,
                  },
                )}
              >
                
                <div className="text-center space-y-4">
                  <div className="p-3 rounded-full bg-purple-500/10 inline-block">
                    {React.cloneElement(benefit.icon, {
                      className: "w-12 h-12 text-purple-400",
                    })}
                  </div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed max-w-lg mx-auto">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
            
          <div className="mt-2 text-center">
          
            <a 
              href="https://t.me/Kryptronite_chat" 
              target="_blank" 
              
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20 text-purple-400 hover:text-purple-300 transition-all duration-300 border border-purple-500/20 hover:border-purple-500/30"
            >
         
              Join our community
            </a>
          </div>
       
          <div className="flex justify-between items-center mt-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={prevSlide}
              className="text-gray-400 hover:text-white transition-colors"
              disabled={isAnimating}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <div className="flex gap-2">
              {benefits.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={cn(
                    "h-2 w-2 rounded-full transition-all duration-300",
                    currentSlide === index
                      ? "bg-purple-400 w-4"
                      : "bg-gray-600 hover:bg-gray-500",
                  )}
                />
              ))}
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={nextSlide}
              className="text-gray-400 hover:text-white transition-colors"
              disabled={isAnimating}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        </Card>

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
