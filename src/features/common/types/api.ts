type ApiBaseError = {
  message: string;
};

export type ApiError = ApiBaseError & Record<string, unknown>;

export type ApiResponse<T = unknown, E = ApiError> =
  | { data: T; error: undefined }
  | { data: undefined; error: E };
