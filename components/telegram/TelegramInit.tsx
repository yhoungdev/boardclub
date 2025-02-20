"use client";
import { useEffect } from "react";
import { initTg } from "@/lib/initTg";

export default function TelegramInit() {
  useEffect(() => {
    try {
      initTg(process.env.NODE_ENV === "development");
      console.log("Telegram SDK initialized successfully");
    } catch (error) {
      console.error("Failed to initialize Telegram SDK:", error);
    }
  }, []);

  return null;
}
