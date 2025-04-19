export const DEFAULT_GRADIENT_CLASSNAME = `bg-gradient-to-br from-orange-600 via-[#14132A] to-red-500`;
export const ISPRODUCTION = process.env.NODE_ENV === "production";
export const RECEIPIANTADDRESS = !ISPRODUCTION
  ? "0QA8QyG4BtXJcs7heUjSjxVhAnNfGWVjCZBebZhhILf42BSQ"
  : "UQC3RGJEXhB-DuDUXN8h6XapsWwcNdQejGEK9mXS_a5cVUc2";
