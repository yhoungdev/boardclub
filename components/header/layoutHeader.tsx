import { FC, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { initData, useSignal } from "@telegram-apps/sdk-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Copy } from "lucide-react";

export const LayoutHeader: FC<ILayoutHeaderProps> = ({ title }) => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const initDataState = useSignal(initData.state);
  const user = initDataState?.user;

  const referralUrl = `https://boardclub.vercel.app?ref=${user?.username || ""}`;

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      localStorage.removeItem("tg_auth");
      toast.success("Logged out successfully");
      router.push("/");
      router.refresh();
    } catch (error) {
      toast.error("Failed to logout");
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
      setOpen(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Referral link copied!");
  };

  return (
    <div className="text-white p-4 flex justify-between items-center border-b border-gray-800/50">
      <h1 className="font-semibold text-lg">{title}</h1>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <div className="h-10 w-10 rounded-full overflow-hidden cursor-pointer">
            <Avatar>
              <AvatarImage
                src={user?.photoUrl}
                alt={user?.firstName || "User"}
              />
              <AvatarFallback>
                {user?.firstName?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          </div>
        </DialogTrigger>
        <DialogContent className="bg-gray-900 border-gray-800">
          <DialogHeader>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage
                  src={user?.photoUrl}
                  alt={user?.firstName || "User"}
                />
                <AvatarFallback>
                  {user?.firstName?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle className="text-white text-xl">
                  {user?.firstName} {user?.lastName}
                </DialogTitle>
                <DialogDescription className="text-gray-400">
                  @{user?.username}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-200 mb-2">
              Your Referral Link
            </h3>
            <div className="bg-gray-800 p-3 rounded-lg flex items-center justify-between gap-2">
              <div className="text-sm text-gray-400 truncate">
                {referralUrl}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyToClipboard}
                className="text-purple-400 hover:text-purple-300"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-6 pt-6">
            <Button
              variant="destructive"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              {isLoggingOut ? "Logging out..." : "Logout"}
            </Button>
          </div>

          <div className="flex justify-end mt-4">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="text-gray-400"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
