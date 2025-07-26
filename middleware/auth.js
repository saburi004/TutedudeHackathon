// middleware/auth.js or utils/auth.js
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET;

export function verifyJWT(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new Error("Invalid or expired token");
  }
}
