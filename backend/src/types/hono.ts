import { MiddlewareHandler } from 'hono';

declare module 'hono' {
  interface ContextVariableMap {
    userId: string;
  }
}

export type AuthMiddleware = MiddlewareHandler;
