import { Hono } from "hono";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { generateTokens, verifyToken } from "../utils/jwt";
import { authMiddleware } from "../middleware/auth";
import '../types/hono';

const prisma = new PrismaClient();
const auth = new Hono();

// バリデーションスキーマ
const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// サインアップ
auth.post("/signup", async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, name } = signupSchema.parse(body);

    // 既存ユーザーチェック
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return c.json({ error: "User already exists" }, 400);
    }

    // パスワードハッシュ化
    const hashedPassword = await bcrypt.hash(password, 10);

    // ユーザー作成
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    // JWTトークン生成
    const { accessToken, refreshToken } = generateTokens(user.id);

    return c.json({
      message: "User created successfully",
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: error.errors }, 400);
    }
    console.error(error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// ログイン
auth.post("/login", async (c) => {
  try {
    const body = await c.req.json();
    const { email, password } = loginSchema.parse(body);

    // ユーザー検索
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return c.json({ error: "Invalid email or password" }, 400);
    }

    // パスワード検証
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return c.json({ error: "Invalid email or password" }, 400);
    }

    // JWTトークン生成
    const { accessToken, refreshToken } = generateTokens(user.id);

    return c.json({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: error.errors }, 400);
    }
    console.error(error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// トークンリフレッシュ
auth.post("/refresh", async (c) => {
  try {
    const body = await c.req.json();
    const { refreshToken } = body;

    if (!refreshToken) {
      return c.json({ error: "Refresh token is required" }, 400);
    }

    // リフレッシュトークン検証
    const payload = verifyToken(refreshToken, "refresh");

    if (!payload || typeof payload === "string") {
      return c.json({ error: "Invalid refresh token" }, 401);
    }

    // ユーザー存在確認
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    // 新しいトークンペア生成
    const tokens = generateTokens(user.id);

    return c.json(tokens);
  } catch (error) {
    console.error(error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// ログアウト（クライアント側でトークンを削除するだけなので、実際には何もしない）
auth.post("/logout", (c) => {
  return c.json({ message: "Logged out successfully" });
});

// プロテクテッドルート（テスト用）
auth.get("/me", authMiddleware, async (c) => {
  const userId = c.get("userId");

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    return c.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error(error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

export default auth;
