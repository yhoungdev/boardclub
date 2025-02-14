"use client";
import { Medal } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import { supabase } from "@/config/supabase";

interface User {
  id: number;
  name: string;
  coins: number;
  earnsPerSec: number;
  avatar: string;
  referrals: number;
}

export default function Leaderboard() {
  const [topUsers, setTopUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .order("referrals", { ascending: false });

      if (error) {
        console.error("Error fetching users:", error);
      } else {
        setTopUsers(data);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen container bg-black text-white p-4">
      

      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold mb-1">LeaderBoard</h1>
         
        </div>
       
      </div>

      <Card className="bg-gray-900/50 border-0 p-4 mb-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12 border-2 border-purple-500">
            <AvatarImage
              src="/placeholder.svg?height=48&width=48"
              alt="MrTarahzad"
            />
            <AvatarFallback>MT</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold">MrTarahzad</span>
              <span className="text-yellow-500">🪙</span>
              <span>{topUsers[0]?.coins?.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-purple-400">
              <span className="font-semibold">12.3k</span>
              <span className="text-gray-400">/ Your Rank</span>
            </div>
          </div>
        </div>
      </Card>

      

      <div>
        <h2 className="text-sm font-semibold mb-4">TOP USER</h2>
        <div className="space-y-3">
          {topUsers.map((user, index) => (
            <Card key={user.id} className="bg-gray-900/50 border-0 p-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{user.name}</span>
                    <span className="text-yellow-500">
                      🪙 {user?.coins?.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <span>{user.earnsPerSec} Earns Per Sec</span>
                    <div className="flex items-center gap-2">
                      {index === 0 && (
                        <span className="text-yellow-500">🥇</span>
                      )}
                      {index === 1 && <span className="text-gray-400">🥈</span>}
                      {index === 2 && (
                        <span className="text-orange-400">🥉</span>
                      )}
                      <span>{index + 1}</span>
                    </div>
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
