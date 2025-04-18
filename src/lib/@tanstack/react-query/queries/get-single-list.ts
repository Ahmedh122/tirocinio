import type { ApiFile } from '../../../../api/types/ApiFile';
import { apiClient } from '../../../ky/api-client';
import { queryOptions, UndefinedInitialDataOptions } from '@tanstack/react-query';



export type GetListSuccessResponse = {
  content: ApiFile[];
  totalPages: number;
  totalItems: number;
  } 

export type GetListErrorResponse = unknown;





export type GetListParams = {
  id: string;
  page?: number;
  limit?: number;
  status?: string[];
  sort?: string | null;
  sortMethod?: 1 | -1 | null;
  q?: string;
  search?: Record<string, string>;
};


export  function makeGetListQueryKey(params:GetListParams) {
  return ['list', {params}] as const;
}

export async function getList({signal, id}:{signal?:AbortSignal, id: string} ){
  const response = await apiClient.get(`lists/${id}`, { signal }).json<GetListSuccessResponse>();
  return response;

}




    export function getListOptions<TSelectedResponse = GetListSuccessResponse>(
        params: GetListParams,
       
        options?: Omit<
          UndefinedInitialDataOptions<
            GetListSuccessResponse,
            GetListErrorResponse,
            TSelectedResponse,
            ReturnType<typeof makeGetListQueryKey>
          >,
          'queryKey' | 'queryFn'
        >,
      ) {
        

        if (!params.id) throw new Error("Missing file ID");
        return queryOptions({
          ...options,
          queryKey: makeGetListQueryKey(params),
          async queryFn({ signal }) {
            const response = await getList({
              signal,
              id: params.id,
            });
            return response;
          },
        });
      }

