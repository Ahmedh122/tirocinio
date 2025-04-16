import type { ApiFile } from '../../../../api/types/ApiFile';
import { apiClient } from '../../../ky/api-client';
import { queryOptions, UndefinedInitialDataOptions } from '@tanstack/react-query';


// Define the expected types for the response
export type GetFilesSuccessResponse = {
  content: ApiFile[];
  totalPages: number;
  totalItems: number;
};

export type GetFilesErrorResponse = unknown;



export type GetFilesParams = {
 
  page?: number;
  limit?: number;
  status?: string[];
  sort?: string | null;
  sortMethod?: 1 | -1 | null;
  q?: string;
  search?: Record<string, string>;
};


export  function makeGetFilesQueryKey(params?:GetFilesParams) {
  return ['files', {params}] as const;
}

export async function getFiles({signal, searchParams}:{signal?:AbortSignal, searchParams?: GetFilesParams } ){

  let url = 'files';

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

  const response = await apiClient.get(url, { signal }).json<GetFilesSuccessResponse>();

  
  return response;

}

    export function getFilesOptions<TSelectedResponse = GetFilesSuccessResponse>(
      params: GetFilesParams,
       
        options?: Omit<
          UndefinedInitialDataOptions<
            GetFilesSuccessResponse,
            GetFilesErrorResponse,
            TSelectedResponse,
            ReturnType<typeof makeGetFilesQueryKey>
          >,
          'queryKey' | 'queryFn'
        >,
      ) {
        return queryOptions({
          ...options,
          queryKey: makeGetFilesQueryKey(params),
          async queryFn({ signal }) {
            const response = await getFiles({
              signal,
              searchParams: params,
            });
            console.log("optionsData", response);
            return response;
          },
        });
      }


      