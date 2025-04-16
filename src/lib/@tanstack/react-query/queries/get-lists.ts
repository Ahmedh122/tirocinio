import { apiClient } from '../../../ky/api-client';
import { queryOptions, UndefinedInitialDataOptions } from '@tanstack/react-query';



export type GetListsSuccessResponse = {
    _id: string;
    name: string;
    fileCount: number;
  }[];

export type GetListErrorResponse = unknown;

export async function getLists({signal}:{signal?:AbortSignal} ){
  const url = 'lists';
  const response = await apiClient.get(url, { signal }).json<GetListsSuccessResponse>();
  return response;
}

    export function getListsOptions<TSelectedResponse = GetListsSuccessResponse>(
        options?: Omit<
          UndefinedInitialDataOptions<
            GetListsSuccessResponse,
            GetListErrorResponse,
            TSelectedResponse,
            ["lists"]
          >,
          'queryKey' | 'queryFn'
        >,
      ) {
        return queryOptions({
          ...options,
          queryKey: ["lists"],
          async queryFn({ signal }) {
            const response = await getLists({
              signal,
            });
           
            return response;
          },
        });
      }
