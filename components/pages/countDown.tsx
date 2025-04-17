"use client";
import { useState, useEffect } from "react";
import Benefits from "./Benefits";
import { Card } from "@/components/ui/card";
import { supabase } from "@/config/supabase";
import { initData, useSignal } from "@telegram-apps/sdk-react";

const CountDown = () => {
  const [hasPaid, setHasPaid] = useState(false);
  const initDataState = useSignal(initData.state);
  const user = initDataState?.user;
  const targetDate = new Date(Date.now() + 21 * 24 * 60 * 60 * 1000);
  const [timeLeft, setTimeLeft] = useState(() => {
    const now = new Date();
    const difference = targetDate.getTime() - now.getTime();
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  });

  useEffect(() => {
    const checkPaymentStatus = async () => {
      if (!user) return;

      const { data } = await supabase
        .from("users")
        .select("has_paid")
        .eq("telegram_id", user.id.toString())
        .single();

      if (data) {
        setHasPaid(data.has_paid);
      }
    };

    checkPaymentStatus();
  }, [user]);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!initDataState) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <span className="loader"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center ">
      {hasPaid ? (
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            Launch Coming Soon
          </h1>
          <div className="grid grid-cols-4 gap-4">
            <Card className="bg-gray-900/50 border-0 p-4">
              <div className="text-4xl font-bold text-purple-400">
                {String(timeLeft.days).padStart(2, "0")}
              </div>
              <div className="text-sm text-gray-400">Days</div>
            </Card>
            <Card className="bg-gray-900/50 border-0 p-4">
              <div className="text-4xl font-bold text-purple-400">
                {String(timeLeft.hours).padStart(2, "0")}
              </div>
              <div className="text-sm text-gray-400">Hours</div>
            </Card>
            <Card className="bg-gray-900/50 border-0 p-4">
              <div className="text-4xl font-bold text-purple-400">
                {String(timeLeft.minutes).padStart(2, "0")}
              </div>
              <div className="text-sm text-gray-400">Minutes</div>
            </Card>
            <Card className="bg-gray-900/50 border-0 p-4">
              <div className="text-4xl font-bold text-purple-400">
                {String(timeLeft.seconds).padStart(2, "0")}
              </div>
              <div className="text-sm text-gray-400">Seconds</div>
            </Card>
          </div>
        </div>
      ) : (
        <Benefits />
      )}
    </div>
  );
};

export default CountDown;
