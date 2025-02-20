import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import IndexApplicationProvider from "@/providers/indexProvider";
import Script from "next/script";
import { initTg } from "@/lib/initTg";
import TelegramInit from "@/components/telegram/TelegramInit";

export const metadata: Metadata = {
  title: "Krotronite.",
  description: "Join a network of investors and traders who collaborate to strategically boost promising tokens",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="beforeInteractive"
        />
      </head>
      <body
        className={`container antialiased`}
      >
         <TelegramInit/>
        <IndexApplicationProvider>{children}</IndexApplicationProvider>
        <Toaster richColors={true} position={"top-center"} />
      </body>
    </html>
  );
}
