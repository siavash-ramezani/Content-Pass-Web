/**
 * Mirrors the Laravel backend's UserResource.
 * Role names assume the RBAC setup from the backend (Day 1-7): admin, editor, subscriber.
 */
export type UserRole = "admin" | "editor" | "subscriber";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}
