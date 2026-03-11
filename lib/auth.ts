import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "monSecretSuperSecret";

export function verifyToken(token?: string) {
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}