import type { SimplifyDeep } from 'type-fest';

export type ApiSuccessResponse<TData> = {
  data: TData;
  status: number;
  error: null;
};

export type ApiErrorResponse<TError> = {
  data: null;
  status: number;
  error: TError;
};

export type ApiResponse<TData, TError> = SimplifyDeep<
  ApiSuccessResponse<TData> | ApiErrorResponse<TError>
>;
