import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import dotenv from "dotenv";
import authController from "./controllers/auth";

// 環境変数の読み込み
dotenv.config();

const app = new Hono();

// ミドルウェア
app.use("*", logger());
app.use(
  "*",
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

// ヘルスチェック
app.get("/", (c) => {
  return c.json({ message: "Auth API is running!" });
});

// ルート
app.route("/api/auth", authController);

// サーバー起動
const port = process.env.PORT ? parseInt(process.env.PORT) : 3001;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
