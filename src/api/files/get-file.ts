import type { Options } from 'ky';

import { apiClient } from '../../lib/ky/api-client';
import type { ApiResponse , ApiErrorResponse} from '../../types/api-response';
import type { ApiFile } from '../types/api-file';
import type { Result } from '../types/result';

export type GetFileSuccessResponse = Pick<ApiFile, '_id' | 'type'> & {
  type_id: string;
  status: string;
  pdf: {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    buffer: string;
    size: number;
  };
  result: Result;
};

export type GetFileErrorResponse = unknown;

export type GetFileResponse = ApiResponse<GetFileSuccessResponse, GetFileErrorResponse>;

export async function getFile(id: string, options?: Options) {
  const response = await apiClient.get(`files/${id}`, options).json<GetFileResponse>();

  if ((response as ApiErrorResponse<GetFileErrorResponse>).error) {
    throw response;
  }

  return response.data as GetFileSuccessResponse;
}