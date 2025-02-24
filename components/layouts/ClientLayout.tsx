"use client";
import IndexApplicationProvider from "@/providers/indexProvider";
import TelegramInit from "@/components/telegram/TelegramInit";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <TelegramInit />
      <IndexApplicationProvider>{children}</IndexApplicationProvider>
    </>
  );
}
