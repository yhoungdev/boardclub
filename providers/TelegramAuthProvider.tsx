"use client";
import { createContext, useContext, useEffect, useState } from "react";

interface TelegramUser {
  id: number;
  username?: string;
  photo_url?: string;
  first_name?: string;
}

interface TelegramAuthContext {
  user: TelegramUser | null;
  authenticated: boolean;
  ready: boolean;
}

const TelegramAuthContext = createContext<TelegramAuthContext>({
  user: null,
  authenticated: false,
  ready: false,
});

export function TelegramAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;

    if (tg) {
      setReady(true);
      if (tg.initDataUnsafe?.user) {
        setUser(tg.initDataUnsafe.user);
        setAuthenticated(true);
      }
    }
  }, []);

  return (
    <TelegramAuthContext.Provider value={{ user, authenticated, ready }}>
      {children}
    </TelegramAuthContext.Provider>
  );
}

export const useTelegramAuth = () => useContext(TelegramAuthContext);
