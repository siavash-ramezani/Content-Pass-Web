/**
 * Generic Laravel API Resource collection envelope, e.g. { data: [...], links, meta }.
 * `links`/`meta` are optional since not every endpoint paginates.
 */
export interface ApiCollection<T> {
  data: T[];
  links?: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

/** Generic Laravel single-resource envelope, e.g. { data: {...} }. */
export interface ApiResource<T> {
  data: T;
}

/** Laravel's default error response shape, e.g. { message: "Unauthenticated." }. */
export interface ApiErrorBody {
  message: string;
  errors?: Record<string, string[]>;
}
