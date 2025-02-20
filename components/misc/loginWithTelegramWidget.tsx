import { useEffect, useRef } from "react";

interface TelegramLoginButtonProps {
  botName: string;
  onAuth: (user: TelegramUser) => void;
  buttonSize?: "large" | "medium" | "small";
  cornerRadius?: number;
  requestAccess?: boolean;
}

interface TelegramUser {
  id: number;
  first_name: string;
  username: string;
  photo_url: string;
  auth_date: number;
  hash: string;
}

declare global {
  interface Window {
    TelegramLoginWidget: {
      dataOnauth: (user: TelegramUser) => void;
    };
  }
}

export const TelegramLoginButton: React.FC<TelegramLoginButtonProps> = ({
  botName = "boarding_club_bot",
  onAuth,
  buttonSize = "large",
  cornerRadius = 4,
  requestAccess = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const existingScripts =
        containerRef.current.getElementsByTagName("script");
      while (existingScripts.length > 0) {
        existingScripts[0].remove();
      }
    }

    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.setAttribute("data-telegram-login", "boarding_club_bot");
    script.setAttribute("data-size", buttonSize);
    script.setAttribute("data-radius", cornerRadius.toString());
    script.setAttribute("data-request-access", "write");
    script.setAttribute("data-onauth", "TelegramLoginWidget.dataOnauth(user)");
    script.async = true;

    window.TelegramLoginWidget = {
      dataOnauth: (user: TelegramUser) => {
        onAuth(user);
      },
    };

    if (containerRef.current) {
      containerRef.current.appendChild(script);
    }

    return () => {
      if (containerRef.current) {
        const scripts = containerRef.current.getElementsByTagName("script");
        while (scripts.length > 0) {
          scripts[0].remove();
        }
      }
    };
  }, [botName, buttonSize, cornerRadius, requestAccess, onAuth]);

  return (
    <div ref={containerRef} className="flex justify-center items-center"></div>
  );
};
