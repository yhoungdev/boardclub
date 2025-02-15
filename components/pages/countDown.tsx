"use client";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";

const CountDown = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 14,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 14);

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
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
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
    </div>
  );
};

export default CountDown;
