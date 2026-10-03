import crypto from "crypto";

export const generateApiKey = () => {
  const key = `sk_${crypto.randomBytes(32).toString("hex")}`;

  return key;
};

export const generateApiKeyHash = (apiKey: string) => {
  return crypto.createHash("sha256").update(apiKey).digest("hex");
};
