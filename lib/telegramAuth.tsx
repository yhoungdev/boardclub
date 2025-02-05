import { useEffect } from "react";

const TelegramLogin = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.async = true;
    script.setAttribute("data-telegram-login", "sigmart_signal_bot"); // Replace with your bot's username
    script.setAttribute("data-size", "large"); // Options: small, medium, large
    script.setAttribute("data-request-access", "write"); // Request access type
    script.setAttribute("data-onauth", "onTelegramAuth(user)"); // JS function to handle authentication

    document.getElementById("telegram-login-container")?.appendChild(script);

    window.onTelegramAuth = (user) => {
      alert(
        `Logged in as ${user.first_name} ${user.last_name} (${user.id}${
          user.username ? `, @${user.username}` : ""
        })`,
      );
    };
  }, []);

  return <div id="telegram-login-container"></div>;
};

export default TelegramLogin;
