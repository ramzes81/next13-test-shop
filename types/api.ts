export interface FieldErrorMessage {
  field: string;
  msg: string;
}

export interface ErrorApiResponse {
  errors: FieldErrorMessage[];
}

export type ApiResponse<T> = T | ErrorApiResponse;
