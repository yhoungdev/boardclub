export const generateReferralCode = () => {
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const validateReferralCode = (code: string) => {
  const pattern = /^[0-9A-Z]{6}$/;
  return pattern.test(code);
};
