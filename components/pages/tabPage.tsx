import HomePage from "@/components/pages/homepage";
import Profile from "@/app/profile/page";
import Leaderboard from "@/app/leaderboard/page";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, User, Trophy } from "lucide-react";
import CountDown from "./countDown";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useState, useEffect } from "react";
import { LayoutHeader } from "../header/layoutHeader";
import SquadPage from "./squad/squad";

const tabItems = [
  {
    value: "home",
    label: "Home",
    icon: Home,
    component: CountDown,
  },
  // {
  //   value: "profile",
  //   label: "Profile",
  //   icon: User,
  //   component: Profile,
  // },
  {
    value: "squad",
    label: "Squad",
    icon: User,
    component: SquadPage,
  },
  {
    value: "leaderboard",
    label: "Leaderboard",
    icon: Trophy,
    component: Leaderboard,
  },
];

export default function HomeIndex() {
  const [currentTab, setCurrentTab] = useState("Home");

  const handleTabChange = (value: string) => {
    const tab = tabItems.find((item) => item.value === value);
    if (tab) {
      setCurrentTab(tab.label);
    }
  };

  return (
    <div className="min-h-screen relative pb-20">
      <LayoutHeader title={currentTab} />

      <Tabs
        defaultValue="home"
        className="w-full"
        onValueChange={handleTabChange}
      >
        <div className="container mx-auto px-4">
          {tabItems.map(({ value, component: Component }) => (
            <TabsContent key={value} value={value}>
              <Component />
            </TabsContent>
          ))}
        </div>

        <TabsList className="fixed bottom-6 left-0 right-0 grid w-full grid-cols-3 bg-black/80 backdrop-blur-sm border-t border-gray-800 pb-15">
          {tabItems.map(({ value, label, icon: Icon }) => (
            <TabsTrigger
              key={value}
              value={value}
              className="flex items-center gap-1 flex-col rounded-full py-2 text-gray-400 data-[state=active]:text-white data-[state=active]:bg-transparent"
            >
              <Icon className="h-4 w-4" />
              <span className="text-xs">{label}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
