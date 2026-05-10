import type { ApiError } from "./errors";

export type ID = string;
export type ISODateTime = string;
export type ISODate = string;

export type ApiResponse<T> =
  | { ok: true; data: T; requestId?: string }
  | { ok: false; error: ApiError; requestId?: string };

export type PaginatedResponse<T> = {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
};

export type ApiEndpoint<Request, Response> = {
  request: Request;
  response: ApiResponse<Response>;
};

export type EmptyRequest = Record<string, never>;
