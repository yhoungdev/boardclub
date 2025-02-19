"use client";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    title: "Exclusive Access to Crypto Funding & Opportunities",
    description:
      "Gain early access to pre-sale token launches, verified airdrops, and high-potential blockchain projects. Krytronite members get priority access to funding pools, launchpads, and investment opportunities before they go public.",
    icon: "🚀",
  },
  {
    title: "Community-Powered Token Growth & Market Influence",
    description:
      "Join a network of investors and traders who collaborate to strategically boost promising tokens, engage in liquidity pools, and maximize investment gains. Our community works together to create market influence and capitalize on emerging trends.",
    icon: "👥",
  },
  {
    title: "Verified Airdrops & Secure Investment Environment",
    description:
      "Avoid scams and rug pulls with Krytronite's community-verified airdrop alerts and project vetting system. We ensure a safe and secure environment for investments, helping members minimize risk and maximize returns.",
    icon: "🛡️",
  },
  {
    title: "Premium Insights, Education & Networking",
    description:
      "Access expert trading signals, insider tips, and market trend analysis to stay ahead of the game.",
    icon: "📈",
  },
];

export default function Onboarding() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(timer);
  }, [currentSlide]);

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev === features.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsAnimating(false), 500);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev === 0 ? features.length - 1 : prev - 1));
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <Card className="bg-gray-black border-0 p-6 relative overflow-hidden">
      <div className="relative min-h-[300px]">
        {features.map((feature, index) => (
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
              <div className="text-5xl mb-4 animate-bounce">{feature.icon}</div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                {feature.title}
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
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
          {features.map((_, index) => (
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
  );
}
