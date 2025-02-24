"use client";
import { ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { init, initData, useSignal } from "@telegram-apps/sdk-react";

export default function AuthCheck({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useSignal(initData.user);

  useEffect(() => {
    init({
      debug: true,
      cssVars: true,
      async: true,
    });

    if (user) {
      const userData = {
        username: user.username,
        firstName: user.first_name,
        lastName: user.last_name,
        id: user.id,
        photoUrl: user.photo_url,
      };
      console.log("Telegram User Details:", userData);
    }
  }, [user]);

  return <>{children}</>;
}
