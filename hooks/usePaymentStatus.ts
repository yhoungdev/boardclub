import { useState, useEffect } from "react";
import { supabase } from "@/config/supabase";
import { initData, useSignal } from "@telegram-apps/sdk-react";

export const usePaymentStatus = () => {
  const [hasPaid, setHasPaid] = useState(false);
  const initDataState = useSignal(initData.state);
  const user = initDataState?.user;

  useEffect(() => {
    const checkPaymentStatus = async () => {
      if (!user) return;

      const { data } = await supabase
        .from("users")
        .select("has_paid")
        .eq("telegram_id", user.id.toString())
        .single();

      setHasPaid(data?.has_paid || false);
    };

    checkPaymentStatus();
  }, [user]);

  return hasPaid;
};
