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

interface ILayoutHeaderProps {
  title: string;
}

export const LayoutHeader: FC<ILayoutHeaderProps> = ({ title }) => {
  const [open, setOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const initDataState = useSignal(initData.state);
  const user = initDataState?.user;

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

  return (
    <div className="text-white p-4 flex justify-between items-center border-b border-gray-800/50">
      <h1 className="font-semibold text-xl">{title}</h1>
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
            <DialogTitle className="text-white">
              Logout Confirmation
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to logout?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoggingOut}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="bg-red-600 hover:bg-red-700"
            >
              {isLoggingOut ? "Logging out..." : "Logout"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
