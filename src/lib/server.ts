import { createHash, randomBytes } from "crypto";

export const generateToken = () => randomBytes(32).toString("hex");
export const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");
export const verifyToken = (token: string, hashedToken: string) => {
  const hash = createHash("sha256").update(token).digest("hex");
  return hash === hashedToken;
};
