"use client";
import { useEffect, useMemo } from "react";
import { initData, useSignal } from "@telegram-apps/sdk-react";
import { Card } from "@/components/ui/card";

interface TelegramUser {
  id: number;
  firstName?: string;
  lastName?: string;
  username?: string;
  photoUrl?: string;
  languageCode?: string;
}

export default function TelegramProfile() {
  const initDataRaw = useSignal(initData.raw);
  const initDataState = useSignal(initData.state);

  const user = useMemo(() => {
    return initDataState?.user || null;
  }, [initDataState]);

  useEffect(() => {
    if (initDataState) {
    }
  }, [initDataState]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Telegram Mini App</h1>
      {user ? (
        <Card className="p-6 bg-gray-800/50">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              {user.photoUrl && (
                <img
                  src={user.photoUrl}
                  alt="Profile"
                  className="rounded-full w-20 h-20 object-cover"
                />
              )}
              <div>
                <h2 className="text-xl font-bold">
                  {user.firstName} {user.lastName}
                </h2>
                {user.username && (
                  <p className="text-gray-400">@{user.username}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-gray-900/50 p-3 rounded">
                <p className="text-sm text-gray-400">ID</p>
                <p className="font-medium">{user.id}</p>
              </div>
              <div className="bg-gray-900/50 p-3 rounded">
                <p className="text-sm text-gray-400">Language</p>
                <p className="font-medium">{user.languageCode}</p>
              </div>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="p-4 bg-gray-800/50">
          <p className="text-gray-400">Loading user data...</p>
        </Card>
      )}
    </div>
  );
}
