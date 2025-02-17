import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import IndexApplicationProvider from "@/providers/indexProvider";


export const metadata: Metadata = {
  title: "Krotronite",
  description: "Join a network of investors and traders who collaborate to strategically boost promising tokens",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`container antialiased`}
      >
        <IndexApplicationProvider>{children}</IndexApplicationProvider>
        <Toaster richColors={true} position={"top-center"} />
      </body>
    </html>
  );
}
