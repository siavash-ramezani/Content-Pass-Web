import type { User } from "./user";

/** Assumption — verify against the backend's actual enum values. */
export type ContentType = "article" | "video" | "download";

/**
 * Mirrors the Laravel backend's ContentResource (Day 6: GET /content, Redis-cached list).
 * `accessible` reflects whether the *authenticated* requester's plan grants access to
 * this item (true for free content, or premium content the user's plan covers).
 */
export interface Content {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  type: ContentType;
  is_premium: boolean;
  accessible: boolean;
  author: Pick<User, "id" | "name">;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}
