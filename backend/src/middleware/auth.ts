import { Context, Next } from "hono";
import { verifyToken } from "../utils/jwt";
import '../types/hono';

export const authMiddleware = async (c: Context, next: Next) => {
  // Authorization ヘッダーからトークン取得
  const authHeader = c.req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json({ error: "Unauthorized - No token provided" }, 401);
  }

  const token = authHeader.split(" ")[1];

  // トークン検証
  const payload = verifyToken(token, "access");

  if (!payload || typeof payload === "string") {
    return c.json({ error: "Unauthorized - Invalid token" }, 401);
  }

  // ユーザーIDをコンテキストに設定
  c.set("userId", payload.userId);

  await next();
};
