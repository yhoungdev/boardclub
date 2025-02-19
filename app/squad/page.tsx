"use client";
import { Copy, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import { supabase } from "@/config/supabase";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";

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

export default function Profile() {
  const router = useRouter();
  const { user, authenticated, ready } = usePrivy();
  const [copied, setCopied] = useState(false);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [userData, setUserData] = useState<UserData | null>(null);

  // Fetch user data from Supabase
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id) return;

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching user data:", error);
        return;
      }

      if (data) {
        setUserData(data);
      }
    };

    if (authenticated && user) {
      fetchUserData();
    }
  }, [authenticated, user]);

  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/");
    }
  }, [ready, authenticated, router]);

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
        setReferrals(data);
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

  if (!ready || !authenticated || !user || !userData) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen container bg-black text-white p-4">
      <Card className="bg-gray-900/50 border-0 p-4 mb-6">
        <div className="flex text-center items-center justify-center flex-col gap-4">
          <Avatar className="h-16 w-16 border-2 border-purple-500">
            <AvatarImage
              src={
                userData.telegram_photo || "/placeholder.svg?height=64&width=64"
              }
              alt={userData.telegram_username || "User"}
            />
            <AvatarFallback>
              {userData.telegram_username?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-white">
              {userData.telegram_username || "Anonymous User"}
            </h1>
            <p className="text-sm text-gray-400">
              Joined {new Date(userData.joined_at).toLocaleDateString()}
            </p>
            {userData.wallet_address && (
              <p className="text-xs text-gray-500 mt-1">
                Wallet: {userData.wallet_address.slice(0, 6)}...
                {userData.wallet_address.slice(-4)}
              </p>
            )}
          </div>
        </div>
      </Card>

      <Card className="bg-gray-900/50 border-0 p-4 mb-6">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Your Referral Link</h2>
            <Button
              variant="ghost"
              size="sm"
              className="text-purple-400 hover:text-purple-300"
              onClick={copyToClipboard}
            >
              <Copy className="h-4 w-4 mr-2" />
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
          <div className="text-sm text-gray-400 break-all">{referralUrl}</div>
        </div>
      </Card>

      <div>
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-5 w-5 text-purple-500" />
          <h2 className="text-sm font-semibold">
            Your Referrals ({referrals.length})
          </h2>
        </div>
        <div className="space-y-3">
          {referrals.map((referral) => (
            <Card key={referral.id} className="bg-gray-900/50 border-0 p-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={referral.avatar} alt={referral.name} />
                  <AvatarFallback>{referral.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{referral.name}</span>
                    <span className="text-sm text-gray-400">
                      Joined{" "}
                      {new Date(referral.joinedDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
