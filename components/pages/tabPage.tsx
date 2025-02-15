import HomePage from "@/components/pages/homepage";
import Profile from "@/app/profile/page";
import Leaderboard from "@/app/leaderboard/page";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, User, Trophy } from "lucide-react";
import CountDown from "./countDown";

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
    value: "friends",
    label: "Friends",
    icon: User,
    component: Profile,
  },
  {
    value: "leaderboard",
    label: "Leaderboard",
    icon: Trophy,
    component: Leaderboard,
  },
];

export default function HomeIndex() {
  return (
    <div className="container mx-auto p-4">
      <Tabs defaultValue="home" className="w-full py-2 rounded-full">
        <TabsList className="grid w-full grid-cols-3 bg-white/2 rounded-full">
          {tabItems.map(({ value, label, icon: Icon }) => (
            <TabsTrigger
              key={value}
              value={value}
              className="flex items-center gap-1 flex-col rounded-full py-2 text-gray-400 data-[state=active]:text-white data-[state=active]:bg-transparent"
            >
              <Icon className="h-4 w-4" />
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabItems.map(({ value, component: Component }) => (
          <TabsContent key={value} value={value}>
            <Component />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
