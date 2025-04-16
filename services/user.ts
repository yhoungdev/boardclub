import { supabase } from "@/config/supabase";
import { generateReferralCode } from "@/utils/referral";

interface CreateUserParams {
  telegramId: string;
  username: string;
  photoUrl: string;
  walletAddress: string;
  publicKey: string;
  referredBy?: string;
}

export const createUser = async ({
  telegramId,
  username,
  photoUrl,
  walletAddress,
  publicKey,
  referredBy,
}: CreateUserParams) => {
  try {
    if (referredBy) {
      const { data: referrer } = await supabase
        .from("users")
        .select("referral_code")
        .eq("referral_code", referredBy)
        .single();

      if (!referrer) {
        throw new Error("Invalid referral code");
      }
    }

    const newReferralCode = generateReferralCode();
    const refUrl = `https://t.me/kryptronitebot?start=${newReferralCode}`;

    const { data, error: userError } = await supabase
      .from("users")
      .insert([
        {
          id: crypto.randomUUID(),
          telegram_id: telegramId,
          telegram_username: username,
          telegram_photo: photoUrl,
          wallet_address: walletAddress,
          joined_at: new Date().toISOString(),
          has_paid: false,
          referal_url: refUrl,
          referred_by: referredBy || null,
          referral_code: newReferralCode,
          created_at: new Date().toISOString(),
          referal_count: 0,
        },
      ])
      .select()
      .single();

    if (userError) {
      console.error("Supabase error:", userError);
      throw new Error(userError.message);
    }

    if (referredBy) {
      const { error: updateError } = await supabase.rpc(
        "increment_referral_count",
        {
          ref_code: referredBy,
        },
      );

      if (updateError) {
        console.error("Failed to update referrer count:", updateError);
      }
    }

    return data.referral_code;
  } catch (error) {
    console.error("Create user error:", error);
    throw error;
  }
};
