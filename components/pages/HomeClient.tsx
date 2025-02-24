"use client";
import { useEffect, useState } from "react";
import { initData, useSignal } from "@telegram-apps/sdk-react";
import dynamic from "next/dynamic";

const HomePage = dynamic(() => import("@/components/pages/homepage"), {
  ssr: false,
});
const HomeIndex = dynamic(() => import("@/components/pages/tabPage"), {
  ssr: false,
});
const TelegramInit = dynamic(
  () => import("@/components/telegram/TelegramInit"),
  { ssr: false },
);

export default function HomeClient() {
  const [isLoading, setIsLoading] = useState(true);
  const initDataState = useSignal(initData.state);
  const user = initDataState?.user;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/eruda";
      script.onload = function () {
        window.eruda.init({
          tool: ["console", "elements", "network", "resources", "info"],
          useShadowDom: true,
          autoScale: true,
          defaults: {
            displaySize: 50,
            transparency: 0.9,
            theme: "Dark",
          },
        });
      };
      document.body.appendChild(script);
    }
  }, []);

  useEffect(() => {
    const checkAuth = () => {
      const auth = localStorage.getItem("tg_auth");
      if (!auth) {
        setIsLoading(false);
        return;
      }

      try {
        const { userId, authenticated, timestamp } = JSON.parse(auth);
        const isValid = Date.now() - timestamp < 24 * 60 * 60 * 1000;

        if (authenticated && isValid && userId === user?.id) {
          setIsLoading(false);
          return true;
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      }

      localStorage.removeItem("tg_auth");
      setIsLoading(false);
      return false;
    };

    if (user) {
      checkAuth();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <span className="loader"></span>
      </div>
    );
  }

  const isAuthenticated = () => {
    const auth = localStorage.getItem("tg_auth");
    if (!auth) return false;

    const { authenticated, timestamp } = JSON.parse(auth);
    return authenticated && Date.now() - timestamp < 24 * 60 * 60 * 1000;
  };

  return (
    !isAuthenticated  ? (
      <HomeIndex />
    ) : (
      <HomePage />
    )
  );
}
