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


export  function makeGetListQueryKey(params : GetListParams) {
  return ['list', {params}] as const;
}

export async function getList({signal, id, searchParams}:{signal?:AbortSignal, id: string,  searchParams?: GetListParams } ){

  let url = `lists/${id}`;

  if (searchParams) {
    const urlSearchParams = new URLSearchParams();

   

    if (searchParams.page) {
      urlSearchParams.append('page', String(searchParams.page));
    }

    if (searchParams.limit) {
      urlSearchParams.append('limit', String(searchParams.limit));
    }

    if (searchParams.status?.length) {
      for (const status of searchParams.status) {
        urlSearchParams.append('status[]', status);
      }
    }

    if (searchParams.sort === 'file_name') {
      urlSearchParams.append('sort', 'pdf.originalname');
    } else if (searchParams.sort === 'status' || searchParams.sort === 'uploaded') {
      urlSearchParams.append('sort', searchParams.sort);
    } else if (searchParams.sort) {
      urlSearchParams.append('sort', `result.CAMPI.${searchParams.sort}`);
    }

    if (searchParams.sortMethod !== null && searchParams.sortMethod !== undefined) {
      urlSearchParams.append('sortMethod', String(searchParams.sortMethod));
    }

    if (searchParams.q) {
      urlSearchParams.append('q', searchParams.q);
    }
    if (searchParams.search) {
      for (const [key, value] of Object.entries(searchParams.search)) {
        if (value && key === 'file_name') {
          urlSearchParams.append('search[pdf.originalname]', value);
        } else if (value) {
          urlSearchParams.append(`search[result.CAMPI.${key}]`, value);
        }
      }
    }

    url += `?${urlSearchParams.toString()}`;
  }
  const response = await apiClient.get(url, { signal }).json<GetListSuccessResponse>();
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
              searchParams : params
            });
            return response;
          },
        });
      }

