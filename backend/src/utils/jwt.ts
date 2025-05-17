import * as jwt from "jsonwebtoken";
import { Secret, SignOptions, JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = (process.env.JWT_SECRET ||
  "fallback-secret-do-not-use-in-production") as Secret;
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY || "15m";
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY || "7d";

interface TokenPayload {
  userId: string;
  type: "access" | "refresh";
}

type TokenType = "access" | "refresh";

export const generateTokens = (userId: string) => {
  const payload: TokenPayload = { userId, type: "access" };
  const refreshPayload: TokenPayload = { userId, type: "refresh" };

  // アクセストークン生成
  const accessToken = jwt.sign(payload, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  } as SignOptions);

  // リフレッシュトークン生成
  const refreshToken = jwt.sign(refreshPayload, JWT_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  } as SignOptions);

  return { accessToken, refreshToken };
};

export const verifyToken = (token: string, type: TokenType) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    // トークンタイプ検証
    if (decoded && decoded.type !== type) {
      return null;
    }

    return decoded;
  } catch (error) {
    return null;
  }
};
