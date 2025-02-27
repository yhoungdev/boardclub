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
import moment from "moment";
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
      if (!userData?.referral_code) return;

      const { data, error } = await supabase
        .from("users")
        .select(
          `
          id,
          telegram_username,
          telegram_photo,
          joined_at
        `,
        )
        .eq("referred_by", userData.referral_code);

      if (error) {
        console.error("Error fetching referrals:", error);
      } else {
        const formattedReferrals = data?.map((user) => ({
          id: user.id,
          name: user.telegram_username,
          avatar: user.telegram_photo,
          joinedDate: user.joined_at,
        }));
        setReferrals(formattedReferrals || []);
      }
    };

    if (userData) {
      fetchReferrals();
    }
  }, [userData]);

  const copyToClipboard = () => {
    const inviteText = `${userData?.telegram_username} is inviting you to join Kryptronite, use their INVITE code ${userData?.referral_code} to sign in`;
    navigator?.clipboard.writeText(inviteText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Referral message copied!");
  };

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card className="p-6 bg-gray-900/50 border-0">
          <h2 className="text-2xl font-bold mb-4 text-white">Your Squad</h2>
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-gray-400">Total Members</p>
              <p className="text-3xl font-bold text-gray-300">
                {referrals?.length}
              </p>
            </div>
            <Button
              onClick={copyToClipboard}
              variant="outline"
              className="flex items-center gap-2 text-xs"
            >
              {copied ? "Copied!" : "Share Invite"}
              <Copy className="h-4 w-4" />
            </Button>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4 text-white">
              Squad Members
            </h3>
            <div className="space-y-4">
              {referrals?.length > 0 ? (
                referrals?.map((referral) => (
                  <div
                    key={referral.id}
                    className="flex items-center justify-between bg-gray-800/30 p-3 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={referral?.avatar} />
                        <AvatarFallback>
                          {referral?.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-white">
                          @{referral?.name}
                        </p>
                        <p className="text-sm text-gray-400">
                          Joined {moment(referral?.joinedDate).fromNow()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <p className="text-center text-gray-400 mb-4">
                    No squad members yet. Share your link to grow your team!
                  </p>
                  <div className="space-y-4">
                    {[
                      { icon: "🥉", name: "Bronze", range: "0 - 4" },
                      { icon: "🥈", name: "Silver", range: "5 - 19" },
                      { icon: "🥇", name: "Gold", range: "20 - 49" },
                      { icon: "🏆", name: "Platinum", range: "50 - 99" },
                      { icon: "💎", name: "Diamond", range: "100+" },
                    ].map((level, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="flex items-center gap-2 text-white">
                          {level.icon} {level.name}
                        </span>
                        <span className="text-white">{level.range}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
