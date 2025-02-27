"use client";
import { Medal } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import { supabase } from "@/config/supabase";

interface User {
  id: number;
  telegram_username: string;
  telegram_photo: string;
  referral_count: number;
}

export default function Leaderboard() {
  const [topUsers, setTopUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from("users")
        .select(`
          id,
          telegram_username,
          telegram_photo,
          referred_by
        `)
        .not('telegram_username', 'is', null);

      if (error) {
        console.error("Error fetching users:", error);
      } else {
      
        const referralCounts = data.reduce((acc, user) => {
          if (user.referred_by) {
            acc[user.referred_by] = (acc[user.referred_by] || 0) + 1;
          }
          return acc;
        }, {});


        const formattedUsers = data
          .map(user => ({
            id: user.id,
            name: user.telegram_username,
            avatar: user.telegram_photo,
            referrals: referralCounts[user.telegram_username] || 0
          }))
          .sort((a, b) => b.referrals - a.referrals) 
          .slice(0, 50); 

        setTopUsers(formattedUsers);
      }
      setIsLoading(false);
    };

    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen container bg-black text-white p-4">
      <div>
        <h2 className="text-sm font-semibold mb-4">TOP REFERRERS</h2>
        <div className="space-y-3">
          {isLoading ? (
            <div className="flex items-center gap-3 border-[1px] border-gray-500/20 bg-gray-800/40 px-4 py-4 rounded-2xl">
              <Avatar className="h-10 w-10">
                <AvatarImage src="" alt="User" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">Loading...</span>
                  <span className="text-yellow-500 font-bold">👥 #1</span>
                </div>
              </div>
            </div>
          ) : (
            topUsers?.map((user, index) => (
              <Card key={user.id} className="bg-gray-900/50 border-0 p-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name?.[0]?.toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">@{user.name}</span>
                      <span className="text-yellow-500">
                        👥 {user.referrals}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <span>Referral Count</span>
                      <div className="flex items-center gap-2">
                        {index === 0 && <span className="text-yellow-500">🥇</span>}
                        {index === 1 && <span className="text-gray-400">🥈</span>}
                        {index === 2 && <span className="text-orange-400">🥉</span>}
                        <span>#{index + 1}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
