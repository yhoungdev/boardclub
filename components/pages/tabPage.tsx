import HomePage from "@/components/pages/homepage";
import Profile from "@/app/profile/page";
import Leaderboard from "@/app/leaderboard/page";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, User, Trophy } from "lucide-react";
import CountDown from "./countDown";

export default function HomeIndex() {
  return (
    <div className="container mx-auto p-4">
      <Tabs defaultValue="home" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="home" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Home
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Leaderboard
          </TabsTrigger>
        </TabsList>

        
        <TabsContent value="home">
          <CountDown/>
        </TabsContent>
        <TabsContent value="profile">
          <Profile />
        </TabsContent>
        <TabsContent value="leaderboard">
          <Leaderboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}
