export const DEFAULT_GRADIENT_CLASSNAME = `bg-gradient-to-br from-orange-600 via-[#14132A] to-red-500`;
export const ISPRODUCTION = process.env.NODE_ENV === "production";
export const RECEIPIANTADDRESS = !ISPRODUCTION ?
  "0QA8QyG4BtXJcs7heUjSjxVhAnNfGWVjCZBebZhhILf42BSQ" : "UQCH8lIEKKfgB4YhDcXqa9EZ-mKEpfRRF_m5DqMB7F4mpVc8"
