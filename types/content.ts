import type { User } from "./user";

/**
 * Mirrors the Laravel backend's ContentResource (Day 6: GET /content, Redis-cached list).
 */
export interface Content {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  is_premium: boolean;
  author: Pick<User, "id" | "name">;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}
