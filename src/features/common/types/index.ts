export type RouteHandlerResponse<T = unknown> =
  | { error: null; data: T }
  | { data: null; error: { message: string } };
