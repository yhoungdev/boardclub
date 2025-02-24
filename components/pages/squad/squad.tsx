//@ts-nocheck
//@ts-expect-error
"use client";
import { Copy, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import { supabase } from "@/config/supabase";
import { useRouter } from "next/navigation";
import { initData, useSignal } from "@telegram-apps/sdk-react";

interface Referral {
  id: number;
  name: string;
  joinedDate: string;
  avatar: string;
}

interface UserData {
  id: string;
  telegram_username: string;
  telegram_photo: string;
  wallet_address: string;
  joined_at: string;
  has_paid: boolean;
  referal_url: string;
  publicKey: string;
}

export default function SquadPage() {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const initDataState = useSignal(initData.state);
  const user = initDataState?.user;

  useEffect(() => {
    const checkAuth = async () => {
      const auth = localStorage.getItem("tg_auth");
      if (!auth || !user) {
        router.push("/");
        return;
      }

      try {
        const { userId, authenticated } = JSON.parse(auth);
        if (!authenticated || userId !== user.id) {
          router.push("/");
          return;
        }

        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("telegram_id", userId)
          .single();

        if (error) throw error;
        if (data) setUserData(data);
      } catch (error) {
        console.error("Auth check failed:", error);
        router.push("/");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [user, router]);

  const url = typeof window !== "undefined" ? window.location.origin : "";
  const referralUrl = userData
    ? `${url}?ref=${userData.telegram_username}`
    : "";

  useEffect(() => {
    const fetchReferrals = async () => {
      if (!userData?.telegram_username) return;

      const { data, error } = await supabase
        .from("users")
        .select(
          `
          id,
          telegram_username as name,
          telegram_photo as avatar,
          joined_at as joinedDate
        `,
        )
        .eq("referred_by", userData.telegram_username);

      if (error) {
        console.error("Error fetching referrals:", error);
      } else {
        setReferrals(data || []);
      }
    };

    if (userData) {
      fetchReferrals();
    }
  }, [userData]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <span className="loader"></span>
      </div>
    );
  }

  return <div className="min-h-screen container bg-black text-white p-4"></div>;
}
