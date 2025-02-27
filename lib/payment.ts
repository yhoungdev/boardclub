import { toNano } from "ton-core";
import { TonConnectUI } from "@tonconnect/ui-react";
import { ISPRODUCTION } from "@/constant";

export const sendPayment = async (
  tonConnectUI: TonConnectUI,
  receiverAddress: string,
  amount: string = ISPRODUCTION ? "1" : "0.2",
) => {
  const tx = {
    validUntil: Math.floor(Date.now() / 1000) + 300,
    messages: [
      {
        address: receiverAddress,
        amount: toNano(amount).toString(),
      },
    ],
  };

  try {
    return await tonConnectUI.sendTransaction(tx);
  } catch (e) {
    console.error(e);
    throw e;
  }
};
